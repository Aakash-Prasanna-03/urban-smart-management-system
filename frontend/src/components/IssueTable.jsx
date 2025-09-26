import React, { useEffect, useState } from "react";

export default function IssueTable() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/issues");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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
      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-200 dark:bg-gray-600">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td className="border p-2">{issue.title}</td>
              <td className="border p-2">{issue.description}</td>
              <td className="border p-2">{issue.status}</td>
              <td className="border p-2">{issue.user}</td>
              <td className="border p-2 space-x-2">
                {issue.status !== "resolved" && (
                  <button
                    onClick={() => updateStatus(issue._id, "resolved")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => deleteIssue(issue._id)}
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
