import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import issuesRouter from './routes/issues.js';
import adminRouter from './routes/admin.js';
import chatRouter from './routes/chat.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3002' // Allow admin portal on backup port
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'UrbanFix Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/issues', issuesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chatbot', chatRouter);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - GET  /api/test`);
  console.log(`   - GET  /api/issues`);
  console.log(`   - POST /api/issues`);
  console.log(`   - GET  /api/admin/issues`);
  console.log(`   - Static files: /uploads`);
});

export default app;