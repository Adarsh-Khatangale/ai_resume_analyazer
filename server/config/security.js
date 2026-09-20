const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const setupSecurity = (app) => {
  // Helmet security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      contentSecurityPolicy: false, // Allows flexible modern frontend communication
    })
  );

  // CORS setup
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or matching whitelist
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev mode for smooth cross-port access
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // General rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  // Analysis endpoint rate limiter (prevent abuse on heavy extraction)
  const analysisLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 analyses per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Analysis rate limit reached. Please wait before analyzing another resume.' },
  });

  app.use('/api/', generalLimiter);

  return { analysisLimiter };
};

module.exports = { setupSecurity };
