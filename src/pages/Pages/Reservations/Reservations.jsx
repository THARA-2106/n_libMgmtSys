import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendar, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../Assets/css/reservations.css";

const Reservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const endpoint = user.userType === "admin" 
        ? "http://localhost:5000/reservations/all"
        : "http://localhost:5000/reservations/user";
      
      const { data } = await axios.get(endpoint, { withCredentials: true });
      setReservations(data.reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      await axios.put(
        `http://localhost:5000/reservations/${reservationId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success("Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      toast.error("Failed to cancel reservation");
      console.error(error);
    }
  };

  const updateStatus = async (reservationId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/reservations/${reservationId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success("Reservation status updated");
      fetchReservations();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "var(--warning)", text: "Pending", icon: FaClock },
      active: { color: "var(--primary)", text: "Active", icon: FaCheckCircle },
      fulfilled: { color: "var(--success)", text: "Fulfilled", icon: FaCheckCircle },
      cancelled: { color: "var(--danger)", text: "Cancelled", icon: FaTimesCircle },
      expired: { color: "var(--muted)", text: "Expired", icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className="status-badge" style={{ background: config.color }}>
        <Icon size={12} /> {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const filteredReservations = reservations.filter((res) => {
    if (filter === "all") return true;
    return res.status === filter;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h1>My Reservations</h1>
        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "fulfilled" ? "active" : ""}
            onClick={() => setFilter("fulfilled")}
          >
            Fulfilled
          </button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {filteredReservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card fade-in">
              <div className="reservation-header">
                <h3>{reservation.bookTitle}</h3>
                {getStatusBadge(reservation.status)}
              </div>

              <div className="reservation-details">
                {user.userType === "admin" && (
                  <div className="detail-row">
                    <span className="label">User:</span>
                    <span className="value">{reservation.userName}</span>
                  </div>
                )}
                <div className="detail-row">
                  <FaCalendar color="var(--primary)" />
                  <span className="label">Reserved:</span>
                  <span className="value">{formatDate(reservation.reservationDate)}</span>
                </div>
                <div className="detail-row">
                  <FaClock color="var(--warning)" />
                  <span className="label">Expires:</span>
                  <span className="value">
                    {formatDate(reservation.expiryDate)}
                    {reservation.status === "pending" && (
                      <span className="days-remaining">
                        ({getDaysRemaining(reservation.expiryDate)} days left)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="reservation-actions">
                {user.userType === "admin" ? (
                  <>
                    {reservation.status === "pending" && (
                      <>
                        <button
                          className="btn-primary"
                          onClick={() => updateStatus(reservation._id, "active")}
                        >
                          Activate
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => updateStatus(reservation._id, "fulfilled")}
                        >
                          Fulfill
                        </button>
                      </>
                    )}
                    {reservation.status === "active" && (
                      <button
                        className="btn-primary"
                        onClick={() => updateStatus(reservation._id, "fulfilled")}
                      >
                        Mark as Fulfilled
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {(reservation.status === "pending" || reservation.status === "active") && (
                      <button
                        className="btn-danger"
                        onClick={() => cancelReservation(reservation._id)}
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
