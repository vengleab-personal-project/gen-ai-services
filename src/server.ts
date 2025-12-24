import express from 'express';
import cors from 'cors';
import { genaiRouter } from './routes/genai.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/genai', genaiRouter);

export default app;