import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'hemaprin-homes-change-in-production';

export interface AdminPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET) as AdminPayload;
}
