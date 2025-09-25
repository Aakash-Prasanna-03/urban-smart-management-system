import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you with UrbanFix today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      // Call backend API to get Gemini response
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
      >
        Chatbot
      </button>

      {/* Chatbot Popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setOpen(false)}></div>
          <div className="relative w-96 max-w-full bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col m-8">
            <div className="bg-blue-600 text-white text-lg font-bold rounded-t-2xl px-6 py-4 flex justify-between items-center">
              <span>UrbanFix Chatbot</span>
              <button onClick={() => setOpen(false)} className="text-white text-xl font-bold px-2">×</button>
            </div>
            <div className="flex-1 px-6 py-4 overflow-y-auto" style={{ maxHeight: '350px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-xl text-base max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex px-6 py-4 border-t border-blue-100">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="ml-3 px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
