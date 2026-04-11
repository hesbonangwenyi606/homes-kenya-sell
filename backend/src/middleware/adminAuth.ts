import { Response, NextFunction } from 'express';
import { supabaseAuth } from '../lib/supabase';
import { AuthRequest } from './auth';

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Requires the request to carry a valid Supabase JWT whose email is listed
 * in the ADMIN_EMAILS environment variable.
 */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
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

  const email = data.user.email?.toLowerCase() ?? '';
  if (!adminEmails.includes(email)) {
    res.status(403).json({ error: 'Forbidden: admin access required' });
    return;
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
}
