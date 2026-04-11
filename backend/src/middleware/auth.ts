import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../lib/supabase';

export interface AuthRequest extends Request {
  user?: { id: string; email?: string };
}

/**
 * Requires a valid Supabase JWT in the Authorization header.
 * Attaches the decoded user to req.user.
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
}

/**
 * Optionally extracts the user from the Authorization header.
 * Does NOT reject the request if no token is present.
 */
export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data } = await supabaseAuth.auth.getUser(token);
    if (data.user) {
      req.user = { id: data.user.id, email: data.user.email };
    }
  }
  next();
}
