import pool from '../config/db.js';

const rsvpModel = {
  async findByEventAndUser(eventId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM rsvps WHERE event_id = ? AND user_id = ?',
      [eventId, userId]
    );
    return rows[0] || null;
  },

  async create({ event_id, user_id, status = 'going' }) {
    const [result] = await pool.query(
      'INSERT INTO rsvps (event_id, user_id, status) VALUES (?, ?, ?)',
      [event_id, user_id, status]
    );
    return result.insertId;
  },

  async update(eventId, userId, status) {
    await pool.query(
      'UPDATE rsvps SET status = ? WHERE event_id = ? AND user_id = ?',
      [status, eventId, userId]
    );
  },

  async delete(eventId, userId) {
    await pool.query('DELETE FROM rsvps WHERE event_id = ? AND user_id = ?', [eventId, userId]);
  },

  async getByEvent(eventId) {
    const [rows] = await pool.query(`
      SELECT r.*, u.name, u.email, u.avatar_url
      FROM rsvps r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.created_at DESC
    `, [eventId]);
    return rows;
  },

  async getByUser(userId) {
    const [rows] = await pool.query(`
      SELECT r.*, e.title AS event_title, e.event_date, e.location, c.name AS club_name
      FROM rsvps r
      JOIN events e ON r.event_id = e.id
      JOIN clubs c ON e.club_id = c.id
      WHERE r.user_id = ?
      ORDER BY e.event_date DESC
    `, [userId]);
    return rows;
  },

  async countByEvent(eventId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM rsvps WHERE event_id = ? AND status = 'going'",
      [eventId]
    );
    return rows[0].count;
  },
};

export default rsvpModel;
