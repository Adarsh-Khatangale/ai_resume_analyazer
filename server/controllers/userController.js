const User = require('../models/User');
const Analysis = require('../models/Analysis');

/**
 * GET /api/user/profile
 * Returns user profile and aggregate analytics stats
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    const analyses = await Analysis.find({ userId: req.user._id }).select('atsScore matchScore createdAt');

    const totalScans = analyses.length;
    let avgAts = 0;
    let avgMatch = 0;
    let bestMatch = 0;

    if (totalScans > 0) {
      const sumAts = analyses.reduce((acc, a) => acc + (a.atsScore || 0), 0);
      const sumMatch = analyses.reduce((acc, a) => acc + (a.matchScore || 0), 0);
      avgAts = Math.round(sumAts / totalScans);
      avgMatch = Math.round(sumMatch / totalScans);
      bestMatch = Math.max(...analyses.map((a) => a.matchScore || 0));
    }

    return res.status(200).json({
      user,
      stats: {
        totalScans,
        avgAts,
        avgMatch,
        bestMatch,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

/**
 * DELETE /api/user/account
 * Privacy & GDPR Compliance: Cascade delete user account and all associated analyses
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete all analysis documents belonging to this user
    const deletedAnalyses = await Analysis.deleteMany({ userId });

    // 2. Delete the user document
    await User.findByIdAndDelete(userId);

    // 3. Clear auth cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res.status(200).json({
      message: 'Your account and all associated resume data have been permanently deleted.',
      deletedAnalysesCount: deletedAnalyses.deletedCount,
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete account data.' });
  }
};

module.exports = {
  getProfile,
  deleteAccount,
};
