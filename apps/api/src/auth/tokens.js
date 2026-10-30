import { createHmac, timingSafeEqual } from 'node:crypto';

const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const sign = input => createHmac('sha256', process.env.JWT_SECRET).update(input).digest('base64url');
export function issueAccessToken(payload) {
  const body = encode({ ...payload, exp: Math.floor(Date.now() / 1000) + 3600 });
  return `${body}.${sign(body)}`;
}
export function verifyAccessToken(token) {
  const [body, signature] = token.split('.');
  const expected = body ? Buffer.from(sign(body)) : Buffer.alloc(0);
  const supplied = signature ? Buffer.from(signature) : Buffer.alloc(0);
  if (!body || !signature || expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
}
