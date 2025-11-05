import type { Request, Response, NextFunction } from 'express';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';

export async function authenticateRequest(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    // Delegate verification to user-service
    const verifyResponse = await fetch(`${USER_SERVICE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (!verifyResponse.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const payload = await verifyResponse.json().catch(() => ({}));
    // Attach identity for downstream use if needed
    console.log({ payload });
    
    (req as any).user = payload?.user || null;
    next();
  } catch (err) {
    console.error('Auth verification failed', err);
    return res.status(401).json({ error: 'Auth verification failed' });
  }
}


