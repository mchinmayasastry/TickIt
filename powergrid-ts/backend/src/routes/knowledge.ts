import { Router } from 'express';
import { listKnowledge, searchKnowledge } from '../services/knowledge';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await listKnowledge();
  res.json(items);
});

router.get('/search', async (req, res) => {
  const q = (req.query.q as string) || '';
  if (!q) return res.json([]);
  const results = await searchKnowledge(q);
  res.json(results);
});

export default router;
