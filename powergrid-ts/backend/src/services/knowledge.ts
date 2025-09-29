import { promises as fs } from 'fs';
import path from 'path';
import { KnowledgeArticle } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const KB_FILE = path.join(DATA_DIR, 'knowledge.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<KnowledgeArticle[]> {
  await ensureDataDir();
  try {
    const buf = await fs.readFile(KB_FILE, 'utf-8');
    return JSON.parse(buf) as KnowledgeArticle[];
  } catch (err: any) {
    if (err.code === 'ENOENT') return seed();
    throw err;
  }
}

async function writeAll(items: KnowledgeArticle[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(KB_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function normalize(str: string) {
  return str.toLowerCase();
}

export async function seed(): Promise<KnowledgeArticle[]> {
  const items: KnowledgeArticle[] = [
    {
      id: 'kb-001',
      title: 'Reset your POWERGRID account password',
      content: 'Use the Self-Service Password Reset portal or contact Service Desk.',
      tags: ['password', 'reset', 'account', 'access'],
      url: '#',
    },
    {
      id: 'kb-002',
      title: 'Request VPN access',
      content: 'Submit a VPN access request and install the approved VPN client.',
      tags: ['vpn', 'network', 'access'],
      url: '#',
    },
    {
      id: 'kb-003',
      title: 'Outlook not syncing',
      content: 'Check connectivity, reset profile, or repair Office.',
      tags: ['email', 'outlook'],
      url: '#',
    },
  ];
  await writeAll(items);
  return items;
}

export async function listKnowledge(): Promise<KnowledgeArticle[]> {
  return readAll();
}

export async function addKnowledge(article: KnowledgeArticle): Promise<KnowledgeArticle> {
  const items = await readAll();
  items.push(article);
  await writeAll(items);
  return article;
}

export async function searchKnowledge(query: string, preferredTags?: string[]): Promise<KnowledgeArticle[]> {
  const items = await readAll();
  const q = normalize(query);
  let results = items.filter(
    a => normalize(a.title + ' ' + a.content + ' ' + a.tags.join(' ')).includes(q)
  );
  if (preferredTags && preferredTags.length) {
    const set = new Set(preferredTags.map(t => normalize(t)));
    results = results.sort((a, b) => {
      const scoreA = a.tags.reduce((s, t) => (set.has(normalize(t)) ? s + 1 : s), 0);
      const scoreB = b.tags.reduce((s, t) => (set.has(normalize(t)) ? s + 1 : s), 0);
      return scoreB - scoreA;
    });
  }
  return results.slice(0, 5);
}
