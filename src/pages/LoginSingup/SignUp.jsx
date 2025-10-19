import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import "../Assets/css/login.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    dob: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
      newErrors.username = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.dob && new Date(formData.dob) > new Date()) {
      newErrors.dob = "Date of birth cannot be in the future";
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
      const { confirmPassword, ...userData } = formData;
      const response = await axios.post(`http://localhost:5000/register`, userData);

      if (response.status === 201) {
        toast.success(response.data.msg, {
            position: "top-center",
          autoClose: 3000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
          });
        
          setTimeout(() => {
            window.location.href = "/signin";
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.msg || "Registration failed. Please try again.";
      
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
            <h2 className="auth-subtitle">Create Your Account</h2>
            <p className="auth-description">
              Join thousands of book lovers and start your reading journey today
            </p>
        </div>

          <form className="auth-form" onSubmit={submitForm}>
            <div className="form-group">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
            <input
              type="text"
                  className={`auth-input ${errors.name ? 'error' : ''}`}
              name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputs}
            />
          </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

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
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  className={`auth-input ${errors.phone ? 'error' : ''}`}
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputs}
            />
          </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
                  className="auth-input"
                  name="address"
                  placeholder="Address (Optional)"
                  value={formData.address}
                  onChange={handleInputs}
            />
          </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaCalendarAlt className="input-icon" />
            <input
                  type="date"
                  className={`auth-input ${errors.dob ? 'error' : ''}`}
                  name="dob"
                  placeholder="Date of Birth (Optional)"
                  value={formData.dob}
                  onChange={handleInputs}
            />
          </div>
              {errors.dob && <span className="error-message">{errors.dob}</span>}
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

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputs}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/signin" className="auth-link">
                  Sign In
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Books and Reading"
          />
          <div className="auth-overlay">
            <h3>Join Our Community</h3>
            <p>Discover, share, and explore the world of books with fellow readers</p>
        </div>
      </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
