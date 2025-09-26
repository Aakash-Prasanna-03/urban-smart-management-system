import express from 'express';
import Issue from '../models/Issue.js';
import {
  getAllIssues,
  getUserIssues,
  createIssue,
  upvoteIssue,
  deleteIssue,
  updateIssueStatus
} from '../controllers/issueController.js';
import { uploadImage, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// ...existing code...

// GET /api/issues/images-by-location?lat=...&lng=...&radius=...
router.get('/images-by-location', async (req, res) => {
  const { lat, lng, radius = 100 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'lat and lng required' });
  }
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const RADIUS_METERS = parseFloat(radius);
  try {
    const issues = await Issue.find({
      'location.lat': { $gte: latitude - 0.01, $lte: latitude + 0.01 },
      'location.lng': { $gte: longitude - 0.01, $lte: longitude + 0.01 },
      image: { $ne: null }
    });
    // Optionally, use haversine for more accurate radius
    const haversine = (a, b) => {
      const toRad = x => x * Math.PI / 180;
      const R = 6371000;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const aVal = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1-aVal));
      return R * c;
    };
    const filtered = issues.filter(issue => haversine({lat: latitude, lng: longitude}, issue.location) <= RADIUS_METERS);
    res.json({ success: true, images: filtered.map(i => i.image) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching images', error: err.message });
  }
});
// (Removed duplicate imports and router initialization)

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
router.put('/:id/status', updateIssueStatus);

// DELETE /api/issues/:id - Delete issue
router.delete('/:id', deleteIssue);

export default router;