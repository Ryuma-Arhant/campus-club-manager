import { Router } from 'express';
import {
  getEvents,
  getClubEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp,
} from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getEvents);
router.get('/club/:clubId', authMiddleware, getClubEvents);
router.get('/:id', authMiddleware, getEvent);
router.post('/club/:clubId', authMiddleware, authorize('club_admin', 'super_admin'), createEvent);
router.put('/:id', authMiddleware, authorize('club_admin', 'super_admin'), updateEvent);
router.delete('/:id', authMiddleware, authorize('club_admin', 'super_admin'), deleteEvent);
router.post('/rsvp/:eventId', authMiddleware, rsvpEvent);
router.delete('/rsvp/:eventId', authMiddleware, cancelRsvp);

export default router;
