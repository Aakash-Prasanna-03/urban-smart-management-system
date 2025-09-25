import Issue from '../models/Issue.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple hardcoded admin credentials for demo
    // In production, this should be stored securely in database with hashed passwords
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Login failed',
      error: error.message
    });
  }
};

// Get all issues for admin
export const getAllIssuesAdmin = async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const issues = await Issue.find(query)
      .sort(sortObj)
      .select('-__v');

    // Add statistics
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      count: issues.length,
      stats: statusStats,
      issues: issues
    });
  } catch (error) {
    console.error('Error fetching issues for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to fetch issues',
      error: error.message
    });
  }
};

// Update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, priority } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be one of: ' + validPriorities.join(', ')
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (priority) updateData.priority = priority;

    const issue = await Issue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to update issue',
      error: error.message
    });
  }
};

// Delete issue (admin)
export const deleteIssueAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const issue = await Issue.findById(id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Delete associated image file if exists
    if (issue.image) {
      const filePath = path.join('uploads', issue.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await Issue.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Issue deleted successfully by admin'
    });
  } catch (error) {
    console.error('Error deleting issue (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to delete issue',
      error: error.message
    });
  }
};

// Get issue statistics
export const getIssueStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    
    const statusStats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent issues (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentIssues = await Issue.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    const statusCount = statusStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const stats = {
      totalIssues: totalIssues,
      pendingIssues: statusCount.pending || 0,
      resolvedIssues: statusCount.resolved || 0,
      totalUsers: await Issue.distinct('userEmail').then(emails => emails.length)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching issue statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to fetch statistics',
      error: error.message
    });
  }
};