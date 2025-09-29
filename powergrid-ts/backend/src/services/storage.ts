import { promises as fs } from 'fs';
import path from 'path';
import { Ticket } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readTickets(): Promise<Ticket[]> {
  await ensureDataDir();
  try {
    const buf = await fs.readFile(TICKETS_FILE, 'utf-8');
    return JSON.parse(buf) as Ticket[];
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeTickets(tickets: Ticket[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
}

export async function addTicket(ticket: Ticket): Promise<Ticket> {
  const tickets = await readTickets();
  tickets.push(ticket);
  await writeTickets(tickets);
  return ticket;
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
  const tickets = await readTickets();
  return tickets.find(t => t.id === id);
}
