require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { setupSecurity } = require('./config/security');
const { setupPassport } = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with zero-config fallback)
connectDB();

// Setup Helmet, CORS, and Rate Limiters
setupSecurity(app);

// Essential Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Passport OAuth Strategy
setupPassport();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/user', userRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AI Resume Analyzer & Job Match Assistant',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File is too large. Maximum allowed size is 5MB.',
    });
  }

  if (err.message && err.message.includes('Invalid file format')) {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error occurred. Please try again.',
  });
});

// Start Server (only when run directly, not when invoked as a Vercel serverless function)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AI Resume Analyzer API running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
