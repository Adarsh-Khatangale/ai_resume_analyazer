// Vercel Serverless Function entry point
// Bridges Vercel serverless requests directly to the Express application
const app = require('../server/server');

module.exports = app;
