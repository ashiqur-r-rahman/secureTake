import { verifyAccessToken } from './tokens.js';
export function requireAuth(role) { return (req, res, next) => { const token = req.get('authorization')?.replace(/^Bearer\s+/i, ''); const user = token && verifyAccessToken(token); if (!user || (role && user.role !== role)) return res.status(401).json({ error: 'Unauthorized' }); req.user = user; next(); }; }
