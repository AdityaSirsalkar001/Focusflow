# FocusFlow Backend API

A robust Node.js/Express backend for the FocusFlow productivity application with MongoDB integration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: User profiles, preferences, and statistics
- **Todo Management**: CRUD operations with advanced features (subtasks, tags, priorities)
- **Notes System**: Rich text notes with categories and search
- **Schedule Management**: Calendar integration and time blocking
- **Timer Tracking**: Pomodoro timer sessions and statistics
- **Security**: Rate limiting, CORS, helmet, input validation
- **Performance**: MongoDB indexing, compression, query optimization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## ��� Installation

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# or with yarn
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/focusflow

# JWT Secrets (generate strong secrets for production)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloud Storage (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

#### Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 4. Development Server

```bash
# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

The API will be available at `http://localhost:5000`

## 🏗 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Protected Endpoints

All protected endpoints require the Authorization header:
```
Authorization: Bearer your-access-token
```

#### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/:id` - Get specific todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

#### Notes
- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

#### Schedule
- `GET /api/schedule` - Get user's schedule
- `POST /api/schedule` - Create schedule item
- `PUT /api/schedule/:id` - Update schedule item
- `DELETE /api/schedule/:id` - Delete schedule item

#### Timer
- `POST /api/timer/session` - Log timer session
- `GET /api/timer/stats` - Get timer statistics

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/focusflow
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

### 3. Build and Run

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create focusflow-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set MONGODB_URI=your-atlas-connection-string

# Deploy
git push heroku main
```

### 2. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

### 4. AWS EC2
```bash
# Setup EC2 instance
# Install Node.js and MongoDB
# Clone repository
# Configure environment
# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name focusflow-api
pm2 startup
pm2 save
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/focusflow` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Security Considerations

1. **Use strong JWT secrets** (at least 32 characters)
2. **Enable HTTPS** in production
3. **Configure CORS** properly
4. **Use environment variables** for secrets
5. **Implement rate limiting**
6. **Validate all inputs**
7. **Use MongoDB indexes** for performance

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

### Health Check
```
GET /api/health
```

### Performance Monitoring
- Add APM tools (New Relic, DataDog)
- Monitor MongoDB performance
- Set up error tracking (Sentry)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT secrets are set
   - Check token expiration
   - Validate token format

3. **CORS Errors**
   - Update `FRONTEND_URL` in environment
   - Check CORS configuration

4. **Rate Limiting**
   - Adjust rate limit settings
   - Implement user-specific limits

### Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review error logs

---

**Built with ❤️ for productivity enthusiasts**
