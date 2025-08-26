const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/profile', async (req, res) => {
  res.json({ message: 'Users endpoint - Get profile', user: req.user.profile });
});

router.put('/profile', async (req, res) => {
  res.json({ message: 'Users endpoint - Update profile', user: { ...req.user.profile, ...req.body } });
});

router.get('/stats', async (req, res) => {
  res.json({ message: 'Users endpoint - Get user stats', stats: req.user.stats });
});

module.exports = router;
