import express from 'express';
import {
  getAllIssues,
  getUserIssues,
  createIssue,
  upvoteIssue,
  deleteIssue
} from '../controllers/issueController.js';
import { uploadImage, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// GET /api/issues - Get all issues
router.get('/', getAllIssues);

// GET /api/issues/user/:userId - Get issues by user ID
router.get('/user/:userId', getUserIssues);

// POST /api/issues/test - Test endpoint for debugging
router.post('/test', (req, res) => {
  console.log('Test endpoint hit');
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  res.json({ success: true, message: 'Test endpoint working', body: req.body });
});

// POST /api/issues - Create new issue (with image upload)
router.post('/', uploadImage, handleUploadError, (req, res, next) => {
  console.log('=== DEBUGGING ISSUE CREATION ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Raw body preview:', req.body);
  next();
}, createIssue);

// PUT /api/issues/:id/upvote - Update issue upvotes
router.put('/:id/upvote', upvoteIssue);

// PUT /api/issues/:id/status - Update issue status/progress (admin)
import { updateIssueStatus } from '../controllers/issueController.js';
router.put('/:id/status', updateIssueStatus);

// DELETE /api/issues/:id - Delete issue
router.delete('/:id', deleteIssue);

export default router;