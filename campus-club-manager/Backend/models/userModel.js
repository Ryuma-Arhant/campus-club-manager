import pool from '../config/db.js';

const userModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  },

  async updateProfile(id, { name, email, avatar_url }) {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, avatar_url = ? WHERE id = ?',
      [name, email, avatar_url, id]
    );
  },

  async updateRole(id, role) {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  },

  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

export default userModel;
