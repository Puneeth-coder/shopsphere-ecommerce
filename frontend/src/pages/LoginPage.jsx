import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { useUser } from "../context/UserContext";
import "../styles/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Password login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle traditional password login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
          rememberMe,
        }
      );

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-brand">
            Shop<span>Sphere</span>
          </h1>
          <p className="auth-subtitle">Welcome back! Please sign in to your account.</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠</span> {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            <span>✓</span> {success}
          </div>
        )}

        {/* Password Login Form */}
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              className="form-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label" htmlFor="remember-me-checkbox">
              <input
                id="remember-me-checkbox"
                className="checkbox-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <button className="btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;