import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, MapPin, Camera, FileText, Minimize2, Maximize2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Safety check for auth context
  if (!auth) {
    return null;
  }

  const { user } = auth;

  // Enhanced Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => "session_" + Date.now());
  const messagesEndRef = useRef(null);

  // Helper function to clean/trim strings safely
  const cleanString = (str) => {
    if (!str) return "";
    // Fixed regex - was /^+|+$/g, now properly matches whitespace
    return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
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

  // Send message function with proper string cleaning
  const sendMessage = async (messageText = input) => {
    const cleanedMessage = cleanString(messageText);
    if (!cleanedMessage || loading) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: cleanedMessage,
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
          message: cleanedMessage,
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
      const botText = cleanString(data.message || data.reply || "Sorry, no response.");

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

  // If no user, don't render anything
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-[9998]"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
      </button>

      {/* Enhanced Chatbot Modal */}
      {chatOpen && (
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