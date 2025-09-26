import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    totalUsers: 0
  });
  const [groupedIssues, setGroupedIssues] = useState([]);
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [riskFilter]);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data);
      // Fetch grouped issues with risk levels
      const riskParam = riskFilter ? `?risk=${riskFilter}` : '';
      const groupedResponse = await axios.get(`/api/risk/grouped${riskParam}`);
      setGroupedIssues(groupedResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10 sm:px-0 zoom-110">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-10 tracking-tight">Admin Dashboard</h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-blue-100 scale-105">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <FileText className="h-10 w-10 text-blue-400" />
                <div>
                  <div className="text-lg font-semibold text-blue-700">Total Issues</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalIssues}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-blue-100 scale-105">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <Clock className="h-10 w-10 text-yellow-400" />
                <div>
                  <div className="text-lg font-semibold text-blue-700">Pending Issues</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.pendingIssues}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-blue-100 scale-105">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-10 w-10 text-green-400" />
                <div>
                  <div className="text-lg font-semibold text-blue-700">Resolved Issues</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.resolvedIssues}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-blue-100 scale-105">
            <div className="p-8">
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-blue-500" />
                <div>
                  <div className="text-lg font-semibold text-blue-700">Total Users</div>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Grouped Issues with Risk Level */}
        <div className="bg-white shadow-lg rounded-2xl border border-blue-100 mt-10">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-900">Grouped Issues by Location & Risk</h3>
              <div>
                <label className="mr-2 font-semibold text-blue-700">Filter by Risk:</label>
                <select
                  value={riskFilter}
                  onChange={e => setRiskFilter(e.target.value)}
                  className="border border-blue-200 rounded-lg px-3 py-2 text-blue-900 bg-blue-50 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            {groupedIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-100 text-lg">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Title</th>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Location</th>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Upvotes</th>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-blue-800 uppercase tracking-wide">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {groupedIssues.map((issue) => (
                      <tr key={issue._id} className="transition hover:bg-blue-50">
                        <td className="px-6 py-5 font-bold text-blue-900">{issue.title}</td>
                        <td className="px-6 py-5 text-blue-900">
                          {(() => {
                            switch (issue.category) {
                              case 'infrastructure': return 'Infrastructure';
                              case 'sanitation': return 'Sanitation';
                              case 'traffic': return 'Traffic';
                              case 'public-safety': return 'Public Safety';
                              case 'environment': return 'Environment';
                              case 'utilities': return 'Utilities';
                              case 'other': return 'Other';
                              case 'unrelated': return <span className="text-blue-600 font-semibold">Unrelated</span>;
                              default: return issue.category;
                            }
                          })()}
                        </td>
                        <td className="px-6 py-5 text-blue-900">{`(${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)})`}</td>
                        <td className="px-6 py-5 text-blue-900 font-medium">{issue.upvoteCount}</td>
                        <td className="px-6 py-5 text-blue-900">{new Date(issue.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-5">
                          {issue.category === 'unrelated' ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              <AlertTriangle className="h-4 w-4" />
                              Not an Issue
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${
                              issue.riskLevel === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : issue.riskLevel === 'moderate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <AlertTriangle className="h-4 w-4" />
                              {issue.riskLevel.charAt(0).toUpperCase() + issue.riskLevel.slice(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-blue-400">No grouped issues found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;