import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { useUser } from "../context/UserContext";
import "../styles/auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // OTP Verification states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Separate loading states for better UX
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Send OTP handler using backend SMTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setError("");
    setSuccess("");
    setOtpLoading(true);

    try {
      await api.post("/auth/send-otp", {
        identifier: email,
      });

      setOtpSent(true);
      setSuccess("Verification OTP sent! Please check your email inbox.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Main Submit handler (Verifies OTP first, then registers account on backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!otpSent) {
      setError("Please request and enter the verification OTP sent to your email.");
      return;
    }

    setSubmitLoading(true);

    try {
      // 1. Verify OTP first (which logs the user in under a temp account on the backend)
      const verifyRes = await api.post("/auth/verify-otp", {
        identifier: email,
        otp: otp,
      });

      // 2. Once verified/logged in, update the profile with the chosen Name and Password
      const updateRes = await api.put("/auth/profile", {
        name: name,
        password: password,
      });

      setSuccess("Account verified and registered successfully!");
      localStorage.setItem("isLoggedIn", "true");
      setUser(updateRes.data.user);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "OTP verification or registration failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand/LMS Style Header */}
        <div className="auth-header" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontSize: "1.2rem", fontWeight: "700", color: "var(--primary-dark)", marginBottom: "16px" }}>
            <span style={{ fontSize: "1.6rem" }}></span> ShopSphere Portal
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--primary-dark)", margin: "0 0 6px 0" }}>Create an Account</h2>
          <p className="auth-subtitle">Sign up to start shopping</p>
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

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="username-input">
              Username
            </label>
            <input
              id="username-input"
              className="form-input"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitLoading}
            />
          </div>

          {/* Email Field with Send OTP Button */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email
            </label>
            <div className="input-with-button">
              <input
                id="email-input"
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent || submitLoading}
              />
              <button
                type="button"
                className="btn-side"
                onClick={handleSendOtp}
                disabled={otpLoading || submitLoading || !email}
              >
                {otpLoading ? "Sending..." : (otpSent ? "Resend" : "Send OTP")}
              </button>
            </div>
          </div>

          {/* OTP Verification Field (Appears only when OTP is sent) */}
          {otpSent && (
            <div className="form-group" style={{ animation: "fadeIn 0.3s ease" }}>
              <label className="form-label" htmlFor="otp-verify-input">
                Enter Verification OTP
              </label>
              <input
                id="otp-verify-input"
                className="form-input"
                type="text"
                maxLength="6"
                placeholder="••••••"
                style={{ textAlign: "center", fontWeight: "700", letterSpacing: "4px" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={submitLoading}
              />
            </div>
          )}

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitLoading}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">
              Confirm Password
            </label>
            <input
              id="confirm-password-input"
              className="form-input"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitLoading}
            />
          </div>

          <button className="btn-primary auth-btn" type="submit" disabled={submitLoading || otpLoading || !otpSent} style={{ marginTop: "12px" }}>
            {submitLoading ? "Verifying & Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
