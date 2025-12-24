import { Router } from 'express';
import type { Request, Response, Router as ExpressRouter } from 'express';
import { authenticateRequest } from '../security/auth.middleware.js';
import { checkAIQuestionQuota } from '../security/quota.middleware.js';
import { generateQuestionsHandler } from '../services/genai.service.js';

export const genaiRouter: ExpressRouter = Router();

genaiRouter.post(
  '/generate-questions',
  authenticateRequest,
  checkAIQuestionQuota, // Check quota with user-service
  async (req: Request, res: Response) => {
    const { topic, count } = req.body ?? {};
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Invalid topic' });
    }
    const safeCount = Math.max(1, Math.min(100, Number(count || 10)));
    try {
      const fields = await generateQuestionsHandler({ topic, count: safeCount });
      return res.json(fields);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Generation failed' });
    }
  }
);


