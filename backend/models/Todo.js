const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'general'
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [480, 'Estimated time cannot exceed 8 hours']
  },
  actualTime: {
    type: Number, // in minutes
    default: 0
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Subtask title cannot exceed 100 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    }
  }],
  reminders: [{
    date: {
      type: Date,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, 'Reminder message cannot exceed 200 characters']
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
todoSchema.index({ user: 1, status: 1 });
todoSchema.index({ user: 1, dueDate: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, createdAt: -1 });
todoSchema.index({ user: 1, isArchived: 1 });

// Virtual for completion percentage of subtasks
todoSchema.virtual('subtaskProgress').get(function() {
  if (this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter(sub => sub.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Virtual for overdue status
todoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due
todoSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
todoSchema.pre('save', function(next) {
  // Set completedAt when status changes to completed
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed') {
      this.completedAt = null;
    }
  }
  
  // Update subtask completedAt timestamps
  if (this.isModified('subtasks')) {
    this.subtasks.forEach(subtask => {
      if (subtask.completed && !subtask.completedAt) {
        subtask.completedAt = new Date();
      } else if (!subtask.completed) {
        subtask.completedAt = null;
      }
    });
  }
  
  next();
});

// Static method to get user's todo statistics
todoSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: userId, isArchived: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
    cancelled: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  // Get overdue tasks count
  const overdueCount = await this.countDocuments({
    user: userId,
    isArchived: false,
    status: { $nin: ['completed', 'cancelled'] },
    dueDate: { $lt: new Date() }
  });
  
  result.overdue = overdueCount;
  
  return result;
};

// Static method to get productivity insights
todoSchema.statics.getProductivityInsights = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const insights = await this.aggregate([
    {
      $match: {
        user: userId,
        completedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
          day: { $dayOfMonth: '$completedAt' }
        },
        completed: { $sum: 1 },
        totalEstimatedTime: { $sum: '$estimatedTime' },
        totalActualTime: { $sum: '$actualTime' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  return insights;
};

module.exports = mongoose.model('Todo', todoSchema);
