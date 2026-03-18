import { Router } from 'express';
import {
  getPendingClubs,
  approveClub,
  rejectClub,
  getAllClubs,
  assignAdmin,
  getStats,
  getUsers,
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authMiddleware, authorize('super_admin'));

router.get('/clubs/pending', getPendingClubs);
router.put('/clubs/:id/approve', approveClub);
router.put('/clubs/:id/reject', rejectClub);
router.get('/clubs/all', getAllClubs);
router.put('/clubs/:id/assign-admin', assignAdmin);
router.get('/stats', getStats);
router.get('/users', getUsers);

export default router;
