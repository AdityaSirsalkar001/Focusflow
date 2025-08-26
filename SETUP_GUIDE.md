# 🚀 FocusFlow - Complete Setup Guide

## 📱 What's Included

### ✅ Enhanced Responsive Design
- **Mobile-first approach** with comprehensive breakpoints
- **Touch-optimized** buttons and interactions
- **Responsive layouts** for all components (Todo, Notes, Schedule)
- **Cross-device compatibility** (320px to 4K displays)
- **Print-friendly** styles
- **Accessibility improvements** (screen readers, high contrast)

### 🖥️ Backend API (Node.js + MongoDB)
- **Authentication system** with JWT tokens
- **User management** with profiles and preferences
- **Todo management** with advanced features
- **Notes system** with rich text support
- **Schedule management** with calendar integration
- **Timer tracking** with session statistics
- **RESTful API** with comprehensive endpoints

## 🎯 Quick Start

### Option 1: Frontend Only (Current Setup)
```bash
# Install and run the frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### Option 2: Full-Stack Development
```bash
# Setup both frontend and backend
npm run setup

# Run both frontend and backend simultaneously
npm run fullstack:dev

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 3: Backend Only
```bash
# Setup backend
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your settings

# Start MongoDB (if using local)
# MongoDB Atlas connection string recommended

# Run backend
npm run dev
# API available at http://localhost:5000
```

## 📱 Responsive Design Features

### Screen Size Support
- **Extra Small Mobile**: 320px and below
- **Small Mobile**: 321px - 480px
- **Medium Mobile**: 481px - 767px
- **Tablet Portrait**: 768px - 1024px
- **Desktop**: 1025px - 1440px
- **Ultra-wide**: 1441px and above

### Touch Optimization
- Minimum 44px touch targets
- Optimized font sizes (16px to prevent zoom)
- Improved button spacing
- Touch-friendly navigation

### Component Improvements
- **Navigation**: Collapsible mobile menu
- **Todo Form**: Stacked layout on mobile
- **Notes**: Responsive sidebar/main layout
- **Schedule**: Optimized time inputs
- **Timer**: Scalable display

## 🔧 Backend Configuration

### Database Options

#### 1. MongoDB Atlas (Recommended - Cloud)
```bash
# 1. Create account at https://cloud.mongodb.com
# 2. Create cluster
# 3. Get connection string
# 4. Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/focusflow
```

#### 2. Local MongoDB
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt install mongodb

# macOS
brew install mongodb/brew/mongodb-community

# Start service
sudo systemctl start mongod

# Use local connection
MONGODB_URI=mongodb://localhost:27017/focusflow
```

#### 3. Docker MongoDB
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Use connection string
MONGODB_URI=mongodb://localhost:27017/focusflow
```

### Environment Setup
```bash
# Copy environment template
cd backend
cp .env.example .env

# Generate JWT secrets (use strong random strings)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env file with your settings
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

#### Todos
- `GET /api/todos` - Get todos (with filtering)
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/todos/stats` - Get statistics

#### Other Endpoints
- Notes: `/api/notes/*`
- Schedule: `/api/schedule/*`
- Timer: `/api/timer/*`
- Users: `/api/users/*`

## 🌐 Deployment Options

### 1. Frontend Deployment

#### Netlify (Recommended)
```bash
# Build and deploy
npm run build

# Drag and drop dist folder to Netlify
# Or connect GitHub repository
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Upload files to gh-pages branch
```

### 2. Backend Deployment

#### Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up

# Add environment variables in Railway dashboard
```

#### Heroku
```bash
# Install Heroku CLI
# Create app
heroku create focusflow-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git subtree push --prefix backend heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Select backend folder
3. Add environment variables
4. Deploy with one click

### 3. Full-Stack Deployment

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/focusflow
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5.0
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🎨 Customization

### Theme Customization
```css
/* Update CSS variables in styles/main.css */
:root {
  --accent: #your-brand-color;
  --bg-primary: #your-background;
  --text-primary: #your-text-color;
}
```

### API Integration
```javascript
// Update frontend to use backend API
const API_BASE = 'http://localhost:5000/api';

// Example: Update todo functions to use API
async function createTodo(todoData) {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(todoData)
  });
  return response.json();
}
```

## 🔒 Security Considerations

### Frontend Security
- Input validation and sanitization
- XSS protection
- Content Security Policy headers
- HTTPS in production

### Backend Security
- Strong JWT secrets (32+ characters)
- Rate limiting implemented
- Input validation with express-validator
- Password hashing with bcrypt
- CORS configuration
- Helmet.js for security headers

## 📊 Performance Optimization

### Frontend
- Minimize HTTP requests
- Optimize images
- Use service workers for caching
- Lazy load components

### Backend
- Database indexing
- Query optimization
- Response compression
- Connection pooling
- Caching strategies

## 🧪 Testing

### Frontend Testing
```bash
# Add testing framework (Jest + Testing Library)
npm install --save-dev jest @testing-library/dom

# Run tests
npm test
```

### Backend Testing
```bash
cd backend
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Production Checklist

### Frontend
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Assets optimized
- [ ] HTTPS enabled
- [ ] Analytics added (optional)

### Backend
- [ ] Database production-ready
- [ ] Environment variables secure
- [ ] JWT secrets strong
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Error monitoring (Sentry)
- [ ] Health checks enabled

### Both
- [ ] Domain configured
- [ ] SSL certificates
- [ ] Backup strategy
- [ ] Monitoring setup
- [ ] Documentation updated

## 🆘 Troubleshooting

### Common Issues

#### Frontend
- **Responsive issues**: Check viewport meta tag
- **Layout breaks**: Verify CSS grid/flexbox support
- **Touch problems**: Ensure 44px minimum touch targets

#### Backend
- **Database connection**: Verify MongoDB URI and network access
- **Authentication errors**: Check JWT secrets and token format
- **CORS issues**: Update FRONTEND_URL in environment

#### Both
- **Port conflicts**: Change ports in configuration
- **Memory issues**: Optimize queries and reduce payload sizes

### Getting Help
- Check browser console for errors
- Review server logs
- Test API endpoints with Postman
- Validate environment variables

## 📄 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Responsive Design Guidelines](https://web.dev/responsive-web-design-basics/)

---

**🎉 Your FocusFlow application is now ready for production with full mobile responsiveness and a robust backend API!**

For support, create an issue on GitHub or refer to the documentation.
