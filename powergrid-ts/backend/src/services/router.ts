import { Ticket } from '../types';

// Very simple routing logic based on category/priority. Extend as needed.
export function routeTicket(ticket: Ticket): string {
  const byCategory: Record<string, string> = {
    'Access & Identity': 'IAM Team',
    Network: 'Network Ops',
    Email: 'Messaging Team',
    Hardware: 'Desktop Support',
    Software: 'Application Support',
    SAP: 'SAP Basis',
    Helpdesk: 'Service Desk',
    General: 'Service Desk',
  };

  const base = byCategory[ticket.category || 'General'] || 'Service Desk';
  if (ticket.priority === 'critical') return `${base} - P1`;
  if (ticket.priority === 'high') return `${base} - P2`;
  return base;
}
