import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceMeters } from '../src/attendance/verification.js';

test('Haversine distance distinguishes the 15 metre geofence boundary', () => {
  const beacon = { latitude: 23.7806, longitude: 90.4070 };
  assert.ok(distanceMeters(beacon, { latitude: 23.7806, longitude: 90.4071 }) < 15);
  assert.ok(distanceMeters(beacon, { latitude: 23.7806, longitude: 90.4073 }) > 15);
});
