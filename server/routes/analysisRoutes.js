const express = require('express');
const {
  analyzeResume,
  guestAnalyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/analysisController');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Public / Guest Route (One scan trial)
router.post('/guest', upload.single('resume'), guestAnalyzeResume);

// Protected Routes (Require Google / JWT Auth)
router.post('/analyze', requireAuth, upload.single('resume'), analyzeResume);
router.get('/', requireAuth, getAnalyses);
router.get('/:id', requireAuth, getAnalysisById);
router.delete('/:id', requireAuth, deleteAnalysis);

module.exports = router;
