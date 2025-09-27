import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, MapPin, User, Calendar, Image, Filter, Loader, Clock, CheckCircle, AlertCircle, TrendingUp, MessageCircle, ArrowUp, ExternalLink } from 'lucide-react';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`/api/issues${filter !== 'all' ? `?status=${filter}` : ''}`);
      const grouped = response.data.data || [];
      setIssues(grouped);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await axios.put(`/api/admin/issues/${issueId}`, { status: newStatus });
      fetchIssues();
      closeModal();
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'infrastructure': 'from-blue-500 to-blue-600',
      'sanitation': 'from-green-500 to-green-600',
      'traffic': 'from-orange-500 to-orange-600',
      'public-safety': 'from-red-500 to-red-600',
      'environment': 'from-emerald-500 to-emerald-600',
      'utilities': 'from-purple-500 to-purple-600',
      'other': 'from-gray-500 to-gray-600',
      'unrelated': 'from-indigo-500 to-indigo-600'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'infrastructure': '🏗️',
      'sanitation': '🧹',
      'traffic': '🚦',
      'public-safety': '👮',
      'environment': '🌳',
      'utilities': '⚡',
      'other': '📋',
      'unrelated': '🔗'
    };
    return icons[category] || icons.other;
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'infrastructure': return 'Infrastructure';
      case 'sanitation': return 'Sanitation';
      case 'traffic': return 'Traffic';
      case 'public-safety': return 'Public Safety';
      case 'environment': return 'Environment';
      case 'utilities': return 'Utilities';
      case 'other': return 'Other';
      case 'unrelated': return 'Unrelated';
      default: return category?.charAt(0)?.toUpperCase() + category?.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <div className="text-lg text-blue-700 font-medium">Loading issues...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Community Issues
          </h1>
          <p className="text-gray-600 text-lg">Monitor and resolve community issues efficiently</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">Filter & View</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Filter Dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none shadow-sm font-medium"
              >
                <option value="all">All Issues</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues Grid/List */}
        {issues.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
              >
                {/* Card Header with Image */}
                <div className="relative">
                  {issue.image ? (
                    <img 
                      src={`/uploads/${issue.image}`} 
                      alt="Issue" 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Image className="h-16 w-16 text-blue-300" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(issue.category)} shadow-lg`}>
                      <span className="text-sm">{getCategoryIcon(issue.category)}</span>
                      {getCategoryName(issue.category)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(issue.status)} backdrop-blur-sm`}>
                      {getStatusIcon(issue.status)}
                      {issue.status?.charAt(0)?.toUpperCase() + issue.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {issue.title?.split(' / ')[0]?.trim() || 'Untitled Issue'}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {issue.geminiSummary || issue.description || 'No description available for this issue.'}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {issue.location ? 
                          `${issue.location.lat?.toFixed(4)}, ${issue.location.lng?.toFixed(4)}` : 
                          'Unknown'
                        }
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                        {issue.peopleCount || 0} people affected
                      </div>
                      
                      {issue.commentsCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="h-4 w-4" />
                          {issue.commentsCount} comments
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openModal(issue)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold group/btn"
                  >
                    <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    View Details
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <div className="text-gray-400 text-lg mb-2">No issues found</div>
            <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
          </div>
        )}

        {/* Issue Details Modal */}
        {showModal && selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 rounded-t-3xl border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedIssue.title?.split(' / ')[0]?.trim() || 'Issue Details'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedIssue.createdAt).toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                        {getStatusIcon(selectedIssue.status)}
                        {selectedIssue.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Issue Image */}
                  {selectedIssue.image && (
                    <div className="lg:col-span-2">
                      <img
                        src={`/uploads/${selectedIssue.image}`}
                        alt="Issue"
                        className="w-full h-48 object-cover rounded-2xl shadow-md border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Category and Upvotes */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${getCategoryColor(selectedIssue.category)}`}>
                        <span className="text-sm">{getCategoryIcon(selectedIssue.category)}</span>
                        {getCategoryName(selectedIssue.category)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Upvotes</label>
                      <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {selectedIssue.peopleCount || 0} people affected
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {selectedIssue.location ? 
                          `${selectedIssue.location.lat?.toFixed(4)}, ${selectedIssue.location.lng?.toFixed(4)}` : 
                          'Location not available'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-3">Description Summary</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedIssue.geminiSummary || 
                       selectedIssue.description || 
                       'No description available for this issue.'}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                      value={selectedIssue.status}
                      onChange={e => setSelectedIssue({ ...selectedIssue, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                      onClick={() => updateIssueStatus(selectedIssue._id, selectedIssue.status)}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;