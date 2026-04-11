import { Request, Response, NextFunction } from 'express';

// Regular user auth — identity is determined by the email they submit in forms.
// No JWT required for public endpoints.
export interface AuthRequest extends Request {
  userEmail?: string;
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  // Clients may pass X-User-Email header to associate submissions with their account.
  const email = req.headers['x-user-email'];
  if (typeof email === 'string' && email) req.userEmail = email.toLowerCase();
  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const email = req.headers['x-user-email'];
  if (!email || typeof email !== 'string') {
    res.status(401).json({ error: 'X-User-Email header required' });
    return;
  }
  req.userEmail = email.toLowerCase();
  next();
}
