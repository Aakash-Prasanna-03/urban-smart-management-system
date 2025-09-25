import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    default: null
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  upvotes: [{
    type: String // User IDs who upvoted
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['infrastructure', 'sanitation', 'traffic', 'environment', 'public-safety', 'other'],
    default: 'other'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
issueSchema.index({ userId: 1, createdAt: -1 });
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ 'location.lat': 1, 'location.lng': 1 });

// Virtual for upvote count
issueSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Ensure virtuals are included in JSON output
issueSchema.set('toJSON', { virtuals: true });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;