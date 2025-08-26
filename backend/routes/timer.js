const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

router.post('/session', async (req, res) => {
  res.json({ message: 'Timer endpoint - Log session', session: req.body });
});

router.get('/stats', async (req, res) => {
  res.json({ 
    message: 'Timer endpoint - Get stats', 
    stats: { totalSessions: 0, totalTime: 0, currentStreak: 0 } 
  });
});

module.exports = router;
