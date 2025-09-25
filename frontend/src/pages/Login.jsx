// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/myreports");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
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
        <button type="submit">Login</button>
      </form>

      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #6b73ff, #000dff);
        }

        .login-form {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          width: 360px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.25);
        }

        h1 {
          margin-bottom: 25px;
          text-align: center;
          color: #333;
          font-size: 28px;
        }

        .login-form input {
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .login-form input:focus {
          border-color: #6b73ff;
          box-shadow: 0 0 8px rgba(107, 115, 255, 0.4);
          outline: none;
        }

        .login-form button {
          padding: 12px 15px;
          background: #6b73ff;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .login-form button:hover {
          background: #5a63e0;
          transform: translateY(-2px);
        }

        .error {
          color: #e53e3e;
          margin-bottom: 15px;
          text-align: center;
        }

        @media (max-width: 400px) {
          .login-form {
            width: 90%;
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
