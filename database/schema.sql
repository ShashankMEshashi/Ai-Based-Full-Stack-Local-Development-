-- =========================================================
-- MindPulse AI Full-Stack Application - MySQL Database Schema
-- Database Name: mindpulse_ai
-- =========================================================

CREATE DATABASE IF NOT EXISTS `mindpulse_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mindpulse_ai`;

-- ---------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `avatar` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  `bio` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table: analyses (AI Sentiment & Text Analysis History)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `analyses`;
CREATE TABLE `analyses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` ENUM('sentiment', 'summarizer', 'skill_match') NOT NULL,
  `input_text` LONGTEXT NOT NULL,
  `result_json` JSON NOT NULL,
  `sentiment_label` VARCHAR(50) DEFAULT NULL,
  `sentiment_score` FLOAT DEFAULT 0,
  `summary_text` TEXT DEFAULT NULL,
  `match_score` FLOAT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_analyses_user` (`user_id`),
  INDEX `idx_analyses_type` (`type`),
  INDEX `idx_analyses_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table: system_logs (Audit Trail)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE `system_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Initial Sample Seed Data (Passwords are bcrypt hashed 'User@123' and 'Admin@123')
-- ---------------------------------------------------------
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `bio`) VALUES
(1, 'System Admin', 'admin@mindpulse.ai', '$2a$10$p3.BlnmC5T9t/.05Jk8t6O4m3b6k9N0J98Q1z9b54W6y1l/1l3qG6', 'admin', 'Lead Administrator of MindPulse AI Platform'),
(2, 'Alex Morgan', 'alex@example.com', '$2a$10$p3.BlnmC5T9t/.05Jk8t6O4m3b6k9N0J98Q1z9b54W6y1l/1l3qG6', 'user', 'Senior Full Stack Developer & AI Enthusiast'),
(3, 'Sarah Connor', 'sarah@example.com', '$2a$10$p3.BlnmC5T9t/.05Jk8t6O4m3b6k9N0J98Q1z9b54W6y1l/1l3qG6', 'user', 'Data Scientist & Machine Learning Engineer');

INSERT INTO `analyses` (`user_id`, `type`, `input_text`, `result_json`, `sentiment_label`, `sentiment_score`, `summary_text`) VALUES
(2, 'sentiment', 'MindPulse AI platform is exceptionally intuitive, fast, and delivers remarkably accurate sentiment predictions!', '{"sentiment":"Positive","score":0.92,"confidence":"High","emotions":{"joy":0.85,"confidence":0.9},"keywords":["MindPulse","intuitive","accurate","sentiment"]}', 'Positive', 0.92, NULL),
(2, 'skill_match', 'Candidate Skills: React, Node.js, Express, MongoDB, Machine Learning\nTarget Role: Full Stack AI Developer', '{"matchPercentage":88,"matchingSkills":["React","Node.js","Express","MongoDB"],"missingSkills":["TypeScript","Docker"],"recommendations":["Learn TypeScript to build robust typed APIs","Explore Docker containerization for production deployment"]}', NULL, 0, NULL),
(3, 'summarizer', 'Artificial intelligence and machine learning are revolutionizing full-stack web application development. Developers can now embed local natural language processing engines directly into web platforms to analyze user feedback, automate content classification, and calculate semantic similarity without incurring expensive third-party cloud API latency or subscription fees.', '{"summary":"AI and ML are transforming web apps. Developers can embed local NLP engines to analyze feedback and compute semantic similarity without third-party fees.","keyPoints":["Local NLP integration saves cloud costs","Transforms user feedback classification","Reduces API latency"],"readability":"High"}', 'Positive', 0.65, 'AI and ML are transforming web apps. Developers can embed local NLP engines to analyze feedback and compute semantic similarity without third-party fees.');

-- ---------------------------------------------------------
-- Sample Useful Queries for Analytics & Dashboard
-- ---------------------------------------------------------
-- Query 1: Total Users Count by Role
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Query 2: AI Predictions Count & Average Sentiment per User
-- SELECT u.full_name, u.email, COUNT(a.id) as total_analyses, AVG(a.sentiment_score) as avg_sentiment
-- FROM users u LEFT JOIN analyses a ON u.id = a.user_id
-- GROUP BY u.id;

-- Query 3: Recent AI Activity Feed
-- SELECT a.id, u.full_name, a.type, a.sentiment_label, a.created_at 
-- FROM analyses a JOIN users u ON a.user_id = u.id 
-- ORDER BY a.created_at DESC LIMIT 10;
