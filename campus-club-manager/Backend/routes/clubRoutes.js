import { Router } from 'express';
import { getAllClubs, getClub, createClub, updateClub, deleteClub } from '../controllers/clubController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAllClubs);
router.get('/:id', authMiddleware, getClub);
router.post('/', authMiddleware, createClub);
router.put('/:id', authMiddleware, authorize('club_admin', 'super_admin'), updateClub);
router.delete('/:id', authMiddleware, authorize('super_admin'), deleteClub);

export default router;
