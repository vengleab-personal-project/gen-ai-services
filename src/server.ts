import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { genaiRouter } from './routes/genai.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/genai', genaiRouter);

const port = Number(process.env.PORT || 4002);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[genai-service] listening on : http://localhost:${port}`);
});


