import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, MapPin, User, Calendar, Image } from 'lucide-react';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`/api/admin/issues${filter !== 'all' ? `?status=${filter}` : ''}`);
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await axios.put(`/api/admin/issues/${issueId}`, { status: newStatus });
      fetchIssues(); // Refresh the list
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
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10 sm:px-0">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Issues Management</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block px-4 py-2 border border-blue-200 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-blue-900 font-medium"
          >
            <option value="all">All Issues</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {issues.length > 0 ? (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-blue-100">
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">Issue Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {issues.map((issue) => (
                  <tr key={issue._id} className="transition hover:bg-blue-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {issue.image && (
                          <img src={`/uploads/${issue.image}`} alt="Issue" className="h-10 w-10 rounded-lg object-cover border border-blue-100" />
                        )}
                        <div>
                          <div className="text-base font-bold text-blue-900">{issue.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{issue.description}</div>
                          {issue.location && Array.isArray(issue.location.coordinates) && (
                            <div className="flex items-center text-xs text-blue-400 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {issue.location.coordinates[1]}, {issue.location.coordinates[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <select
                        value={issue.status}
                        onChange={(e) => updateIssueStatus(issue._id, e.target.value)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-0 transition ${getStatusColor(issue.status)} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400 mr-2" />
                        <div>
                          <div className="text-sm text-blue-900 font-medium">{issue.userEmail}</div>
                          <div className="text-xs text-gray-400">{issue.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-blue-400" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(issue)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Modal for Issue Details */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-40 z-50 flex items-center justify-center transition">
          <div className="relative p-8 border-0 w-full max-w-xl shadow-2xl rounded-2xl bg-white max-h-[80vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-extrabold text-blue-900">
                  {selectedIssue.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-blue-400 hover:text-blue-700 text-2xl font-bold px-2 rounded transition"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedIssue.image && (
                  <div className="mb-4">
                    <img
                      src={`/uploads/${selectedIssue.image}`}
                      alt="Issue"
                      className="max-w-full h-48 w-full object-cover rounded-xl shadow-md border border-blue-100"
                    />
                    <div className="mt-4">
                      <label className="block text-base font-semibold text-blue-700">Description</label>
                      <p className="mt-2 text-base text-gray-900 bg-blue-50 rounded-lg p-3 shadow-sm">{selectedIssue.description}</p>
                    </div>
                  </div>
                )}
                {!selectedIssue.image && (
                  <div className="mb-4">
                    <label className="block text-base font-semibold text-blue-700">Description</label>
                    <p className="mt-2 text-base text-gray-900 bg-blue-50 rounded-lg p-3 shadow-sm">{selectedIssue.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700">User Email</label>
                    <p className="mt-1 text-sm text-blue-900">{selectedIssue.userEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Phone</label>
                    <p className="mt-1 text-sm text-blue-900">{selectedIssue.userPhone}</p>
                  </div>
                </div>

                {selectedIssue.location && Array.isArray(selectedIssue.location.coordinates) && (
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Location</label>
                    <p className="mt-1 text-sm text-blue-900">
                      Latitude: {selectedIssue.location.coordinates[1]}, Longitude: {selectedIssue.location.coordinates[0]}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Status</label>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedIssue.status)}`}>
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Created</label>
                    <p className="mt-1 text-sm text-blue-900">
                      {new Date(selectedIssue.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700">Upvotes</label>
                  <p className="mt-1 text-sm text-blue-900">{selectedIssue.upvotes || 0}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-blue-600 text-white text-base font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;