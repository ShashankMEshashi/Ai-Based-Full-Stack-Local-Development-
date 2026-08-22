const db = require('../config/db');

class User {
  static create({ fullName, email, passwordHash, role = 'user', bio = '' }) {
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, bio)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(fullName, email, passwordHash, role, bio);
    return this.findById(result.lastInsertRowid);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, full_name, email, role, avatar, bio, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static getAll() {
    const stmt = db.prepare('SELECT id, full_name, email, role, avatar, bio, created_at FROM users ORDER BY id DESC');
    return stmt.all();
  }

  static updateRole(id, role) {
    const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
    stmt.run(role, id);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  static updateProfile(id, { fullName, bio }) {
    const stmt = db.prepare('UPDATE users SET full_name = ?, bio = ? WHERE id = ?');
    stmt.run(fullName, bio, id);
    return this.findById(id);
  }
}

module.exports = User;
