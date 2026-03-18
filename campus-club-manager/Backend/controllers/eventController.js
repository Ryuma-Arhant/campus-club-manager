import { validationResult, body } from 'express-validator';
import eventModel from '../models/eventModel.js';
import rsvpModel from '../models/rsvpModel.js';
import clubModel from '../models/clubModel.js';
import { success, error } from '../utils/responseHelper.js';

export const getEvents = async (req, res) => {
  try {
    const events = await eventModel.getUpcoming();
    return success(res, events);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getClubEvents = async (req, res) => {
  try {
    const events = await eventModel.getByClub(req.params.clubId);
    return success(res, events);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    return success(res, event);
  } catch (err) {
    return error(res, err.message);
  }
};

export const createEvent = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('event_date').notEmpty().withMessage('Event date is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const clubId = req.params.clubId;
      const club = await clubModel.findById(clubId);
      if (!club) return error(res, 'Club not found', 404);

      if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
        return error(res, 'Not authorized to create events for this club', 403);
      }

      const { title, description, location, event_date, end_date, capacity } = req.body;
      const id = await eventModel.create({
        club_id: clubId,
        title,
        description,
        location,
        event_date,
        end_date: end_date || null,
        capacity: capacity || 100,
        created_by: req.user.id,
      });
      const event = await eventModel.findById(id);
      return success(res, event, 'Event created', 201);
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const updateEvent = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const event = await eventModel.findById(req.params.id);
      if (!event) return error(res, 'Event not found', 404);

      const club = await clubModel.findById(event.club_id);
      if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
        return error(res, 'Not authorized', 403);
      }

      const { title, description, location, event_date, end_date, capacity, status } = req.body;
      await eventModel.update(req.params.id, { title, description, location, event_date, end_date, capacity });
      if (status) await eventModel.updateStatus(req.params.id, status);

      const updated = await eventModel.findById(req.params.id);
      return success(res, updated, 'Event updated');
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) return error(res, 'Event not found', 404);

    const club = await clubModel.findById(event.club_id);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }

    await eventModel.delete(req.params.id);
    return success(res, null, 'Event deleted');
  } catch (err) {
    return error(res, err.message);
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.eventId);
    if (!event) return error(res, 'Event not found', 404);
    if (event.status === 'cancelled' || event.status === 'completed') {
      return error(res, 'Cannot RSVP to this event', 400);
    }

    const rsvpCount = await rsvpModel.countByEvent(req.params.eventId);
    const existing = await rsvpModel.findByEventAndUser(req.params.eventId, req.user.id);

    if (existing) {
      const { status } = req.body;
      await rsvpModel.update(req.params.eventId, req.user.id, status || 'going');
      return success(res, null, 'RSVP updated');
    }

    if (rsvpCount >= event.capacity) return error(res, 'Event is at full capacity', 400);

    await rsvpModel.create({ event_id: req.params.eventId, user_id: req.user.id, status: req.body.status || 'going' });
    return success(res, null, 'RSVP confirmed', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const cancelRsvp = async (req, res) => {
  try {
    const existing = await rsvpModel.findByEventAndUser(req.params.eventId, req.user.id);
    if (!existing) return error(res, 'RSVP not found', 404);
    await rsvpModel.delete(req.params.eventId, req.user.id);
    return success(res, null, 'RSVP cancelled');
  } catch (err) {
    return error(res, err.message);
  }
};
