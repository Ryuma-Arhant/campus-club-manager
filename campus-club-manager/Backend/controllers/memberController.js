import { validationResult, body } from 'express-validator';
import memberModel from '../models/memberModel.js';
import clubModel from '../models/clubModel.js';
import { success, error } from '../utils/responseHelper.js';

export const requestJoin = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const club = await clubModel.findById(clubId);
    if (!club) return error(res, 'Club not found', 404);
    if (club.status !== 'approved') return error(res, 'Club is not accepting members', 400);

    const existing = await memberModel.findByUserAndClub(req.user.id, clubId);
    if (existing) return error(res, 'Already a member or request pending', 409);

    const count = await memberModel.countByClub(clubId);
    if (count >= club.max_members) return error(res, 'Club is at full capacity', 400);

    const id = await memberModel.create({ user_id: req.user.id, club_id: clubId });
    return success(res, { id }, 'Membership request sent', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getClubMembers = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.clubId);
    if (!club) return error(res, 'Club not found', 404);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }
    const members = await memberModel.getByClub(req.params.clubId);
    return success(res, members);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getPendingMembers = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.clubId);
    if (!club) return error(res, 'Club not found', 404);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }
    const members = await memberModel.getPendingByClub(req.params.clubId);
    return success(res, members);
  } catch (err) {
    return error(res, err.message);
  }
};

export const approveMember = async (req, res) => {
  try {
    const membership = await memberModel.findById(req.params.membershipId);
    if (!membership) return error(res, 'Membership not found', 404);

    const club = await clubModel.findById(membership.club_id);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }

    await memberModel.updateStatus(req.params.membershipId, 'approved');
    return success(res, null, 'Member approved');
  } catch (err) {
    return error(res, err.message);
  }
};

export const rejectMember = async (req, res) => {
  try {
    const membership = await memberModel.findById(req.params.membershipId);
    if (!membership) return error(res, 'Membership not found', 404);

    const club = await clubModel.findById(membership.club_id);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }

    await memberModel.updateStatus(req.params.membershipId, 'rejected');
    return success(res, null, 'Member rejected');
  } catch (err) {
    return error(res, err.message);
  }
};

export const changeRole = [
  body('role').isIn(['member','president','vice_president','secretary','treasurer']).withMessage('Invalid role'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, errors.array()[0].msg, 400);

    try {
      const membership = await memberModel.findById(req.params.membershipId);
      if (!membership) return error(res, 'Membership not found', 404);

      const club = await clubModel.findById(membership.club_id);
      if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
        return error(res, 'Not authorized', 403);
      }

      const { role } = req.body;
      if (role === 'president') {
        const members = await memberModel.getByClub(membership.club_id);
        const existingPresident = members.find(m => m.role === 'president' && m.id !== membership.id && m.status === 'approved');
        if (existingPresident) return error(res, 'Club already has a president', 409);
      }

      await memberModel.updateRole(req.params.membershipId, role);
      return success(res, null, 'Role updated');
    } catch (err) {
      return error(res, err.message);
    }
  },
];

export const removeMember = async (req, res) => {
  try {
    const membership = await memberModel.findById(req.params.membershipId);
    if (!membership) return error(res, 'Membership not found', 404);

    const club = await clubModel.findById(membership.club_id);
    if (req.user.role === 'club_admin' && club.admin_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }

    await memberModel.delete(req.params.membershipId);
    return success(res, null, 'Member removed');
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyMemberships = async (req, res) => {
  try {
    const memberships = await memberModel.getByUser(req.user.id);
    return success(res, memberships);
  } catch (err) {
    return error(res, err.message);
  }
};
