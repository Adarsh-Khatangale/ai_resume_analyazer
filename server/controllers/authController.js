const User = require('../models/User');
const { generateToken, sendTokenCookie } = require('../config/passport');
const { OAuth2Client } = require('google-auth-library');

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ user: null, isGuest: true });
    }
    return res.status(200).json({ user: req.user, isGuest: false });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user state.' });
  }
};

// POST /api/auth/register (Secure Email/Gmail + Password Signup)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid Gmail or email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if account already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Create user with hashed password
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      authProvider: 'local',
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
      isDemoUser: false,
    });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: 'Account registered successfully.',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to register account: ' + err.message });
  }
};

// POST /api/auth/login (Secure Email/Gmail + Password Sign In)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user with password
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If user registered with Google and doesn't have a password
    if (!user.password && user.googleId) {
      return res.status(400).json({
        error: 'This account was created with Google Sign-In. Please click "Continue with Google".',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: 'Logged in successfully.',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// POST /api/auth/google/verify (Google Identity Services modern OAuth Token Verification)
const verifyGoogleToken = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'mock-client-id') {
      return res.status(400).json({
        error: 'Google OAuth is not configured on the server. Please add GOOGLE_CLIENT_ID in server/.env.',
      });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Failed to verify Google account details.' });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || payload.given_name || 'Google User';
    const profileImage = payload.picture || '';

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (profileImage && !user.profileImage) user.profileImage = profileImage;
      if (!user.authProvider) user.authProvider = 'google';
      await user.save();
    } else {
      user = await User.create({
        googleId,
        email,
        name,
        profileImage,
        authProvider: 'google',
        isDemoUser: false,
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: 'Google authentication successful.',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Google token verification error:', err);
    return res.status(401).json({
      error: 'Google verification failed: ' + (err.message || 'Invalid token.'),
    });
  }
};

// POST /api/auth/demo-login (1-Click instant login for local testing & demos)
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo.engineer@airesume.dev';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        googleId: 'demo-google-id-12345',
        name: 'Alex Rivera (Demo)',
        email: demoEmail,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authProvider: 'demo',
        isDemoUser: true,
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: 'Demo session started successfully.',
      user: userObj,
      token,
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Failed to initialize demo session.' });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  return res.status(200).json({ message: 'Signed out successfully.' });
};

// Google OAuth Redirect Callback Handler (Standard Passport flow)
const handleGoogleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?authError=true`);
    }

    const token = generateToken(req.user._id);
    sendTokenCookie(res, token);

    // Redirect back to frontend dashboard
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?loginSuccess=true`);
  } catch (err) {
    console.error('Google callback handling error:', err);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/?authError=true`);
  }
};

module.exports = {
  getMe,
  register,
  login,
  verifyGoogleToken,
  demoLogin,
  logout,
  handleGoogleCallback,
};
