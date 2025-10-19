import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingBag, FaHeart, FaEye, FaFilter } from "react-icons/fa";
import "../../Assets/css/marketplace.css";

const Marketplace = ({ user }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    sortBy: "createdAt",
    order: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
    fetchStats();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const { data } = await axios.get(
        `http://localhost:5000/marketplace?${params.toString()}`
      );
      setListings(data.listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/marketplace-stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInterest = async (listingId) => {
    if (!user) {
      toast.warning("Please login to express interest");
      navigate("/signin");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/marketplace/${listingId}/interest`,
        {},
        { withCredentials: true }
      );
      toast.success("Interest expressed! Seller will be notified.");
      fetchListings();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to express interest");
    }
  };

  const getConditionBadge = (condition) => {
    const colors = {
      'new': '#10b981',
      'like-new': '#3b82f6',
      'good': '#8b5cf6',
      'fair': '#f59e0b',
      'poor': '#ef4444'
    };

    return (
      <span 
        className="condition-badge" 
        style={{ background: colors[condition] || '#6b7280' }}
      >
        {condition.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <div className="marketplace-container">
        {/* Hero Section */}
        <div className="marketplace-hero">
          <h1>📚 Book Marketplace</h1>
          <p>Buy and sell used books with fellow readers</p>
          {user && (
            <button 
              className="btn-primary"
              onClick={() => navigate("/marketplace/sell")}
            >
              <FaShoppingBag /> Sell Your Books
            </button>
          )}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="marketplace-stats">
            <div className="stat-box">
              <h3>{stats.availableListings}</h3>
              <p>Books Available</p>
            </div>
            <div className="stat-box">
              <h3>{stats.soldListings}</h3>
              <p>Books Sold</p>
            </div>
            <div className="stat-box">
              <h3>₹{stats.averagePrice}</h3>
              <p>Average Price</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="marketplace-search">
          <div className="search-bar-marketplace">
            <input
              type="text"
              placeholder="Search books, authors, categories..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <button onClick={() => setShowFilters(!showFilters)}>
              <FaFilter /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel-marketplace fade-in">
              <div className="filter-row">
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="empty-state">
            <p>No books found. Be the first to list a book!</p>
          </div>
        ) : (
          <div className="marketplace-grid">
            {listings.map((listing) => (
              <div key={listing._id} className="marketplace-card fade-in">
                <div className="marketplace-card-image">
                  {listing.images && listing.images[0] ? (
                    <img src={listing.images[0]} alt={listing.bookTitle} />
                  ) : (
                    <div className="placeholder-image">
                      <FaShoppingBag size={48} />
                    </div>
                  )}
                  {getConditionBadge(listing.condition)}
                </div>

                <div className="marketplace-card-content">
                  <h3>{listing.bookTitle}</h3>
                  <p className="author">by {listing.author}</p>
                  
                  {listing.category && (
                    <span className="category-tag">{listing.category}</span>
                  )}

                  <p className="description">
                    {listing.description 
                      ? listing.description.substring(0, 100) + "..."
                      : "No description provided"}
                  </p>

                  <div className="marketplace-card-footer">
                    <div className="price-section">
                      <span className="price">₹{listing.price}</span>
                      {listing.originalPrice && (
                        <span className="original-price">₹{listing.originalPrice}</span>
                      )}
                    </div>

                    <div className="listing-meta">
                      <span><FaEye /> {listing.views}</span>
                      <span><FaHeart /> {listing.interestedBuyers?.length || 0}</span>
                    </div>
                  </div>

                  <div className="marketplace-actions">
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/marketplace/${listing._id}`)}
                    >
                      View Details
                    </button>
                    {user && user._id !== listing.sellerId && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleInterest(listing._id)}
                      >
                        <FaHeart /> Interested
                      </button>
                    )}
                  </div>

                  <div className="seller-info">
                    <small>Sold by: {listing.sellerName}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
