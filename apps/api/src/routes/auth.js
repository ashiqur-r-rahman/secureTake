import { Router } from 'express';
import { verifyPassword } from '../auth/passwords.js';
import { issueAccessToken } from '../auth/tokens.js';
import { pool } from '../db/pool.js';

export const authRouter = Router();
authRouter.post('/teacher/login', async (req, res, next) => {
  try {
    const { institutionalId, password } = req.body;
    const { rows: [teacher] } = await pool.query('SELECT id, institutional_id, password_hash, display_name FROM instructors WHERE institutional_id = $1', [institutionalId]);
    if (!teacher || !verifyPassword(password ?? '', teacher.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ token: issueAccessToken({ sub: teacher.id, role: 'teacher' }), teacher: { id: teacher.id, institutionalId: teacher.institutional_id, name: teacher.display_name } });
  } catch (error) { next(error); }
});
authRouter.post('/student/login', async (req, res, next) => {
  try {
    const { studentNumber } = req.body;
    const { rows: [student] } = await pool.query('SELECT id, student_number, display_name FROM students WHERE student_number = $1', [studentNumber]);
    if (!student) return res.status(401).json({ error: 'Unknown student' });
    return res.json({ token: issueAccessToken({ sub: student.id, role: 'student' }), student: { id: student.id, studentNumber: student.student_number, name: student.display_name } });
  } catch (error) { next(error); }
});
