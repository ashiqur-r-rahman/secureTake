import { Router } from 'express';
import { createQrToken } from '../attendance/qrTokens.js';
import { pool } from '../db/pool.js';

export const sessionRouter = Router();
sessionRouter.post('/:sessionId/tokens', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { rows: students } = await pool.query('SELECT student_id FROM enrollments WHERE course_id = (SELECT course_id FROM attendance_sessions WHERE id = $1)', [sessionId]);
    const expiresAt = new Date(Date.now() + 120_000);
    const tokens = students.map(({ student_id }) => ({ studentId: student_id, token: createQrToken({ sessionId, studentId: student_id }) }));
    await Promise.all(tokens.map(({ studentId, token }) => pool.query('INSERT INTO attendance_tokens (session_id, student_id, token_hash, expires_at) VALUES ($1,$2,encode(digest($3,\'sha256\'),\'hex\'),$4) ON CONFLICT (session_id,student_id) DO UPDATE SET token_hash=EXCLUDED.token_hash, expires_at=EXCLUDED.expires_at, consumed_at=NULL', [sessionId, studentId, token, expiresAt])));
    res.status(201).json({ expiresAt, tokens });
  } catch (error) { next(error); }
});
