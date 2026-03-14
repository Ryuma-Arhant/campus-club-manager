import pool from '../config/db.js';

const clubModel = {
  async findById(id) {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS admin_name,
        (SELECT COUNT(*) FROM memberships m WHERE m.club_id = c.id AND m.status = 'approved') AS member_count
      FROM clubs c
      LEFT JOIN users u ON c.admin_id = u.id
      WHERE c.id = ?
    `, [id]);
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM clubs WHERE name = ?', [name]);
    return rows[0] || null;
  },

  async getAll() {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS admin_name,
        (SELECT COUNT(*) FROM memberships m WHERE m.club_id = c.id AND m.status = 'approved') AS member_count
      FROM clubs c
      LEFT JOIN users u ON c.admin_id = u.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  },

  async getByStatus(status) {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS admin_name,
        (SELECT COUNT(*) FROM memberships m WHERE m.club_id = c.id AND m.status = 'approved') AS member_count
      FROM clubs c
      LEFT JOIN users u ON c.admin_id = u.id
      WHERE c.status = ?
      ORDER BY c.created_at DESC
    `, [status]);
    return rows;
  },

  async create({ name, description, category, max_members }) {
    const [result] = await pool.query(
      'INSERT INTO clubs (name, description, category, max_members) VALUES (?, ?, ?, ?)',
      [name, description, category, max_members || 50]
    );
    return result.insertId;
  },

  async update(id, { name, description, category, logo_url, max_members }) {
    await pool.query(
      'UPDATE clubs SET name = ?, description = ?, category = ?, logo_url = ?, max_members = ? WHERE id = ?',
      [name, description, category, logo_url || null, max_members || 50, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM clubs WHERE id = ?', [id]);
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE clubs SET status = ? WHERE id = ?', [status, id]);
  },

  async assignAdmin(id, admin_id) {
    await pool.query('UPDATE clubs SET admin_id = ? WHERE id = ?', [admin_id, id]);
  },
};

export default clubModel;
