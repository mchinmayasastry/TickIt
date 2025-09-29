import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addTicket } from '../services/storage';
import { classifyText } from '../services/nlp';
import { routeTicket } from '../services/router';
import { Ticket } from '../types';

// Simulated unified ingestion endpoints to receive from email, GLPI, Solman
const router = Router();

async function ingestGeneric(payload: any, source: Ticket['source']) {
  const { title, description, priority = 'medium', requester = {} } = payload;
  const now = new Date().toISOString();
  const ticket: Ticket = {
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
  const cls = await classifyText(`${title} ${description}`);
  ticket.category = cls.category;
  ticket.assigneeTeam = routeTicket(ticket);
  await addTicket(ticket);
  return ticket;
}

router.post('/email', async (req, res) => {
  const { subject, body, from } = req.body || {};
  if (!subject || !body) return res.status(400).json({ error: 'subject and body required' });
  const ticket = await ingestGeneric(
    { title: subject, description: body, requester: { email: from }, priority: 'medium' },
    'email'
  );
  res.status(201).json(ticket);
});

router.post('/glpi', async (req, res) => {
  const { title, description, priority, requester } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'title and description required' });
  const ticket = await ingestGeneric({ title, description, priority, requester }, 'glpi');
  res.status(201).json(ticket);
});

router.post('/solman', async (req, res) => {
  const { title, description, priority, requester } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'title and description required' });
  const ticket = await ingestGeneric({ title, description, priority, requester }, 'solman');
  res.status(201).json(ticket);
});

export default router;
