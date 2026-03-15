import pool from '../config/db.js';

const eventModel = {
  async findById(id) {
    const [rows] = await pool.query(`
      SELECT e.*, c.name AS club_name,
        (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.status = 'going') AS rsvp_count
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ club_id, title, description, location, event_date, end_date, capacity, created_by }) {
    const [result] = await pool.query(
      'INSERT INTO events (club_id, title, description, location, event_date, end_date, capacity, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [club_id, title, description, location, event_date, end_date, capacity, created_by]
    );
    return result.insertId;
  },

  async update(id, { title, description, location, event_date, end_date, capacity }) {
    await pool.query(
      'UPDATE events SET title = ?, description = ?, location = ?, event_date = ?, end_date = ?, capacity = ? WHERE id = ?',
      [title, description, location, event_date, end_date, capacity, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
  },

  async getByClub(clubId) {
    const [rows] = await pool.query(`
      SELECT e.*,
        (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.status = 'going') AS rsvp_count
      FROM events e
      WHERE e.club_id = ?
      ORDER BY e.event_date DESC
    `, [clubId]);
    return rows;
  },

  async getUpcoming() {
    const [rows] = await pool.query(`
      SELECT e.*, c.name AS club_name,
        (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.status = 'going') AS rsvp_count
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.status = 'upcoming' AND e.event_date >= NOW()
      ORDER BY e.event_date ASC
    `);
    return rows;
  },

  async getAll() {
    const [rows] = await pool.query(`
      SELECT e.*, c.name AS club_name,
        (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.status = 'going') AS rsvp_count
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      ORDER BY e.event_date DESC
    `);
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE events SET status = ? WHERE id = ?', [status, id]);
  },
};

export default eventModel;
