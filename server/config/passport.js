const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_resume_analyzer_2025_secure_token';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const setupPassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (clientID && clientSecret && clientID !== 'mock-client-id') {
    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            if (!email) {
              return done(new Error('No email found in Google profile'), null);
            }

            let user = await User.findOne({
              $or: [{ googleId: profile.id }, { email: email.toLowerCase() }],
            });

            if (user) {
              if (!user.googleId) {
                user.googleId = profile.id;
              }
              if (profile.photos && profile.photos[0] && !user.profileImage) {
                user.profileImage = profile.photos[0].value;
              }
              await user.save();
              return done(null, user);
            }

            user = await User.create({
              googleId: profile.id,
              name: profile.displayName || profile.name?.givenName || 'Google User',
              email: email.toLowerCase(),
              profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            });

            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
    console.log('[Passport] Google OAuth 2.0 strategy initialized.');
  } else {
    console.log('[Passport] Google OAuth credentials not set in .env. Interactive demo/dev login mode enabled.');
  }
};

module.exports = { setupPassport, generateToken, sendTokenCookie };
