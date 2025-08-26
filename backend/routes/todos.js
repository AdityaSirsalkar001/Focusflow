const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Todo = require('../models/Todo');
const { authenticateToken, checkResourceOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(checkResourceOwnership());

// Validation rules
const todoValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('estimatedTime')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Estimated time must be between 1 and 480 minutes'),
];

// @route   GET /api/todos
// @desc    Get user's todos with filtering and pagination
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('category').optional().trim(),
  query('search').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeArchived = 'false'
    } = req.query;

    // Build filter object
    const filter = {
      user: req.user._id,
      isArchived: includeArchived === 'true'
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name email'),
      Todo.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      todos,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        count: todos.length,
        totalItems: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch todos'
    });
  }
});

// @route   GET /api/todos/stats
// @desc    Get user's todo statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Todo.getUserStats(req.user._id);
    
    // Get productivity insights for last 30 days
    const insights = await Todo.getProductivityInsights(req.user._id, 30);
    
    res.json({
      stats,
      insights
    });

  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch todo statistics'
    });
  }
});

// @route   GET /api/todos/:id
// @desc    Get specific todo
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate('user', 'name email');
    
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Todo not found'
      });
    }

    // Check ownership
    if (!req.checkOwnership(todo)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only access your own todos'
      });
    }

    res.json(todo);

  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch todo'
    });
  }
});

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private
router.post('/', todoValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const todoData = {
      ...req.body,
      user: req.user._id
    };

    const todo = new Todo(todoData);
    await todo.save();
    
    // Populate user data
    await todo.populate('user', 'name email');

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });

  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create todo'
    });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', todoValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Todo not found'
      });
    }

    // Check ownership
    if (!req.checkOwnership(todo)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own todos'
      });
    }

    // Update todo
    Object.assign(todo, req.body);
    await todo.save();
    
    // Populate user data
    await todo.populate('user', 'name email');

    res.json({
      message: 'Todo updated successfully',
      todo
    });

  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update todo'
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Todo not found'
      });
    }

    // Check ownership
    if (!req.checkOwnership(todo)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only delete your own todos'
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Todo deleted successfully'
    });

  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete todo'
    });
  }
});

// @route   PATCH /api/todos/:id/status
// @desc    Update todo status
// @access  Private
router.patch('/:id/status', [
  body('status')
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be pending, in-progress, completed, or cancelled')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Todo not found'
      });
    }

    // Check ownership
    if (!req.checkOwnership(todo)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own todos'
      });
    }

    todo.status = req.body.status;
    await todo.save();

    res.json({
      message: 'Todo status updated successfully',
      todo
    });

  } catch (error) {
    console.error('Update todo status error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update todo status'
    });
  }
});

// @route   PATCH /api/todos/:id/archive
// @desc    Archive/unarchive todo
// @access  Private
router.patch('/:id/archive', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Todo not found'
      });
    }

    // Check ownership
    if (!req.checkOwnership(todo)) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only archive your own todos'
      });
    }

    todo.isArchived = !todo.isArchived;
    await todo.save();

    res.json({
      message: `Todo ${todo.isArchived ? 'archived' : 'unarchived'} successfully`,
      todo
    });

  } catch (error) {
    console.error('Archive todo error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to archive todo'
    });
  }
});

module.exports = router;
