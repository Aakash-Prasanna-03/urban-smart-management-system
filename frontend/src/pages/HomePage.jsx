import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Zap, 
  Users, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Eye,
  Brain,
  Camera,
  MessageSquare,
  TrendingUp,
  Award,
  Globe,
  Star,
  Play,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [counters, setCounters] = useState({
    issues: 0,
    cities: 0,
    users: 0,
    resolution: 0
  });

  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Counter animation
  useEffect(() => {
    const targets = { issues: 10000, cities: 25, users: 50000, resolution: 95 };
    const duration = 2000; // 2 seconds
    const increment = 50; // Update every 50ms
    const steps = duration / increment;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      
      setCounters({
        issues: Math.floor(targets.issues * progress),
        cities: Math.floor(targets.cities * progress),
        users: Math.floor(targets.users * progress),
        resolution: Math.floor(targets.resolution * progress)
      });

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Detection",
      description: "YOLO-based computer vision automatically identifies and categorizes civic issues from uploaded images",
      gradient: "from-blue-500 to-cyan-500",
      details: ["Real-time image analysis", "99% accuracy rate", "Automated severity scoring"]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart Text Analysis",
      description: "Advanced NLP processes descriptions to extract urgency cues and priority indicators",
      gradient: "from-purple-500 to-pink-500",
      details: ["BERT-based classification", "Multi-language support", "Context understanding"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Community Intelligence",
      description: "Collective voting and engagement data enhances ML-driven priority scoring systems",
      gradient: "from-green-500 to-emerald-500",
      details: ["Democratic voting", "Real-time updates", "Transparency tracking"]
    }
  ];

  const stats = [
    { 
      value: counters.issues.toLocaleString() + "+", 
      label: "Issues Resolved", 
      icon: "🎯",
      description: "Successfully processed and resolved through our platform"
    },
    { 
      value: counters.cities.toString(), 
      label: "Cities Served", 
      icon: "🏙️",
      description: "Active deployment across major metropolitan areas"
    },
    { 
      value: counters.users.toLocaleString() + "+", 
      label: "Active Citizens", 
      icon: "👥",
      description: "Engaged community members making a difference"
    },
    { 
      value: counters.resolution + "%", 
      label: "Success Rate", 
      icon: "📊",
      description: "Average resolution rate across all reported issues"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Community Leader",
      location: "Mumbai",
      quote: "UrbanFix transformed how we handle civic issues. The AI detection is incredibly accurate.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Ward Councillor",
      location: "Delhi",
      quote: "The priority scoring system helps us allocate resources more effectively than ever before.",
      rating: 5
    },
    {
      name: "Amit Singh",
      role: "Resident",
      location: "Bangalore",
      quote: "Finally, a platform where citizen reports actually lead to quick action and resolution.",
      rating: 5
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Smart Upload",
      description: "Capture photos and provide descriptions of civic issues. Our computer vision AI instantly analyzes image content for issue type and severity assessment.",
      icon: <Camera className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "02", 
      title: "AI Analysis",
      description: "Advanced machine learning processes your input through YOLO object detection and BERT text analysis for comprehensive understanding.",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      title: "Community Voting",
      description: "Citizens vote on reported issues while ML algorithms factor community engagement into dynamic priority scoring systems.",
      icon: <Users className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      step: "04",
      title: "Priority Action",
      description: "Multi-modal fusion engine combines all signals to generate final urgency scores, ensuring critical issues receive immediate administrative attention.",
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-200/10 dark:bg-purple-500/5 rounded-full blur-2xl"
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-white/20 dark:border-gray-800/20 mb-8 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Next-Generation Civic AI Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Smart City
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="max-w-4xl mx-auto text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed"
            >
            Transforming civic engagement with advanced AI. Our platform leverages{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              computer vision and natural language processing
            </span>{' '}
            along with{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              community-driven insights
            </span>{' '}
            to address urban challenges quickly and effectively.


            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button 
                onClick={() => navigate('/upload')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-5 h-5 mr-2" />
                Report an Issue
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button 
                onClick={() => navigate('/community')}
                className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transform transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5 mr-2" />
                See Issues in my area
                <Eye className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center justify-center gap-1">
                    <span className="text-lg">{stat.icon}</span>
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Advanced AI
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Our cutting-edge machine learning platform combines multiple AI technologies to create the most intelligent civic engagement system ever built
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="card-glass p-8 text-center h-full group-hover:shadow-2xl transition-all duration-500">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How UrbanFix Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              From AI-powered detection to community-driven resolution in four intelligent steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card-glass p-8 group hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform duration-300`}>
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Communities
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              See how UrbanFix is transforming civic engagement across cities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card-glass p-6 group hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90" />
        
        <motion.div 
          className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-8"
          >
            <Shield className="w-20 h-20 text-white/80" />
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of citizens and administrators using AI-powered civic engagement to create lasting, measurable change in their neighborhoods through data-driven solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              onClick={() => navigate('/signup')}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
            <motion.button 
              onClick={() => navigate('/community')}
              className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white/30 font-semibold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="w-5 h-5 mr-2" />
              View Live Demo
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}