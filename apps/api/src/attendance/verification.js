import { readQrToken } from './qrTokens.js';

const earthRadius = 6_371_000;
const radians = degrees => degrees * Math.PI / 180;
export function distanceMeters(a, b) {
  const dLat = radians(b.latitude - a.latitude); const dLng = radians(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}
export class ValidatorFactory {
  static create(policy) { return policy === 'lecture' ? [tokenValidator, subnetValidator] : [tokenValidator, geoValidator, subnetValidator, deviceValidator]; }
}
export const tokenValidator = context => {
  const payload = readQrToken(context.token);
  if (payload.studentId !== context.studentId || payload.sessionId !== context.session.id) throw new Error('ID mismatch');
};
export const geoValidator = context => {
  if (!context.location || distanceMeters(context.location, context.session.beacon) > 15) throw new Error('Geofence violation');
};
export const subnetValidator = context => {
  if (!context.clientIp?.startsWith(context.session.subnetPrefix)) throw new Error('Subnet mismatch');
};
export const deviceValidator = context => {
  if (!context.deviceFingerprint) throw new Error('Device fingerprint required');
};
export class AttendanceVerificationFacade {
  verifyScan(context) { for (const validator of ValidatorFactory.create(context.session.mode)) validator(context); return { accepted: true }; }
}
