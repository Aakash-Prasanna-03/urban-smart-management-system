# UrbanFix Backend

Backend API for UrbanFix - Urban Issue Reporting System built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Issue Management**: Create, read, update, and delete urban issues
- **File Upload**: Upload and serve images for issues using Multer
- **Admin Panel**: Administrative routes for issue management and statistics
- **Location Support**: Store and retrieve GPS coordinates for issues
- **Status Tracking**: Track issue status (pending, in-progress, resolved, rejected)
- **Upvoting System**: Allow users to upvote issues
- **Image Storage**: Automatic image handling with file validation
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer
- **CORS**: Configured for frontend integration
- **Environment**: dotenv for configuration

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── issueController.js   # Issue CRUD operations
│   │   └── adminController.js   # Admin operations
│   ├── middleware/
│   │   └── upload.js            # Multer file upload middleware
│   ├── models/
│   │   └── Issue.js             # Issue mongoose schema
│   ├── routes/
│   │   ├── issues.js            # Issue routes
│   │   └── admin.js             # Admin routes
│   └── server.js                # Express server setup
├── uploads/                     # Uploaded images directory
├── package.json
├── .env.example
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   copy .env.example .env
   
   # Edit .env with your MongoDB connection string
   # MONGODB_URI=mongodb://localhost:27017/urbanfix
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   - **Local MongoDB**: Start mongod service
   - **MongoDB Atlas**: Use your cloud connection string

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```

6. **Verify Installation**
   
   Visit `http://localhost:5000/api/test` - you should see:
   ```json
   {
     "success": true,
     "message": "UrbanFix Backend API is running!",
     "timestamp": "2025-01-XX..."
   }
   ```

## 🔌 API Endpoints

### Issues API (`/api/issues`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/user/:userId` | Get issues by user |
| POST | `/api/issues` | Create new issue (with image upload) |
| PUT | `/api/issues/:id/upvote` | Upvote/downvote issue |
| DELETE | `/api/issues/:id` | Delete issue |

### Admin API (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/issues` | Get all issues for admin |
| GET | `/api/admin/stats` | Get issue statistics |
| PUT | `/api/admin/issues/:id` | Update issue status/priority |
| DELETE | `/api/admin/issues/:id` | Delete issue (admin) |

### Static Files

| Endpoint | Description |
|----------|-------------|
| GET | `/uploads/:filename` | Serve uploaded images |

## 📤 Creating Issues

To create an issue with image upload, send a `multipart/form-data` POST request to `/api/issues` with:

```javascript
const formData = new FormData();
formData.append('title', 'Issue title');
formData.append('description', 'Issue description');
formData.append('userId', 'user123');
formData.append('userEmail', 'user@example.com');
formData.append('location[lat]', '40.7128');
formData.append('location[lng]', '-74.0060');
formData.append('image', imageFile); // Optional
```

## 🖼️ Image Upload

- **Accepted formats**: JPEG, PNG, GIF, WebP
- **Max file size**: 5MB
- **Storage location**: `uploads/` directory
- **Naming convention**: `issue-{timestamp}-{random}.{ext}`
- **Access URL**: `http://localhost:5000/uploads/{filename}`

## 🗄️ Database Schema

### Issue Model

```javascript
{
  title: String (required, max 200 chars)
  description: String (required, max 1000 chars)
  image: String (filename)
  location: {
    lat: Number (required, -90 to 90)
    lng: Number (required, -180 to 180)
  }
  userId: String (required)
  userEmail: String (required, valid email)
  status: String (pending|in-progress|resolved|rejected)
  upvotes: [String] (array of user IDs)
  priority: String (low|medium|high|critical)
  category: String (infrastructure|sanitation|traffic|environment|public-safety|other)
  adminNotes: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🔧 Configuration

### Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/urbanfix

# Server Configuration  
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
```

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- Other origins can be added in `src/server.js`

## 🚀 Running with Frontend

1. **Start Backend** (in backend directory):
   ```bash
   npm run dev
   ```

2. **Start Frontend** (in frontend directory):
   ```bash
   npm run dev
   ```

3. **Access Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - Uploaded Images: `http://localhost:5000/uploads/{filename}`

The frontend is configured with Vite proxy to automatically forward `/api` requests to the backend.

## 🔍 Testing

### Manual Testing

1. **Test API connectivity**:
   ```bash
   curl http://localhost:5000/api/test
   ```

2. **Create test issue**:
   ```bash
   curl -X POST http://localhost:5000/api/issues \
     -F "title=Test Issue" \
     -F "description=Test Description" \
     -F "userId=test123" \
     -F "userEmail=test@example.com" \
     -F "location[lat]=40.7128" \
     -F "location[lng]=-74.0060"
   ```

3. **Get all issues**:
   ```bash
   curl http://localhost:5000/api/issues
   ```

## 🛡️ Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: 400 status with validation details
- **Not Found**: 404 status for missing resources
- **Server Errors**: 500 status with error messages
- **File Upload Errors**: Specific errors for file size, type, etc.

## 📝 Development Notes

### Adding New Features

1. **New Routes**: Add to `src/routes/`
2. **Business Logic**: Add to `src/controllers/`
3. **Database Models**: Add to `src/models/`
4. **Middleware**: Add to `src/middleware/`

### Code Style

- Use ES6+ modules (`import/export`)
- Async/await for async operations
- Proper error handling with try/catch
- Descriptive variable and function names
- Comments for complex logic

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

This project is part of the UrbanFix hackathon submission.