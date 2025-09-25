// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await register(name, email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    alert("Registered successfully! Please login now.");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <style>{`
        .signup-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 20px;
        }

        .signup-form {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          width: 360px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .signup-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.25);
        }

        h2 {
          margin-bottom: 25px;
          text-align: center;
          color: #333;
          font-size: 28px;
        }

        .signup-form input {
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .signup-form input:focus {
          border-color: #667eea;
          box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
          outline: none;
        }

        .signup-form button {
          padding: 12px 15px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .signup-form button:hover {
          background: #5a67d8;
          transform: translateY(-2px);
        }

        .error {
          color: #e53e3e;
          margin-bottom: 15px;
          text-align: center;
        }

        @media (max-width: 400px) {
          .signup-form {
            width: 100%;
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
