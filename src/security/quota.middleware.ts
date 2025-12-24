import type { Request, Response, NextFunction } from 'express';
import { env } from '../env.js';

const USER_SERVICE_URL = env.USER_SERVICE_URL;

/**
 * Check and deduct quota for AI question generation
 * This middleware communicates with the user-service to check quota availability
 */
export async function checkAIQuestionQuota(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const user = (req as any).user;
  if (!user || !user.id) {
    return res.status(403).json({ error: 'User not authenticated' });
  }

  try {
    // Check quota with user-service
    const quotaResponse = await fetch(`${USER_SERVICE_URL}/api/quota/check`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        resourceType: 'aiQuestionsGenerated',
        amount: 1,
      }),
    });

    if (!quotaResponse.ok) {
      const errorData = await quotaResponse.json().catch(() => ({}));
      
      if (quotaResponse.status === 429) {
        return res.status(429).json({
          error: 'Quota exceeded',
          message: errorData.message || 'You have exhausted your AI question generation quota',
          remaining: errorData.remaining || 0,
          planType: errorData.planType,
          upgrade: errorData.upgrade,
        });
      }
      
      return res.status(quotaResponse.status).json({
        error: 'Quota check failed',
        message: errorData.message || 'Failed to verify quota',
      });
    }

    const quotaData = await quotaResponse.json();
    
    // Attach quota info to request for downstream use
    (req as any).quotaInfo = quotaData;
    
    next();
  } catch (err) {
    console.error('Quota check failed', err);
    return res.status(500).json({ 
      error: 'Quota verification failed',
      message: 'Unable to verify quota availability',
    });
  }
}
