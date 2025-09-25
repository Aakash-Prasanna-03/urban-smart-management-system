export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found.' });
    }
    issue.status = status;
    if (adminNotes !== undefined) issue.adminNotes = adminNotes;
    await issue.save();
    res.json({ success: true, message: 'Issue status updated.', data: issue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ success: false, message: 'Server Error: Failed to update issue status', error: error.message });
  }
};
import Issue from '../models/Issue.js';
import fs from 'fs';
import path from 'path';

// Get all issues
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to fetch issues',
      error: error.message
    });
  }
};

// Get issues by user ID
export const getUserIssues = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const issues = await Issue.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to fetch user issues',
      error: error.message
    });
  }
};

// Create new issue
export const createIssue = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    console.log('Content-Type:', req.headers['content-type']);
    
    const { title, description, userId, userEmail, location } = req.body;
    
    // Handle location data - it might come in different formats
    let locationData;
    if (location && typeof location === 'object' && location.lat !== undefined) {
      // Direct object format
      locationData = {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng)
      };
    } else {
      // FormData format
      locationData = {
        lat: parseFloat(req.body['location[lat]']),
        lng: parseFloat(req.body['location[lng]'])
      };
    }

    console.log('Parsed location:', locationData);

    // Validate required fields
    if (!title || !description || !userId || !userEmail || isNaN(locationData.lat) || isNaN(locationData.lng)) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: title, description, userId, userEmail, location',
        received: {
          title: !!title,
          description: !!description, 
          userId: !!userId,
          userEmail: !!userEmail,
          locationLat: locationData.lat,
          locationLng: locationData.lng
        }
      });
    }

    // Create issue data
    const issueData = {
      title,
      description,
      location: locationData,
      userId,
      userEmail,
      image: req.file ? req.file.filename : null
    };

    const issue = new Issue(issueData);
    await issue.save();

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    });
  } catch (error) {
    // If there was a file uploaded but issue creation failed, clean up the file
    if (req.file) {
      const filePath = path.join('uploads', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    console.error('Error creating issue:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to create issue',
      error: error.message
    });
  }
};

// Update issue upvotes
export const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const issue = await Issue.findById(id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user already upvoted
    const hasUpvoted = issue.upvotes.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      issue.upvotes = issue.upvotes.filter(id => id !== userId);
    } else {
      // Add upvote
      issue.upvotes.push(userId);
    }

    await issue.save();

    res.json({
      success: true,
      message: hasUpvoted ? 'Upvote removed' : 'Issue upvoted',
      data: issue
    });
  } catch (error) {
    console.error('Error updating upvote:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to update upvote',
      error: error.message
    });
  }
};

// Delete issue
export const deleteIssue = async (req, res) => {
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
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Failed to delete issue',
      error: error.message
    });
  }
};