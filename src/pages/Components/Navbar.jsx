import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaUser, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "../Assets/css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";

const Navbar = ({ user, onSearchResults, onLogout }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleReservations = () => {
    navigate("/reservations");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.success("Logged out successfully", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        textAlign: "center",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  // Function to determine whether a link should be underlined
  const isLinkActive = (path) => location.pathname === path;

  return (
    <div>
      <div className="nav-top">
        <div className="nav-inner-top">
          <div>
            <div
              onClick={handleHomeClick}
              style={{
                fontSize: "2.4rem",
                marginRight: "25rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              bookWise
            </div>
          </div>
          <div className="nav-inner-element">
            <div
              className={`nav-link ${isLinkActive("/home") ? "active" : ""}`}
              onClick={handleHomeClick}
              title="Home"
            >
              <FaHome className="nav-icon" />
              <span>Home</span>
            </div>
          </div>
          <div className="nav-search-container">
            <SearchBar 
              onSearchResults={onSearchResults}
              placeholder="Search books..."
            />
          </div>
          <div className="nav-inner-element">
            <div
              className={`nav-link ${isLinkActive("/explore") ? "active" : ""}`}
              onClick={handleExploreClick}
              title="Explore Books"
            >
              <FaBook className="nav-icon" />
              <span>Explore</span>
            </div>
          </div>
          <div className="nav-inner-element">
            <div
              className={`nav-link ${isLinkActive("/reservations") ? "active" : ""}`}
              onClick={handleReservations}
              title="My Reservations"
            >
              <span>Reservations</span>
            </div>
          </div>
          <div className="nav-inner-element">
            <div
              className={`nav-link ${isLinkActive("/profile") ? "active" : ""}`}
              onClick={handleProfileClick}
              title="My Profile"
            >
              <span>Profile</span>
            </div>
          </div>
          <div className="nav-inner-element" style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <NotificationBell user={user} />
            <ThemeToggle />
            <div 
              className="nav-link logout-link" 
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
