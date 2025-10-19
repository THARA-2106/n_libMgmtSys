import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignInSimple = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "demo@example.com",
    password: "password"
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, accept any non-empty email and password
      if (formData.username && formData.password) {
        const mockUser = {
          _id: 'demo-user-id',
          name: 'Demo User',
          email: formData.username,
          role: 'user'
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Call the parent's onLogin if provided
        if (onLogin) onLogin(mockUser);
        
        toast.success("Login successful!");
        navigate('/home');
      } else {
        toast.error("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        margin: '1rem'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2d3748', 
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          BookWise
        </h1>
        
        <h2 style={{ 
          textAlign: 'center', 
          color: '#4a5568', 
          marginBottom: '1rem' 
        }}>
          Welcome Back
        </h2>

        <form onSubmit={submitForm}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              name="username"
              placeholder="Email Address"
              value={formData.username}
              onChange={handleInputs}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputs}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#718096', margin: '0' }}>
              Don't have an account?{" "}
              <a 
                href="/signup" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default SignInSimple;
