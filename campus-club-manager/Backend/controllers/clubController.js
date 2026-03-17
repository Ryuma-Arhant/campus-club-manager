import { validationResult, body } from 'express-validator';
import clubModel from '../models/clubModel.js';
import { success, error } from '../utils/responseHelper.js';

export const getAllClubs = async (req, res) => {
  try {
    let clubs;
    if (req.user.role === 'student') {
      clubs = await clubModel.getByStatus('approved');
    } else {
      clubs = await clubModel.getAll();
    }
    return success(res, clubs);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getClub = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.id);
    if (!club) return error(res, 'Club not found', 404);
    return success(res, club);
  } catch (err) {
    return error(res, err.message);
  }
};

export const createClub = [
  body('name').trim().notEmpty().withMessage('Club name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const { name, description, category, max_members } = req.body;
      const existing = await clubModel.findByName(name);
      if (existing) return error(res, 'Club name already taken', 409);

      const id = await clubModel.create({ name, description, category, max_members });
      const club = await clubModel.findById(id);
      return success(res, club, 'Club request submitted for approval', 201);
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const updateClub = [
  body('name').trim().notEmpty().withMessage('Club name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const club = await clubModel.findById(req.params.id);
      if (!club) return error(res, 'Club not found', 404);

      if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
        return error(res, 'Not authorized to update this club', 403);
      }

      const { name, description, category, logo_url, max_members } = req.body;
      await clubModel.update(req.params.id, { name, description, category, logo_url, max_members });
      const updated = await clubModel.findById(req.params.id);
      return success(res, updated, 'Club updated');
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const deleteClub = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.id);
    if (!club) return error(res, 'Club not found', 404);
    await clubModel.delete(req.params.id);
    return success(res, null, 'Club deleted');
  } catch (err) {
    return error(res, err.message);
  }
};
