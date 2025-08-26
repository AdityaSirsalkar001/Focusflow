const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  res.json({ message: 'Schedule endpoint - Get schedule', schedule: [] });
});

router.post('/', async (req, res) => {
  res.json({ message: 'Schedule endpoint - Create schedule item', item: req.body });
});

router.put('/:id', async (req, res) => {
  res.json({ message: 'Schedule endpoint - Update item', item: { id: req.params.id, ...req.body } });
});

router.delete('/:id', async (req, res) => {
  res.json({ message: 'Schedule endpoint - Delete item', deleted: true });
});

module.exports = router;
