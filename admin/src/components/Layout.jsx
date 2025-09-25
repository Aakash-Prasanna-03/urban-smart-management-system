import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, FileText } from 'lucide-react';

const Layout = ({ children }) => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between h-24 items-center">
            <div className="flex items-center gap-10">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">UrbanFix Admin</h1>
              </div>
              <nav className="flex ml-10 space-x-12">
                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 border-b-4 text-xl font-semibold transition-all duration-150 ${
                    isActive('/')
                      ? 'border-blue-600 text-blue-900 bg-blue-50 rounded-t-xl shadow'
                      : 'border-transparent text-blue-700 hover:text-blue-900 hover:border-blue-300 hover:bg-blue-50 rounded-t-xl'
                  }`}
                >
                  <Home className="w-6 h-6 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/issues"
                  className={`inline-flex items-center px-4 py-2 border-b-4 text-xl font-semibold transition-all duration-150 ${
                    isActive('/issues')
                      ? 'border-blue-600 text-blue-900 bg-blue-50 rounded-t-xl shadow'
                      : 'border-transparent text-blue-700 hover:text-blue-900 hover:border-blue-300 hover:bg-blue-50 rounded-t-xl'
                  }`}
                >
                  <FileText className="w-6 h-6 mr-2" />
                  Issues
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg text-blue-700 font-medium">
                Welcome, <span className="font-bold">{admin?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-3 border border-blue-200 text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <LogOut className="w-6 h-6 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;