import express from 'express';
import {
  getAllIssuesAdmin,
  updateIssueStatus,
  deleteIssueAdmin,
  getIssueStats,
  adminLogin
} from '../controllers/adminController.js';

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', adminLogin);

// GET /api/admin/issues - Get all issues for admin with filtering and stats
router.get('/issues', getAllIssuesAdmin);

// GET /api/admin/stats - Get issue statistics
router.get('/stats', getIssueStats);

// PUT /api/admin/issues/:id - Update issue status, priority, admin notes
router.put('/issues/:id', updateIssueStatus);

// DELETE /api/admin/issues/:id - Delete issue (admin)
router.delete('/issues/:id', deleteIssueAdmin);

export default router;