import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../lib/jwtAuth';

export interface AdminRequest extends Request {
  adminEmail?: string;
}

export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  try {
    const payload = verifyAdminToken(authHeader.slice(7));
    if (payload.role !== 'admin') throw new Error('Not admin');
    req.adminEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
