# ⚡ MindPulse AI — Full-Stack AI Web Application

MindPulse AI is a modern, production-grade **AI-Based Full-Stack Web Application** built with **React (Vite), Node.js, Express, and MySQL / MongoDB / SQLite**. It features a built-in **Local AI Machine Learning Engine** that performs sentiment analysis, extractive text summarization, entity keyword extraction, and vector-driven career skill recommendations — 100% locally with zero external API dependencies or costs.

---

## 🚀 Key Features

- **🎨 Modern Dark Glassmorphism UI**: Built with React, Lucide Icons, and custom CSS design system.
- **🔐 Secure Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and role-based authorization (`user` & `admin`).
- **🧠 Built-In Local AI Engine**:
  - **Sentiment & Emotion Classifier**: Analyzes polarity (Positive/Neutral/Negative), confidence, emotion intensity (joy, anger, sadness, fear, trust, anticipation), and keyword extraction.
  - **Extractive Text Summarizer**: Automatic text summarization, bullet point highlights, reading time estimation, and compression ratio analytics.
  - **AI Career Skill Recommender**: Computes vector similarity between candidate skills and job postings, generating compatibility match scores, skill gap lists, and actionable career advice.
- **📊 Interactive Dashboards**:
  - **User Dashboard**: Metrics summary, quick tool launcher, real-time prediction history.
  - **Admin Dashboard**: System metrics, total users, global AI usage analytics, user directory role management (toggle user/admin roles, delete users).
- **💾 Dual Database Support**: MySQL schema (`schema.sql`), MongoDB Mongoose models (`mongo_schema.js`), and lightweight local SQLite engine for instant zero-config setup out-of-the-box.

---

## 📁 1. Project Folder Structure

```
ai-fullstack-app/
├── README.md                          # Full documentation & setup guide
├── .env.example                       # Environment variables template
├── .env                               # Active local configuration
├── package.json                       # Root script orchestrator
├── database/
│   ├── schema.sql                     # Complete MySQL Schema, tables & SQL queries
│   ├── mongo_schema.js                # MongoDB Mongoose Schema reference
│   └── seed.js                        # Sample data seeder script
├── backend/
│   ├── package.json                   # Backend Node.js dependencies
│   ├── server.js                      # Express HTTP Server entry point
│   ├── config/
│   │   └── db.js                      # Database connection & table setup
│   ├── controllers/
│   │   ├── authController.js          # Auth endpoints logic (register, login, getMe)
│   │   ├── aiController.js            # AI Sentiment, Summarize & Skill Match logic
│   │   ├── userController.js          # User history & profile logic
│   │   └── adminController.js         # Admin management & system stats
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification guard
│   │   ├── adminMiddleware.js         # Admin role guard
│   │   └── errorHandler.js            # Global REST API error handler
│   ├── models/
│   │   ├── User.js                    # User data model
│   │   └── Analysis.js                # AI Analysis history data model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   └── services/
│       └── aiEngine.js                # Local Natural Language Processing & Vector Matcher
└── frontend/
    ├── package.json                   # Frontend React dependencies
    ├── vite.config.js                 # Vite bundler & API proxy configuration
    ├── index.html                     # HTML5 entry with Google Fonts
    └── src/
        ├── App.jsx                    # Main React Router & App layout
        ├── main.jsx                   # React DOM root entry
        ├── index.css                  # Custom Glassmorphism CSS design system
        ├── context/
        │   └── AuthContext.jsx        # Global Auth & Token state provider
        ├── services/
        │   └── api.js                 # Axios instance with Bearer interceptors
        ├── components/
        │   ├── Navbar.jsx             # Top header navigation
        │   ├── Sidebar.jsx            # Left dashboard navigation
        │   ├── Footer.jsx             # Footer component
        │   └── ProtectedRoute.jsx     # Route authorization guards
        └── pages/
            ├── LandingPage.jsx        # Product landing page
            ├── LoginPage.jsx          # User login form
            ├── RegisterPage.jsx       # User registration form
            ├── Dashboard.jsx          # User main dashboard
            ├── AIAnalyzer.jsx         # Sentiment & Summarization tool
            ├── SkillMatcher.jsx       # Career Skill Recommender tool
            ├── HistoryPage.jsx        # Saved history & JSON export
            ├── ProfilePage.jsx        # User profile settings
            └── AdminDashboard.jsx     # Admin console & stats
```

---

## 🛠️ 2. Step-by-Step Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **VS Code** (or preferred IDE)

### Step 1: Clone or Navigate to Project Directory
```bash
cd C:\Users\abhis\.gemini\antigravity\scratch\ai-fullstack-app
```

### Step 2: Install All Dependencies
You can install dependencies for root, backend, and frontend with the automated setup command:
```bash
npm run setup
```
*(Or install manually: `cd backend && npm install` then `cd ../frontend && npm install`)*

### Step 3: Initialize & Seed Database
Run the seeder script to populate sample users, admin accounts, and sample AI predictions:
```bash
npm run seed
```

---

## ⚡ 3. Commands to Start Frontend & Backend

### Option A: Run Both Simultaneously (Recommended)
From the root project directory, execute:
```bash
npm run dev
```
This will launch:
- **Backend API Server**: `http://localhost:5000`
- **Frontend Web App**: `http://localhost:3000`

### Option B: Run Individually in Separate Terminal Tabs
- **Terminal 1 (Backend)**:
  ```bash
  npm run start:backend
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  npm run start:frontend
  ```

---

## 🔐 4. Default Credentials (Sample Test Data)

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@mindpulse.ai` | `Admin@123` | `admin` |
| **Regular User** | `alex@example.com` | `User@123` | `user` |
| **Regular User** | `sarah@example.com` | `User@123` | `user` |

---

## 📡 5. REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account.
- `POST /api/auth/login` — Login user & return JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile.

### AI Engine (`/api/ai`)
- `POST /api/ai/sentiment` — Classify text sentiment, emotions & keywords.
- `POST /api/ai/summarize` — Generate extractive summary & bullet highlights.
- `POST /api/ai/skill-match` — Compute candidate skill compatibility & missing gaps.

### User Data (`/api/user`)
- `GET /api/user/history` — Get user's saved AI analysis history.
- `DELETE /api/user/history/:id` — Delete a specific analysis record.
- `PUT /api/user/profile` — Update user profile (full name, bio).

### Admin Controls (`/api/admin`)
- `GET /api/admin/users` — Fetch all registered users.
- `PUT /api/admin/users/:id/role` — Toggle user role (`user` ↔ `admin`).
- `DELETE /api/admin/users/:id` — Delete user account & associated data.
- `GET /api/admin/stats` — Get platform-wide execution metrics.

---

## 🗄️ 6. Database Schema (MySQL & MongoDB)

### MySQL Queries (`database/schema.sql`)
```sql
CREATE DATABASE IF NOT EXISTS mindpulse_ai;
USE mindpulse_ai;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('sentiment', 'summarizer', 'skill_match') NOT NULL,
  input_text LONGTEXT NOT NULL,
  result_json JSON NOT NULL,
  sentiment_label VARCHAR(50),
  sentiment_score FLOAT DEFAULT 0,
  summary_text TEXT,
  match_score FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## ⚙️ 7. Environment Configuration (`.env.example`)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=mindpulse_super_secret_jwt_key_2026_antigravity_ai_token
JWT_EXPIRES_IN=7d
ENABLE_LOCAL_AI=true
```

---

## 🧪 8. Verification & Testing

1. Open `http://localhost:3000` in your web browser.
2. Click **Sign In** and use quick demo login buttons or enter `admin@mindpulse.ai` / `Admin@123`.
3. Navigate to **Sentiment & NLP Suite** and click sample prompt buttons to run real-time sentiment predictions.
4. Navigate to **AI Career Skill Recommender** to test candidate skill matching vs target job postings.
5. Go to **Admin Management** (when logged in as Admin) to view platform user table and metrics.
