import React from "react";

const Footer = () => {
  return (
    <footer style={{
      marginTop: "3rem",
      padding: "1.5rem 1rem",
      borderTop: "1px solid #eee",
      color: "#666",
      fontSize: "0.9rem",
      background: "#fafafa",
      textAlign: "center"
    }}>
      <div>© {new Date().getFullYear()} bookWise · Discover, Learn, Grow</div>
      <div style={{ marginTop: "0.5rem" }}>
        <a href="/explore" style={{ marginRight: "1rem" }}>Explore</a>
        <a href="/signin" style={{ marginRight: "1rem" }}>Sign in</a>
        <a href="/signup">Create account</a>
      </div>
    </footer>
  );
};

export default Footer; 