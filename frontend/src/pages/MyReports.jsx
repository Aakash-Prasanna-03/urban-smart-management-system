import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function MyReports() {
  const { user, loading: authLoading } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/60 dark:bg-white/6 shadow-md mb-4 animate-pulse"></div>
          <p className="text-gray-700 dark:text-gray-200">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            You need to login first!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Redirecting to login page...
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  // Function to fetch user reports
  const fetchMyReports = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reports for user:', user);
      const res = await fetch(
        `http://localhost:5000/api/issues/user/${user.id || user._id}`
      );
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const result = await res.json();
      // Backend returns { success, count, data }
      const reports = result.data || [];
      setMyReports(reports);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError("Failed to load reports. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-2">
          My Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          Overview of issues you have submitted.
        </p>
        <div className="text-base font-medium text-indigo-700 dark:text-indigo-300 mb-4">
          Showing <span className="font-bold">{myReports.length}</span> report{myReports.length !== 1 ? 's' : ''}.
        </div>
        <button
          onClick={fetchMyReports}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 1114 0" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-200">Refresh</span>
        </button>
      </header>

      {/* Main content */}
  <main className="max-w-6xl mx-auto px-2">
        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/40 border border-red-100 dark:border-red-800 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86l-7.5 13.0A2 2 0 004.5 20h15a2 2 0 001.71-2.84l-7.5-13a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={fetchMyReports}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-md shadow-sm hover:opacity-95"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : myReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myReports.map((report) => {
              const created = report.createdAt ? new Date(report.createdAt) : null;
              const formattedDate = created ? created.toLocaleString() : "—";

              const status = report.status || "Open";
              const statusLower = status.toLowerCase();

              const statusColor =
                statusLower === "pending"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/40"
                  : statusLower === "resolved" || statusLower === "closed" || statusLower === "completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/40";

              const cardHighlight =
                statusLower === "resolved" || statusLower === "closed"
                  ? "border-l-4 border-green-500"
                  : "";

              return (
                <article
                  key={report._id}
                  className={`relative p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 border animate-fade-in min-h-[180px] flex flex-col items-center justify-center ${
                    statusLower === "resolved" || statusLower === "closed" ? "border-green-300 dark:border-green-700" : "border-red-300 dark:border-red-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: statusLower === "pending" ? "#fdecec" : statusLower === "resolved" ? "#e6f4ea" : "#eef2ff" }}>
                    <svg
                      className={`w-6 h-6 ${
                        statusLower === "resolved" || statusLower === "closed"
                          ? "text-green-600 dark:text-green-300"
                          : statusLower === "pending"
                          ? "text-red-500 dark:text-red-300"
                          : "text-indigo-500 dark:text-indigo-300"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 text-center">
                    {report.title || "Untitled report"}
                  </h3>
                  <p className="mb-4 text-base text-gray-600 dark:text-gray-300 text-center">
                    {report.description || "No description provided."}
                  </p>
                  <span className={`px-4 py-1 rounded-full ${statusColor} font-semibold mb-2 mx-auto block text-center`}>
                    {status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm mx-auto block text-center">{formattedDate}</span>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-56 h-56 rounded-2xl bg-white dark:bg-gray-800 shadow flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-indigo-500">
                <path d="M3 7a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 3v4M15 3v4M7 11h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="max-w-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No reports yet</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                It looks like you haven't submitted anything yet. When you create reports they'll appear here with status updates and timestamps.
              </p>
              <div className="mt-4">
                <button
                  onClick={fetchMyReports}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
                >
                  Check again
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
