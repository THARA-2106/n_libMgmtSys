import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import "../Assets/css/bookcard.css";

const EnhancedBookCard = ({ book, user, onAction }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [review, setReview] = useState("");
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    if (book._id) {
      fetchRatings();
      if (user) {
        fetchUserRating();
      }
    }
  }, [book._id, user]);

  const fetchRatings = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/ratings/book/${book._id}`
      );
      setAverageRating(parseFloat(data.averageRating));
      setTotalRatings(data.totalRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/ratings/user/${book._id}`,
        { withCredentials: true }
      );
      if (data.rating) {
        setUserRating(data.rating.rating);
        setReview(data.rating.review || "");
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      toast.warning("Please select a rating");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/ratings",
        {
          bookId: book._id,
          rating: userRating,
          review: review,
        },
        { withCredentials: true }
      );
      toast.success("Rating submitted successfully!");
      setShowRatingModal(false);
      fetchRatings();
    } catch (error) {
      toast.error("Failed to submit rating");
      console.error(error);
    }
  };

  const handleReservation = async () => {
    try {
      await axios.post(
        "http://localhost:5000/reservations",
        { bookId: book._id },
        { withCredentials: true }
      );
      toast.success("Book reserved successfully!");
      setIsReserved(true);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to reserve book");
      console.error(error);
    }
  };

  const renderStars = (rating, interactive = false, size = 16) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && setUserRating(star)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          >
            {star <= rating ? (
              <FaStar color="#fbbf24" size={size} />
            ) : (
              <FaRegStar color="#cbd5e0" size={size} />
            )}
          </span>
        ))}
      </div>
    );
  };

  const getStatusBadge = () => {
    if (book.status === "available") {
      return <span className="badge badge-success">Available</span>;
    } else if (book.status === "borrowed") {
      return <span className="badge badge-warning">Borrowed</span>;
    } else {
      return <span className="badge badge-danger">Unavailable</span>;
    }
  };

  return (
    <>
      <div className="enhanced-book-card fade-in">
        <div className="book-card-image">
          <img
            src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
            alt={book.title}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x300?text=No+Cover";
            }}
          />
          <div className="book-card-overlay">
            <div className="book-card-actions">
              {user && (
                <button
                  className="action-btn"
                  onClick={() => setShowRatingModal(true)}
                >
                  Rate Book
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="book-card-content">
          <div className="book-card-header">
            <h3 className="book-title">{book.title}</h3>
            {getStatusBadge()}
          </div>

          <p className="book-authors">
            {book.authors && book.authors.length > 0
              ? book.authors.join(", ")
              : "Unknown Author"}
          </p>

          <div className="book-rating-display">
            {renderStars(averageRating)}
            <span className="rating-text">
              {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"} (
              {totalRatings})
            </span>
          </div>

          {book.genre && book.genre.length > 0 && (
            <div className="book-genres">
              {book.genre.slice(0, 3).map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="book-description">
            {book.shortDescription
              ? book.shortDescription.substring(0, 120) + "..."
              : "No description available"}
          </p>

          <div className="book-meta">
            <span>📖 {book.pageCount} pages</span>
            <span>📅 {book.publishedDate}</span>
          </div>
        </div>
      </div>

      {showRatingModal && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rate "{book.title}"</h2>
            <div className="rating-modal-body">
              <div className="rating-input">
                <label>Your Rating:</label>
                {renderStars(userRating, true, 32)}
              </div>
              <div className="review-input">
                <label>Your Review (optional):</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows="4"
                  maxLength="1000"
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowRatingModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleRatingSubmit}>
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedBookCard;
