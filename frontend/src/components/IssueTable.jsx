import React, { useEffect, useState } from "react";

export default function IssueTable() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/admin/issues");
      const data = await res.json();
      
      if (data.success) {
        setIssues(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/issues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      if (data.success) {
        fetchIssues();
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const deleteIssue = async (id) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/admin/issues/${id}`, { 
        method: "DELETE" 
      });
      
      const data = await res.json();
      if (data.success) {
        fetchIssues();
      } else {
        alert('Failed to delete issue: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting issue:', err);
      alert('Failed to delete issue');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
        <p className="text-center text-gray-600 dark:text-gray-300">Loading issues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
        <p className="text-center text-red-600">Error: {error}</p>
        <button 
          onClick={fetchIssues} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-700 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        All Issues ({issues.length})
      </h2>
      
      {issues.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300 py-8">No issues found</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-600">
            <tr>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">User</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Created</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="border p-2">
                  {issue.image ? (
                    <img 
                      src={`http://localhost:5001/uploads/${issue.image}`}
                      alt="Issue"
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
                </td>
                <td className="border p-2 font-medium">{issue.title}</td>
                <td className="border p-2 max-w-xs">
                  <div className="truncate" title={issue.description}>
                    {issue.description}
                  </div>
                </td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </td>
                <td className="border p-2">{issue.userEmail}</td>
                <td className="border p-2 text-xs">
                  {issue.location ? `${issue.location.lat?.toFixed(4)}, ${issue.location.lng?.toFixed(4)}` : 'N/A'}
                </td>
                <td className="border p-2 text-xs">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 space-x-1">
                  <select 
                    value={issue.status}
                    onChange={(e) => updateStatus(issue._id, e.target.value)}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => deleteIssue(issue._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
