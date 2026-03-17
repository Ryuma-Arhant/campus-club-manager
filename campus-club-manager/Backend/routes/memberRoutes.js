import { Router } from 'express';
import {
  requestJoin,
  getClubMembers,
  getPendingMembers,
  approveMember,
  rejectMember,
  changeRole,
  removeMember,
  getMyMemberships,
} from '../controllers/memberController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/request/:clubId', authMiddleware, requestJoin);
router.get('/club/:clubId', authMiddleware, authorize('club_admin', 'super_admin'), getClubMembers);
router.get('/pending/:clubId', authMiddleware, authorize('club_admin', 'super_admin'), getPendingMembers);
router.put('/approve/:membershipId', authMiddleware, authorize('club_admin', 'super_admin'), approveMember);
router.put('/reject/:membershipId', authMiddleware, authorize('club_admin', 'super_admin'), rejectMember);
router.put('/role/:membershipId', authMiddleware, authorize('club_admin', 'super_admin'), changeRole);
router.delete('/:membershipId', authMiddleware, authorize('club_admin', 'super_admin'), removeMember);
router.get('/my', authMiddleware, getMyMemberships);

export default router;
