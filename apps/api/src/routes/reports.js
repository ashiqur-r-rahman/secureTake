import { Router } from 'express';
import { pool } from '../db/pool.js';

export const reportRouter = Router();
reportRouter.get('/:sessionId', async (req, res, next) => { try { const { rows } = await pool.query('SELECT r.*, s.student_number, s.display_name FROM attendance_records r JOIN students s ON s.id=r.student_id WHERE session_id=$1 ORDER BY s.student_number', [req.params.sessionId]); res.json(rows); } catch (e) { next(e); } });
reportRouter.patch('/:sessionId/:studentId', async (req, res, next) => { try { const { status, reason } = req.body; const { rows:[record] } = await pool.query("UPDATE attendance_records SET status=$1, verification_reason=$2, updated_at=now() WHERE session_id=$3 AND student_id=$4 RETURNING *", [status, reason ?? 'Manual override', req.params.sessionId, req.params.studentId]); res.json(record); } catch (e) { next(e); } });
