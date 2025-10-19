import React from "react";

const LandingPageSimple = () => {
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
        textAlign: 'center',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          BookWise
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Your Digital Library Management System
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/signin"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Sign In
          </a>
          
          <a 
            href="/signup"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              border: '2px solid white',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Sign Up
          </a>
        </div>

        <div style={{
          marginTop: '3rem',
          fontSize: '1rem',
          opacity: 0.8
        }}>
          ✨ New Features: Advanced Search, Notifications, Dashboard & More!
        </div>
      </div>
    </div>
  );
};

export default LandingPageSimple;
