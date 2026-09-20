const express = require('express');
const passport = require('passport');
const {
  getMe,
  register,
  login,
  verifyGoogleToken,
  demoLogin,
  logout,
  handleGoogleCallback,
} = require('../controllers/authController');
const { optionalAuth } = require('../middlewares/auth');

const router = express.Router();

// GET /api/auth/me
router.get('/me', optionalAuth, getMe);

// POST /api/auth/register (Secure Email & Password Sign Up)
router.post('/register', register);

// POST /api/auth/login (Secure Email & Password Sign In)
router.post('/login', login);

// POST /api/auth/google/verify (Google OAuth Token Verification)
router.post('/google/verify', verifyGoogleToken);

// POST /api/auth/demo-login
router.post('/demo-login', demoLogin);

// POST /api/auth/logout
router.post('/logout', logout);

// Google OAuth Redirect Trigger (Passport flow)
router.get('/google', (req, res, next) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  if (!clientID || clientID === 'mock-client-id') {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?oauthNotConfigured=true&authModal=true`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth Redirect Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?authError=true`,
    session: false,
  }),
  handleGoogleCallback
);

module.exports = router;
