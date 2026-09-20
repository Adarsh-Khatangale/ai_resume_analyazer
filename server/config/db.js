const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  // Reuse existing connection if already connected (vital for serverless lambdas on Vercel)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer';

  try {
    // Attempt standard MongoDB connection
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully to primary URI: ${uri}`);
  } catch (primaryErr) {
    console.warn(`[MongoDB] Could not connect to primary URI (${primaryErr.message}).`);

    // In-memory MongoDB is not supported inside Vercel serverless functions
    if (process.env.VERCEL) {
      console.warn('[MongoDB] Running on Vercel: Please provide MONGODB_URI in Vercel Project Environment Variables.');
      return;
    }

    console.log('[MongoDB] Initializing fallback in-memory MongoDB server for zero-config local operation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to in-memory fallback instance: ${memUri}`);
      console.log('[MongoDB] Ready for development and testing without external database setup.');
    } catch (fallbackErr) {
      console.error('[MongoDB] Critical: Both primary and in-memory database connections failed.', fallbackErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
