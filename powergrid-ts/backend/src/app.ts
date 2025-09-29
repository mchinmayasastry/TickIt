import express from 'express';
import cors from 'cors';
import path from 'path';
import ticketsRouter from './routes/tickets';
import ingestRouter from './routes/ingest';
import chatbotRouter from './routes/chatbot';
import knowledgeRouter from './routes/knowledge';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/tickets', ticketsRouter);
app.use('/api/ingest', ingestRouter);
app.use('/api/chat', chatbotRouter);
app.use('/api/knowledge', knowledgeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'POWERGRID Unified Ticketing System API is running' });
});

// Serve minimal frontend
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

export default app;
