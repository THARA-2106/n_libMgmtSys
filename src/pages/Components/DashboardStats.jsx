import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaShoppingCart, FaChartLine, FaBookOpen, FaStar, FaClock, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './DashboardStats.css';

const DashboardStats = ({ user }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalReservations: 0,
    activeReservations: 0,
    recentActivity: [],
    popularBooks: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple stats in parallel
      const [
        booksResponse,
        usersResponse,
        reservationsResponse,
        activityResponse
      ] = await Promise.allSettled([
        axios.get('http://localhost:5000/allBook'),
        axios.get('http://localhost:5000/allUser'),
        axios.get('http://localhost:5000/reservations/stats', { withCredentials: true }),
        axios.get('http://localhost:5000/notifications', { withCredentials: true })
      ]);

      const statsData = {
        totalBooks: booksResponse.status === 'fulfilled' ? booksResponse.value.data.length : 0,
        totalUsers: usersResponse.status === 'fulfilled' ? usersResponse.value.data.length : 0,
        totalReservations: 0,
        activeReservations: 0,
        recentActivity: [],
        popularBooks: [],
        monthlyStats: []
      };

      if (reservationsResponse.status === 'fulfilled') {
        const reservationStats = reservationsResponse.value.data.stats;
        statsData.totalReservations = reservationStats.total || 0;
        statsData.activeReservations = reservationStats.byStatus?.find(s => s._id === 'pending')?.count || 0;
        statsData.monthlyStats = reservationStats.monthlyStats || [];
        statsData.popularBooks = reservationStats.popularBooks || [];
      }

      if (activityResponse.status === 'fulfilled') {
        statsData.recentActivity = activityResponse.value.data.notifications?.slice(0, 5) || [];
      }

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color, trend }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            <FaChartLine />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle />;
      case 'info': return <FaBookOpen />;
      case 'warning': return <FaClock />;
      default: return <FaBook />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-stats loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <div className="stats-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user?.name || 'User'}!</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<FaBook />}
          title="Total Books"
          value={stats.totalBooks}
          subtitle="Available in library"
          color="blue"
          trend={5.2}
        />
        
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered members"
          color="green"
          trend={12.1}
        />
        
        <StatCard
          icon={<FaShoppingCart />}
          title="Total Reservations"
          value={stats.totalReservations}
          subtitle="All time reservations"
          color="purple"
          trend={8.7}
        />
        
        <StatCard
          icon={<FaClock />}
          title="Pending Reservations"
          value={stats.activeReservations}
          subtitle="Awaiting approval"
          color="orange"
        />
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activity-list">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FaBookOpen />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Books */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Popular Books</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="popular-books">
              {stats.popularBooks.length > 0 ? (
                stats.popularBooks.slice(0, 5).map((book, index) => (
                  <div key={index} className="popular-book-item">
                    <div className="book-rank">#{index + 1}</div>
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>by {book.author}</p>
                      <div className="book-stats">
                        <span className="reservation-count">
                          {book.reservationCount} reservations
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FaStar />
                  <p>No popular books data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Stats Chart */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <h3>Reservation Trends</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <div className="legend-color blue"></div>
                Reservations
              </span>
            </div>
          </div>
          <div className="chart-container">
            {stats.monthlyStats.length > 0 ? (
              <div className="bar-chart">
                {stats.monthlyStats.slice(-6).map((stat, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-label">
                      {new Date(0, stat._id.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar"
                        style={{ 
                          height: `${Math.max((stat.count / Math.max(...stats.monthlyStats.map(s => s.count))) * 100, 10)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{stat.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaChartLine />
                <p>No chart data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;