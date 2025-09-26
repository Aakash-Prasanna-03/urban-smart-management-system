import React, { useEffect, useState } from "react";

export default function IssueTable() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchIssues = async () => {
    try {
      // Use location-based grouping endpoint (same as dashboard)
      const url = statusFilter
        ? `http://localhost:5000/api/issues?status=${statusFilter}`
        : "http://localhost:5000/api/issues";
      const res = await fetch(url);
      const data = await res.json();
      setIssues(data.data || data.issues || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/admin/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchIssues();
  };

  const deleteIssue = async (id) => {
    await fetch(`http://localhost:5000/api/admin/issues/${id}`, { method: "DELETE" });
    fetchIssues();
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-700 rounded-lg shadow p-4">
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Filter by Status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-200 dark:bg-gray-600">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">People</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues
            .filter(group => !statusFilter || group.status === statusFilter)
            .map((group) => (
            <tr key={group._id}>
              <td className="border p-2 font-bold text-blue-900">{group.title}</td>
              <td className="border p-2">{group.category}</td>
              <td className="border p-2">{group.location ? `(${group.location.lat?.toFixed(4)}, ${group.location.lng?.toFixed(4)})` : '-'}</td>
              <td className="border p-2 text-center font-semibold text-blue-700">{group.peopleCount}</td>
              <td className="border p-2">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  group.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  group.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  group.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                  group.status === 'rejected' ? 'bg-red-100 text-red-800' : ''
                }`}>
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                {group.status !== "resolved" && (
                  <button
                    onClick={() => updateStatus(group._id, "resolved")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => deleteIssue(group._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
