const db = require('../config/db');

class Analysis {
  static create({ userId, type, inputText, resultJson, sentimentLabel = null, sentimentScore = 0, summaryText = null, matchScore = 0 }) {
    const stmt = db.prepare(`
      INSERT INTO analyses (user_id, type, input_text, result_json, sentiment_label, sentiment_score, summary_text, match_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      userId,
      type,
      inputText,
      typeof resultJson === 'object' ? JSON.stringify(resultJson) : resultJson,
      sentimentLabel,
      sentimentScore,
      summaryText,
      matchScore
    );
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM analyses WHERE id = ?');
    const row = stmt.get(id);
    if (row && row.result_json) {
      try {
        row.result_json = JSON.parse(row.result_json);
      } catch (e) {}
    }
    return row;
  }

  static getByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(userId);
    return rows.map(r => {
      if (r.result_json) {
        try { r.result_json = JSON.parse(r.result_json); } catch (e) {}
      }
      return r;
    });
  }

  static getAll() {
    const stmt = db.prepare(`
      SELECT a.*, u.full_name as user_name, u.email as user_email
      FROM analyses a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);
    const rows = stmt.all();
    return rows.map(r => {
      if (r.result_json) {
        try { r.result_json = JSON.parse(r.result_json); } catch (e) {}
      }
      return r;
    });
  }

  static delete(id, userId) {
    const stmt = db.prepare('DELETE FROM analyses WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }

  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM analyses');
    const sentimentStmt = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE type = 'sentiment'");
    const summaryStmt = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE type = 'summarizer'");
    const skillStmt = db.prepare("SELECT COUNT(*) as count FROM analyses WHERE type = 'skill_match'");

    return {
      totalAnalyses: totalStmt.get().count,
      sentimentCount: sentimentStmt.get().count,
      summaryCount: summaryStmt.get().count,
      skillCount: skillStmt.get().count
    };
  }
}

module.exports = Analysis;
