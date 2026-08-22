const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load Environment Variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Base Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'MindPulse AI Platform API Engine',
    timestamp: new Date().toISOString(),
    localAi: process.env.ENABLE_LOCAL_AI === 'true'
  });
});

// API Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MindPulse AI Backend Server running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
