import React from "react";
import "../../Assets/css/home.css";
import "../../Assets/css/enhancedhome.css";
import EnhancedHomePage from "./EnhancedHomePage";
import AllMember from "./AllMember";
import Footer from "../../Components/Footer";
import AdminBooks from "./AdminBooks";
import { useState } from "react";

const HomePage = ({ user }) => {
  // Use enhanced homepage for regular users, admin dashboard for admins
  if (user.userType === "user") {
    return <EnhancedHomePage user={user} />;
  }

  // Admin view with member management
  const bgStyle = {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    padding: "2rem",
  };

  return (
    <div className="home-top" style={{ paddingTop: "4rem", ...bgStyle }}>
      <div className="home-inner-top" style={{ padding: "1rem" }}>
        <div style={cardStyle}>
          <h1 style={{ marginBottom: "2rem", color: "var(--text)" }}>
            Admin Dashboard
          </h1>
          <AdminTabs user={user} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const AdminTabs = ({ user }) => {
  const [tab, setTab] = useState("borrowers");
  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setTab("borrowers")}
          className="land-button"
          style={{ padding: 0, cursor: "pointer", opacity: tab === "borrowers" ? 1 : 0.7 }}
        >
          <a className="landing-button-hover" style={{ padding: "0.5rem 1rem" }}>Borrowers</a>
        </button>
        <button
          onClick={() => setTab("books")}
          className="land-button"
          style={{ padding: 0, cursor: "pointer", opacity: tab === "books" ? 1 : 0.7 }}
        >
          <a className="landing-button-hover" style={{ padding: "0.5rem 1rem" }}>Manage Books</a>
        </button>
      </div>
      {tab === "borrowers" ? <AllMember user={user} /> : <AdminBooks />}
    </div>
  );
};

export default HomePage;
