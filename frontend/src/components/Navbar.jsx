import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MessageCircle, Send, X, MapPin, Camera, FileText,
  Minimize2, Maximize2, Moon, Sun, Shield, Menu,
  Upload, Users, User, LogOut
} from "lucide-react";

export default function Navbar() {
  const auth = useAuth();

  // Safety check for auth context
  if (!auth) {
    return <div className="h-16 bg-white dark:bg-gray-900 animate-pulse"></div>;
  }

  const { user, logout } = auth;
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enhanced Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => "session_" + Date.now());
  const messagesEndRef = useRef(null);

  // Dark mode toggle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle("dark", !darkMode);
      localStorage.setItem("theme", newTheme);
    }
    setDarkMode(!darkMode);
  };

  // Initialize welcome message
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "bot",
        text: "Hi! I'm your civic issues assistant. I can help you report issues, check status updates, or answer questions about our platform. What would you like to know?",
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { type: "report_issue", label: "Report New Issue", description: "Start reporting a civic issue" },
          { type: "check_status", label: "Check Status", description: "View your reported issues" },
          { type: "view_map", label: "Community View", description: "See issues in your area" }
        ]
      }]);
    }
  }, [chatOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close chat with Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setChatOpen(false);
    if (typeof window !== 'undefined') {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, []);

  // Handle suggested actions
  const handleActionClick = (action) => {
    switch (action.type) {
      case "report_issue":
        navigate("/upload");
        setChatOpen(false);
        break;
      case "check_status":
        navigate("/myreports");
        setChatOpen(false);
        break;
      case "view_map":
        navigate("/community");
        setChatOpen(false);
        break;
      default:
        break;
    }

    sendMessage(`I want to ${action.description.toLowerCase()}`);
  };

  // Fixed sendMessage function
  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText.trim(),
          userId: user?._id || user?.id,
          sessionId: sessionId,
          context: messages.slice(-3)
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Backend response:", data);

      // Normalize response
      const success = data.success === true || data.status === "success";
      const botText = data.message || data.reply || "Sorry, no response.";

      if (success) {
        const botMsg = {
          id: Date.now() + 1,
          role: "bot",
          text: botText,
          timestamp: data.timestamp || new Date().toISOString(),
          suggestedActions: data.suggestedActions || []
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(botText || "Failed to get response");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "Sorry, I encountered an error. Please try again or contact support if the issue persists.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const isActivePath = (path) => location.pathname === path;

  const navigationLinks = [
    { path: "/community", label: "Community", icon: Users },
    { path: "/upload", label: "Upload", icon: Upload },
    ...(user ? [
      { path: "/myreports", label: "My Reports", icon: FileText },
      { path: "/profile", label: "Profile", icon: User }
    ] : [])
  ];

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">UrbanFix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(path)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 text-sm rounded-lg transition-colors group hidden sm:flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:block">Hi, {user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium py-1.5 px-3 text-sm rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 px-3 text-sm rounded-lg transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 text-sm rounded-lg transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {navigationLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(path)
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}

                {user && (
                  <button
                    onClick={() => {
                      setChatOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat Assistant
                  </button>
                )}

                {!user && (
                  <div className="pt-4 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 px-3 text-sm rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 text-sm rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Chatbot Modal */}
      {chatOpen && user && (
        <div
          className={`fixed bottom-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 dark:border-gray-800/20 z-[9999] transition-all duration-300 ${
            isMinimized ? "w-80 h-12" : "w-96 h-[500px]"
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Civic Assistant</h3>
                {loading && <p className="text-xs text-white/80">Thinking...</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : message.isError
                        ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-bl-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}>
                      <div className="text-sm leading-relaxed">{message.text}</div>
                      {message.timestamp && (
                        <div className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {message.suggestedActions && message.suggestedActions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestedActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleActionClick(action)}
                              className="w-full text-left p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-2">
                                {action.type === "report_issue" && <Camera className="w-3 h-3" />}
                                {action.type === "check_status" && <FileText className="w-3 h-3" />}
                                {action.type === "view_map" && <MapPin className="w-3 h-3" />}
                                <div>
                                  <div className="font-medium">{action.label}</div>
                                  <div className="text-gray-500 dark:text-gray-400">{action.description}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl rounded-bl-none">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading}
                    className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}