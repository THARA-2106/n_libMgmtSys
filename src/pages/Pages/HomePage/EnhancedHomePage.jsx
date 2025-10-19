import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Assets/css/home.css";
import SearchBar from "../../Components/SearchBar";
import EnhancedBookCard from "../../Components/EnhancedBookCard";
import DashboardStats from "../../Components/DashboardStats";
import Footer from "../../Components/Footer";

const EnhancedHomePage = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/allBook");
      const booksArray = Array.isArray(data) ? data : [];
      setBooks(booksArray);
      setFilteredBooks(booksArray);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredBooks(Array.isArray(books) ? books : []);
      return;
    }

    const booksArray = Array.isArray(books) ? books : [];
    const filtered = booksArray.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (filters) => {
    const booksArray = Array.isArray(books) ? books : [];
    let filtered = [...booksArray];

    // Filter by genre
    if (filters.genre) {
      filtered = filtered.filter((book) =>
        book.genre?.some((g) =>
          g.toLowerCase().includes(filters.genre.toLowerCase())
        )
      );
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter((book) =>
        book.publishedDate?.includes(filters.year)
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((book) => book.status === filters.status);
    }

    // Sort books
    switch (filters.sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "year-new":
        filtered.sort((a, b) => {
          const yearA = parseInt(a.publishedDate?.match(/\d{4}/)?.[0] || 0);
          const yearB = parseInt(b.publishedDate?.match(/\d{4}/)?.[0] || 0);
          return yearB - yearA;
        });
        break;
      case "year-old":
        filtered.sort((a, b) => {
          const yearA = parseInt(a.publishedDate?.match(/\d{4}/)?.[0] || 0);
          const yearB = parseInt(b.publishedDate?.match(/\d{4}/)?.[0] || 0);
          return yearA - yearB;
        });
        break;
      default:
        break;
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = Array.isArray(filteredBooks) ? filteredBooks.slice(indexOfFirstBook, indexOfLastBook) : [];
  const totalPages = Array.isArray(filteredBooks) ? Math.ceil(filteredBooks.length / booksPerPage) : 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const bgStyle = {
    background: "var(--bg)",
    minHeight: "100vh",
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-home-page" style={bgStyle}>
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section fade-in">
          <div className="hero-content">
            <h1 className="text-gradient">Welcome to bookWise</h1>
            <p>Discover your next great read from our extensive collection</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats user={user} />

        {/* Search and Filter */}
        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

        {/* Books Grid */}
        <div className="books-section">
          <div className="section-header">
            <h2>Browse Books</h2>
            <span className="book-count">
              {Array.isArray(filteredBooks) ? filteredBooks.length : 0} {Array.isArray(filteredBooks) && filteredBooks.length === 1 ? "book" : "books"} found
            </span>
          </div>

          {currentBooks.length === 0 ? (
            <div className="empty-state">
              <p>No books found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="books-grid">
                {currentBooks.map((book) => (
                  <EnhancedBookCard
                    key={book._id}
                    book={book}
                    user={user}
                    onAction={fetchBooks}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`pagination-number ${
                              currentPage === pageNumber ? "active" : ""
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EnhancedHomePage;
