import { Router } from 'express';
import { AttendanceVerificationFacade } from '../attendance/verification.js';
import { requireAuth } from '../auth/requireAuth.js';
import { pool } from '../db/pool.js';

export const checkinRouter = Router();
checkinRouter.post('/', requireAuth('student'), async (req, res) => {
  try { const { rows:[s] } = await pool.query('SELECT id,mode,allowed_cidr::text,ST_Y(beacon_location::geometry) latitude,ST_X(beacon_location::geometry) longitude FROM attendance_sessions WHERE id=$1 AND expires_at>now()', [req.body.sessionId]); if (!s) throw new Error('Session expired'); const session = { ...s, beacon:{latitude:Number(s.latitude),longitude:Number(s.longitude)}, subnetPrefix:s.allowed_cidr.split('/')[0].split('.').slice(0,3).join('.') }; new AttendanceVerificationFacade().verifyScan({ ...req.body, studentId:req.user.sub, session, clientIp:req.ip }); await pool.query("INSERT INTO attendance_records(session_id,student_id,status,verified_at) VALUES($1,$2,'present',now()) ON CONFLICT(session_id,student_id) DO UPDATE SET status='present',verified_at=now()", [session.id, req.user.sub]); res.json({ accepted:true }); }
  catch (error) { res.status(403).json({ accepted: false, error: error.message }); }
});
