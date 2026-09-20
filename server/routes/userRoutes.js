const express = require('express');
const { getProfile, deleteAccount } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.delete('/account', requireAuth, deleteAccount);

module.exports = router;
