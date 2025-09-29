import { Router } from 'express';
import { classifyText } from '../services/nlp';
import { searchKnowledge } from '../services/knowledge';
import { v4 as uuidv4 } from 'uuid';
import { addTicket } from '../services/storage';
import { routeTicket } from '../services/router';
import { Ticket } from '../types';

const router = Router();

router.post('/', async (req, res) => {
  const { message, requester } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  const cls = await classifyText(message);

  // Simple intents for self-service
  const lower = message.toLowerCase();
  if (lower.includes('reset') && lower.includes('password')) {
    const kb = await searchKnowledge('password reset', ['Access & Identity']);
    return res.json({
      reply: 'It looks like you need a password reset. Here are steps that often resolve this:',
      knowledge: kb,
      intent: 'password_reset',
      category: cls.category,
      resolved: true,
    });
  }
  if (lower.includes('vpn')) {
    const kb = await searchKnowledge('vpn access', ['Network']);
    return res.json({
      reply: 'For VPN access issues, try these steps or request access using the link:',
      knowledge: kb,
      intent: 'vpn_access',
      category: cls.category,
      resolved: false,
    });
  }

  // If not resolved, option to create a ticket
  if (req.query.create === 'true') {
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      title: message.slice(0, 80),
      description: message,
      source: 'chatbot',
      priority: 'medium',
      status: 'open',
      requester: requester || {},
      category: cls.category,
    };
    ticket.assigneeTeam = routeTicket(ticket);
    await addTicket(ticket);
    return res.status(201).json({ reply: 'Ticket created', ticket });
  }

  res.json({
    reply:
      'I categorized your issue. Would you like me to create a ticket? Send again with ?create=true to proceed.',
    category: cls.category,
    confidence: cls.confidence,
    knowledge: cls.suggestedArticles,
  });
});

export default router;
