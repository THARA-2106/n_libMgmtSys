import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import "../Assets/css/login.css";

// Debug: Check if component is loading
console.log("SignIn component loaded successfully!");

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/login`, formData, {
        withCredentials: true,
      });

      console.log("Login response:", response);

      const message = response.data.message;
      const status = response.data.status;

      if (status === "200") {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
        });
        
        setTimeout(() => {
          window.location.href = "/home";
        }, 1500);
      } else {
        toast.error(message || "Login failed", {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <div className="auth-header">
            <h1 className="auth-title">BookWise</h1>
            <h2 className="auth-subtitle">Welcome Back</h2>
            <p className="auth-description">
              Sign in to continue your reading journey
            </p>
            <div style={{ 
              background: 'linear-gradient(135deg, #48bb78, #38a169)', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              ✨ NEW: Enhanced UI & Features!
            </div>
          </div>

          <form className="auth-form" onSubmit={submitForm}>
            <div className="form-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className={`auth-input ${errors.username ? 'error' : ''}`}
                  name="username"
                  placeholder="Email Address"
                  value={formData.username}
                  onChange={handleInputs}
                />
              </div>
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputs}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-image-container">
          <img
            className="auth-image"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Reading and Learning"
          />
          <div className="auth-overlay">
            <h3>Your Library Awaits</h3>
            <p>Access your personal collection and discover new favorites</p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignIn;