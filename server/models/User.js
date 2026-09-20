const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ['google', 'local', 'demo'],
      default: 'local',
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    isDemoUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const bcrypt = require('bcryptjs');

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
