import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Users, Clock, AlertTriangle, CheckCircle, Filter, Search, Trash2, Lightbulb, Wrench } from "lucide-react";
import { FileText } from "lucide-react";
// Category icon and description mapping
const categoryMeta = {
  'Infrastructure': {
    icon: <Lightbulb className="w-5 h-5 text-yellow-600" />,
    desc: 'Roads, bridges, utilities'
  },
  'Sanitation': {
    icon: <Trash2 className="w-5 h-5 text-gray-600" />,
    desc: 'Waste management, cleaning'
  },
  'Traffic': {
    icon: <Wrench className="w-5 h-5 text-red-600" />,
    desc: 'Traffic lights, signs, congestion'
  },
  'Public Safety': {
    icon: <AlertTriangle className="w-5 h-5 text-blue-600" />,
    desc: 'Street lights, security'
  },
  'Environment': {
    icon: <MapPin className="w-5 h-5 text-green-600" />,
    desc: 'Pollution, green spaces'
  },
  'Utilities': {
    icon: <CheckCircle className="w-5 h-5 text-orange-600" />,
    desc: 'Water, electricity, gas'
  },
  'Other': {
    icon: <FileText className="w-5 h-5 text-gray-400" />,
    desc: 'Other civic issues'
  }
};
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
      try {
        const response = await fetch('/api/risk/grouped');
        const data = await response.json();
        // data.data is the array of grouped issues from backend
        const backendIssues = (data && data.data) ? data.data.map(issue => ({
          id: issue._id,
          title: issue.title,
          description: issue.description,
          lat: issue.location?.lat,
          lng: issue.location?.lng,
          status: issue.status,
          priority: issue.priority,
          category: issue.category,
          upvoteCount: issue.upvoteCount ?? (Array.isArray(issue.upvotes) ? issue.upvotes.length : 0),
          createdAt: issue.createdAt,
          author: issue.userEmail || 'Unknown'
        })) : [];
        setIssues(backendIssues);
        if (user && user.location) {
          setMapCenter([user.location.lat, user.location.lng]);
        }
      } catch (err) {
        setIssues([]);
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

    const uniqueFilteredIssues = Object.values(
      filteredIssues.reduce((acc, issue) => {
        if (!acc[issue.title]) acc[issue.title] = issue;
        return acc;
      }, {})
    );

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
      {/* Top Heading like Dashboard */}
      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-8 tracking-tight text-center">Community Issues</h1>
        </div>
      </div>

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
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{typeof issue.upvoteCount === 'number' ? issue.upvoteCount : 0} people had this issue</span>
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
              {uniqueFilteredIssues.length > 0 ? (
                uniqueFilteredIssues.map((issue, index) => (
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200">
                            {categoryMeta[issue.category]?.icon || categoryMeta['Other'].icon}
                            <span className="ml-1 font-semibold">{issue.category}</span>
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>

                      {/* Main issue in heading (first part before '/') */}
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg text-center">
                        {issue.title ? issue.title.split(' / ')[0].trim() : issue.title}
                      </h3>
                      {/* Category description */}
                      <div className="text-xs text-gray-500 text-center mb-2">
                        {categoryMeta[issue.category]?.desc || categoryMeta['Other'].desc}
                      </div>
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <a
                          href={issue.lat && issue.lng ? `https://www.google.com/maps/search/?api=1&query=${issue.lat},${issue.lng}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline text-sm flex items-center gap-1"
                        >
                          <MapPin className="w-4 h-4" />
                          {issue.location?.address ? issue.location.address : `View Location`}
                        </a>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{typeof issue.upvoteCount === 'number' ? issue.upvoteCount : 0} people had this issue</span>
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