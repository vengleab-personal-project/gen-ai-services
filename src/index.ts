import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { genaiRouter } from './routes/genai.routes.js';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/genai', genaiRouter);

export default app;