import clubModel from '../models/clubModel.js';
import userModel from '../models/userModel.js';
import pool from '../config/db.js';
import { success, error } from '../utils/responseHelper.js';

export const getPendingClubs = async (req, res) => {
  try {
    const clubs = await clubModel.getByStatus('pending');
    return success(res, clubs);
  } catch (err) {
    return error(res, err.message);
  }
};

export const approveClub = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.id);
    if (!club) return error(res, 'Club not found', 404);
    await clubModel.updateStatus(req.params.id, 'approved');
    return success(res, null, 'Club approved');
  } catch (err) {
    return error(res, err.message);
  }
};

export const rejectClub = async (req, res) => {
  try {
    const club = await clubModel.findById(req.params.id);
    if (!club) return error(res, 'Club not found', 404);
    await clubModel.updateStatus(req.params.id, 'rejected');
    return success(res, null, 'Club rejected');
  } catch (err) {
    return error(res, err.message);
  }
};

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await clubModel.getAll();
    return success(res, clubs);
  } catch (err) {
    return error(res, err.message);
  }
};

export const assignAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;
    if (!admin_id) return error(res, 'admin_id is required', 400);

    const club = await clubModel.findById(req.params.id);
    if (!club) return error(res, 'Club not found', 404);

    const user = await userModel.findById(admin_id);
    if (!user) return error(res, 'User not found', 404);

    await clubModel.assignAdmin(req.params.id, admin_id);
    await userModel.updateRole(admin_id, 'club_admin');

    return success(res, null, 'Admin assigned');
  } catch (err) {
    return error(res, err.message);
  }
};

export const getStats = async (req, res) => {
  try {
    const [[userStats]] = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[clubStats]] = await pool.query("SELECT COUNT(*) AS total_clubs, SUM(status='approved') AS approved_clubs, SUM(status='pending') AS pending_clubs FROM clubs");
    const [[memberStats]] = await pool.query("SELECT COUNT(*) AS total_memberships FROM memberships WHERE status='approved'");
    const [[eventStats]] = await pool.query("SELECT COUNT(*) AS total_events, SUM(status='upcoming') AS upcoming_events FROM events");

    const [popularClubs] = await pool.query(`
      SELECT c.name, COUNT(m.id) AS member_count
      FROM clubs c
      LEFT JOIN memberships m ON c.id = m.club_id AND m.status = 'approved'
      WHERE c.status = 'approved'
      GROUP BY c.id, c.name
      ORDER BY member_count DESC
      LIMIT 5
    `);

    return success(res, {
      ...userStats,
      ...clubStats,
      ...memberStats,
      ...eventStats,
      popular_clubs: popularClubs,
    });
  } catch (err) {
    return error(res, err.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAll();
    return success(res, users);
  } catch (err) {
    return error(res, err.message);
  }
};
