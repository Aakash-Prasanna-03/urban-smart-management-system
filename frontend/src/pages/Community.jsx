import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Users, Clock, AlertTriangle, CheckCircle, Filter, Search, Trash2, Lightbulb, Wrench } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function Community() {
  const { user, loading: authLoading } = useAuth();
  const [issues, setIssues] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Show loading skeleton if auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-12 w-80 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 animate-pulse" />
          <div className="h-96 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mb-8 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fetch community issues
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyIssues = [
        {
          id: 1,
          title: "Garbage collection pending",
          description: "Street near park has garbage piling up for over a week. Creating health hazards.",
          lat: 28.6139,
          lng: 77.209,
          status: 'pending',
          priority: 'high',
          category: 'Sanitation',
          votes: 12,
          createdAt: '2024-01-15',
          author: 'Sarah M.'
        },
        {
          id: 2,
          title: "Street light not working",
          description: "Main street light has been out since last week, creating safety concerns.",
          lat: 28.614,
          lng: 77.208,
          status: 'in-progress',
          priority: 'medium',
          category: 'Infrastructure',
          votes: 8,
          createdAt: '2024-01-14',
          author: 'Alex R.'
        },
        {
          id: 3,
          title: "Pothole repairs needed",
          description: "Large potholes on Main Street causing vehicle damage.",
          lat: 28.615,
          lng: 77.207,
          status: 'resolved',
          priority: 'medium',
          category: 'Roads',
          votes: 15,
          createdAt: '2024-01-10',
          author: 'Mike D.'
        },
        {
          id: 4,
          title: "Traffic signal malfunction",
          description: "Traffic light stuck on red, causing major congestion.",
          lat: 28.616,
          lng: 77.210,
          status: 'pending',
          priority: 'urgent',
          category: 'Traffic',
          votes: 25,
          createdAt: '2024-01-16',
          author: 'Lisa K.'
        }
      ];

      if (user) {
        setIssues(dummyIssues);
        if (user.location) {
          setMapCenter([user.location.lat, user.location.lng]);
        }
      } else {
        setIssues(dummyIssues);
      }
      setLoading(false);
    };

    fetchIssues();
  }, [user]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'sanitation': return <Trash2 className="w-4 h-4" />;
      case 'infrastructure': return <Lightbulb className="w-4 h-4" />;
      case 'roads': return <AlertTriangle className="w-4 h-4" />;
      case 'traffic': return <Wrench className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-white/20 dark:border-gray-800/20 mb-6">
              <Users className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Dashboard</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Community <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Issues</span>
            </h1>
            
            {!user ? (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                You are viewing as a guest. Login to report issues and see nearby reports with enhanced features.
              </p>
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Welcome back! Track and resolve community issues in your area with AI-powered insights.
              </p>
            )}
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {status === 'all' ? 'All' : status.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section - NOW WITH ACTUAL MAP */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-800/20 rounded-xl overflow-hidden shadow-lg">
          <div className="h-96 w-full relative">
            <MapContainer center={mapCenter} zoom={13} className="w-full h-full rounded-xl">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filteredIssues.map((issue) => (
                <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(issue.category)}
                        <h4 className="font-semibold text-sm">{issue.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">{issue.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{issue.votes} votes</span>
                          <span>•</span>
                          <span>{issue.author}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                          {issue.priority} priority
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </motion.section>

      {/* Issues Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-800/20 rounded-xl p-6 h-full hover:shadow-xl border-l-4 border-l-blue-200 dark:border-l-blue-800 group-hover:border-l-blue-500 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(issue.status)}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            {issue.category}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {issue.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Location
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {issue.votes} votes
                          </span>
                        </div>
                        <span>by {issue.author}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                          <button className="h-7 px-2 text-xs bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No issues found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No community issues have been reported yet.'
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}