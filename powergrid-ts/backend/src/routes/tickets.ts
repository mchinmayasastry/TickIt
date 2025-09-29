import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addTicket, getTicketById, readTickets, writeTickets } from '../services/storage';
import { classifyText } from '../services/nlp';
import { routeTicket } from '../services/router';
import { notifyOnTicketEvent } from '../services/notify';
import { Ticket } from '../types';

const router = Router();

// List tickets
router.get('/', async (_req, res) => {
  const tickets = await readTickets();
  res.json(tickets);
});

// Get by ID
router.get('/:id', async (req, res) => {
  const ticket = await getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Not found' });
  res.json(ticket);
});

// Create ticket
router.post('/', async (req, res) => {
  const { title, description, source = 'web', priority = 'medium', requester = {} } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'title and description are required' });

  const now = new Date().toISOString();
  const base: Ticket = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    title,
    description,
    source,
    priority,
    status: 'open',
    requester,
  };

  // NLP classification
  const classification = await classifyText(`${title} ${description}`);
  base.category = classification.category;

  // Intelligent routing
  base.assigneeTeam = routeTicket(base);

  await addTicket(base);

  // Notifications
  await notifyOnTicketEvent('created', base);

  res.status(201).json(base);
});

// Update ticket status or fields
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const tickets = await readTickets();
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const allowed = ['status', 'priority', 'assigneeTeam', 'category'];
  for (const key of allowed) {
    if (key in req.body) (tickets[idx] as any)[key] = req.body[key];
  }
  tickets[idx].updatedAt = new Date().toISOString();
  await writeTickets(tickets);

  await notifyOnTicketEvent('updated', tickets[idx]);
  res.json(tickets[idx]);
});

export default router;
