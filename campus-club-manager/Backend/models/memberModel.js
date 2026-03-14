import pool from '../config/db.js';

const memberModel = {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM memberships WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUserAndClub(userId, clubId) {
    const [rows] = await pool.query(
      'SELECT * FROM memberships WHERE user_id = ? AND club_id = ?',
      [userId, clubId]
    );
    return rows[0] || null;
  },

  async create({ user_id, club_id }) {
    const [result] = await pool.query(
      'INSERT INTO memberships (user_id, club_id) VALUES (?, ?)',
      [user_id, club_id]
    );
    return result.insertId;
  },

  async countByClub(clubId) {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS count FROM memberships WHERE club_id = ? AND status = 'approved'",
      [clubId]
    );
    return row.count;
  },

  async getByClub(clubId) {
    const [rows] = await pool.query(`
      SELECT m.*, u.name AS user_name, u.email AS user_email, u.avatar_url
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      WHERE m.club_id = ? AND m.status = 'approved'
      ORDER BY m.joined_at DESC
    `, [clubId]);
    return rows;
  },

  async getPendingByClub(clubId) {
    const [rows] = await pool.query(`
      SELECT m.*, u.name AS user_name, u.email AS user_email, u.avatar_url
      FROM memberships m
      JOIN users u ON m.user_id = u.id
      WHERE m.club_id = ? AND m.status = 'pending'
      ORDER BY m.joined_at DESC
    `, [clubId]);
    return rows;
  },

  async getByUser(userId) {
    const [rows] = await pool.query(`
      SELECT m.*, c.name AS club_name, c.description AS club_description,
        c.category, c.logo_url, c.status AS club_status
      FROM memberships m
      JOIN clubs c ON m.club_id = c.id
      WHERE m.user_id = ?
      ORDER BY m.joined_at DESC
    `, [userId]);
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE memberships SET staus = ? WHERE id = ?', [status, id]);
  },

  async updateRole(id, role) {
    await pool.query('UPDATE memberships SET role = ? WHERE id = ?', [role, id]);
  },

  async delete(id) {
    await pool.query('DELETE FROM memberships WHERE id = ?', [id]);
  },
};

export default memberModel;
