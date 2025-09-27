import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Users, Clock, CheckCircle, AlertTriangle, Filter, Loader, MapPin, TrendingUp, Calendar } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <div className="text-lg text-blue-700 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4 tracking-tight">
            Community Dashboard
          </h1>
          <p className="text-gray-600 text-lg font-light">Monitor and manage community issues efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: 'Total Issues',
              value: stats.totalIssues,
              icon: <FileText className="h-8 w-8" />,
              gradient: 'from-blue-100 to-blue-50',
              border: 'border-blue-200',
              color: 'text-blue-600',
              iconColor: 'text-blue-500',
              bgColor: 'bg-blue-100'
            },
            {
              title: 'Pending Issues',
              value: stats.pendingIssues,
              icon: <Clock className="h-8 w-8" />,
              gradient: 'from-amber-100 to-amber-50',
              border: 'border-amber-200',
              color: 'text-amber-600',
              iconColor: 'text-amber-500',
              bgColor: 'bg-amber-100'
            },
            {
              title: 'Resolved Issues',
              value: stats.resolvedIssues,
              icon: <CheckCircle className="h-8 w-8" />,
              gradient: 'from-emerald-100 to-emerald-50',
              border: 'border-emerald-200',
              color: 'text-emerald-600',
              iconColor: 'text-emerald-500',
              bgColor: 'bg-emerald-100'
            },
            {
              title: 'Total Users',
              value: stats.totalUsers,
              icon: <Users className="h-8 w-8" />,
              gradient: 'from-purple-100 to-purple-50',
              border: 'border-purple-200',
              color: 'text-purple-600',
              iconColor: 'text-purple-500',
              bgColor: 'bg-purple-100'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grouped Issues Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-500" />
                Grouped Issues by Location
              </h3>
              <p className="text-gray-600 text-sm">Issues grouped by geographical location and risk level</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Filter className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by Risk:</label>
              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all outline-none shadow-sm"
              >
                <option value="">All Risks</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {groupedIssues.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    {[
                      { label: 'Title', icon: <FileText className="h-4 w-4" /> },
                      { label: 'Category', icon: <Filter className="h-4 w-4" /> },
                      { label: 'Location', icon: <MapPin className="h-4 w-4" /> },
                      { label: 'Upvotes', icon: <TrendingUp className="h-4 w-4" /> },
                      { label: 'Date', icon: <Calendar className="h-4 w-4" /> },
                      { label: 'Risk Level', icon: <AlertTriangle className="h-4 w-4" /> }
                    ].map((head) => (
                      <th
                        key={head.label}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          {head.icon}
                          {head.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedIssues.map((issue, index) => (
                    <tr 
                      key={issue._id} 
                      className="hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {issue.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 group-hover:text-gray-800 transition-colors">
                        {issue.category}
                      </td>
                      <td className="px-6 py-4 text-gray-600 group-hover:text-gray-800 transition-colors">
                        ({issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)})
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {issue.upvoteCount} votes
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 group-hover:text-gray-800 transition-colors">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {issue.category === 'unrelated' ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                            <AlertTriangle className="h-4 w-4" />
                            Not an Issue
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${
                              issue.riskLevel === 'urgent'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : issue.riskLevel === 'moderate'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
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
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No grouped issues found</div>
              <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Dashboard Summary</h4>
              <p className="text-gray-600 text-sm">
                {stats.resolvedIssues} of {stats.totalIssues} issues resolved ({stats.totalIssues > 0 ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100) : 0}% completion rate)
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;