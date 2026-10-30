import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const secret = () => process.env.QR_HMAC_SECRET;
const signature = body => createHmac('sha256', secret()).update(body).digest('base64url');
export function createQrToken({ sessionId, studentId, ttlSeconds = 120 }) {
  const payload = { jti: randomUUID(), sessionId, studentId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${signature(body)}`;
}
export function readQrToken(token) {
  const [body, supplied] = token.split('.');
  const expected = body ? Buffer.from(signature(body)) : Buffer.alloc(0);
  const actual = supplied ? Buffer.from(supplied) : Buffer.alloc(0);
  if (!body || expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error('Invalid QR signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('QR token expired');
  return payload;
}
