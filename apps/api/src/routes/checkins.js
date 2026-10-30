import { Router } from 'express';
import { AttendanceVerificationFacade } from '../attendance/verification.js';

export const checkinRouter = Router();
checkinRouter.post('/', (req, res) => {
  try { res.json(new AttendanceVerificationFacade().verifyScan({ ...req.body, clientIp: req.ip })); }
  catch (error) { res.status(403).json({ accepted: false, error: error.message }); }
});
