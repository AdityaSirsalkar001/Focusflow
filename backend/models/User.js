const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    timerDefaults: {
      focusTime: {
        type: Number,
        default: 25,
        min: 1,
        max: 120
      },
      shortBreak: {
        type: Number,
        default: 5,
        min: 1,
        max: 30
      },
      longBreak: {
        type: Number,
        default: 15,
        min: 1,
        max: 60
      },
      autoStartBreaks: {
        type: Boolean,
        default: false
      },
      soundEnabled: {
        type: Boolean,
        default: true
      }
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      },
      daily: {
        type: Boolean,
        default: false
      }
    }
  },
  stats: {
    totalFocusTime: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    notesCreated: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'stats.lastActiveDate': -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update stats
userSchema.methods.updateStats = function(type, value = 1) {
  switch(type) {
    case 'focusTime':
      this.stats.totalFocusTime += value;
      break;
    case 'session':
      this.stats.totalSessions += value;
      break;
    case 'task':
      this.stats.tasksCompleted += value;
      break;
    case 'note':
      this.stats.notesCreated += value;
      break;
    case 'streak':
      this.stats.currentStreak = value;
      if (value > this.stats.longestStreak) {
        this.stats.longestStreak = value;
      }
      break;
  }
  this.stats.lastActiveDate = new Date();
  return this.save();
};

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    preferences: this.preferences,
    stats: this.stats,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
});

module.exports = mongoose.model('User', userSchema);
