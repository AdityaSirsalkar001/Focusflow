const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware
router.use(authenticateToken);

// @route   GET /api/notes
// @desc    Get user's notes
// @access  Private
router.get('/', async (req, res) => {
  res.json({
    message: 'Notes endpoint - Get all notes',
    notes: []
  });
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', async (req, res) => {
  res.json({
    message: 'Notes endpoint - Create note',
    note: { id: 1, title: 'Sample Note', content: 'Sample content' }
  });
});

// @route   GET /api/notes/:id
// @desc    Get specific note
// @access  Private
router.get('/:id', async (req, res) => {
  res.json({
    message: 'Notes endpoint - Get note by ID',
    note: { id: req.params.id, title: 'Sample Note', content: 'Sample content' }
  });
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', async (req, res) => {
  res.json({
    message: 'Notes endpoint - Update note',
    note: { id: req.params.id, ...req.body }
  });
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', async (req, res) => {
  res.json({
    message: 'Notes endpoint - Delete note',
    deleted: true
  });
});

module.exports = router;
