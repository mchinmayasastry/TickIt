import { Ticket } from '../types';

// Minimal notifier stub. Replace with real email/Teams integration as needed.
export async function notifyOnTicketEvent(
  event: 'created' | 'updated',
  ticket: Ticket
): Promise<void> {
  try {
    // For now, just log. This keeps the server running without external config.
    console.log(`[notify] Event: ${event} | Ticket: ${ticket.id} | Title: ${ticket.title}`);
  } catch (err) {
    // Ensure notifications never crash the request flow
    console.warn('[notify] Failed to send notification:', err);
  }
}
