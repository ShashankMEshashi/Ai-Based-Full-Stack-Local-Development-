const path = require('path');
const db = require('../backend/config/db');

// Require bcryptjs from backend node_modules if needed
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = require(path.resolve(__dirname, '../backend/node_modules/bcryptjs'));
}

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding MindPulse AI Database...');

    // Clear existing data
    db.prepare('DELETE FROM analyses').run();
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM system_logs').run();

    // Hash Passwords (User@123 & Admin@123)
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    // Insert Users
    const insertUser = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, bio)
      VALUES (?, ?, ?, ?, ?)
    `);

    const admin = insertUser.run('System Admin', 'admin@mindpulse.ai', adminPassword, 'admin', 'Lead Administrator of MindPulse AI Platform');
    const user1 = insertUser.run('Alex Morgan', 'alex@example.com', userPassword, 'user', 'Senior Full Stack Developer & AI Enthusiast');
    const user2 = insertUser.run('Sarah Connor', 'sarah@example.com', userPassword, 'user', 'Data Scientist & Machine Learning Engineer');

    console.log(`✅ Users seeded: 1 Admin, 2 Regular Users`);

    // Insert Sample AI Analyses
    const insertAnalysis = db.prepare(`
      INSERT INTO analyses (user_id, type, input_text, result_json, sentiment_label, sentiment_score, summary_text, match_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sentimentResult = JSON.stringify({
      sentiment: "Positive",
      score: 0.92,
      confidence: "High",
      positivityPct: 92,
      emotions: { joy: 0.88, trust: 0.85, anticipation: 0.76, sadness: 0.05, anger: 0.02 },
      keywords: ["MindPulse", "intuitive", "accurate", "sentiment", "platform"],
      wordCount: 14,
      readingTime: "< 1 min"
    });

    insertAnalysis.run(
      user1.lastInsertRowid,
      'sentiment',
      'MindPulse AI platform is exceptionally intuitive, fast, and delivers remarkably accurate sentiment predictions!',
      sentimentResult,
      'Positive',
      0.92,
      null,
      0
    );

    const skillResult = JSON.stringify({
      targetRole: "Senior Full Stack AI Developer",
      matchPercentage: 88,
      matchingSkills: ["React", "Node.js", "Express", "MongoDB", "Machine Learning"],
      missingSkills: ["TypeScript", "Docker", "GraphQL"],
      recommendations: [
        "Master TypeScript to build strongly typed REST & GraphQL services.",
        "Add Docker containerization experience to optimize cloud deployment workflows."
      ]
    });

    insertAnalysis.run(
      user1.lastInsertRowid,
      'skill_match',
      'Candidate Skills: React, Node.js, Express, MongoDB, Machine Learning\nTarget Role: Senior Full Stack AI Developer',
      skillResult,
      null,
      0,
      null,
      88
    );

    const summaryResult = JSON.stringify({
      originalLength: 520,
      summaryLength: 175,
      compressionRatio: "66%",
      readability: "High",
      summary: "Artificial intelligence and local NLP engines allow developers to embed real-time text sentiment, entity extraction, and recommendation models directly inside web applications without high cloud API costs.",
      keyPoints: [
        "Local NLP engines cut cloud API subscription costs.",
        "Real-time processing eliminates latency.",
        "Embed sentiment, summarization, and vector matching natively."
      ]
    });

    insertAnalysis.run(
      user2.lastInsertRowid,
      'summarizer',
      'Artificial intelligence and machine learning are revolutionizing modern web application architecture. Developers can now embed local natural language processing engines directly into full-stack web applications to analyze user feedback, perform extractive summarization, and compute vector similarity without incurring third-party cloud API costs or latency.',
      summaryResult,
      'Positive',
      0.75,
      "Artificial intelligence and local NLP engines allow developers to embed real-time text sentiment, entity extraction, and recommendation models directly inside web applications without high cloud API costs.",
      0
    );

    console.log('✅ Sample AI Analyses seeded successfully');

    // Insert System Audit Log
    const insertLog = db.prepare('INSERT INTO system_logs (user_id, action, details) VALUES (?, ?, ?)');
    insertLog.run(admin.lastInsertRowid, 'SYSTEM_INIT', 'Initial database seed and table setup complete');

    console.log('🎉 Database Seeding Complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

seedDatabase();
