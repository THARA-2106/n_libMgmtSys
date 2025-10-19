import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaBook, FaUser, FaTag } from 'react-icons/fa';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ onSearchResults, placeholder = "Search books, authors, genres..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length > 2) {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/search/${value}`);
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 8)); // Limit to 8 suggestions
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + recentSearches.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else {
            const recentIndex = selectedIndex - suggestions.length;
            handleRecentSearchClick(recentSearches[recentIndex]);
          }
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setIsOpen(false);
    setIsLoading(true);

    // Save to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    try {
      const response = await axios.get(`http://localhost:5000/search/${searchQuery}`);
      if (onSearchResults) {
        onSearchResults(response.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (onSearchResults) {
        onSearchResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title || suggestion.name || suggestion);
    handleSearch(suggestion.title || suggestion.name || suggestion);
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getSuggestionIcon = (suggestion) => {
    if (suggestion.title) return <FaBook />;
    if (suggestion.name) return <FaUser />;
    if (suggestion.genre) return <FaTag />;
    return <FaSearch />;
  };

  const getSuggestionText = (suggestion) => {
    if (suggestion.title) return suggestion.title;
    if (suggestion.name) return suggestion.name;
    if (suggestion.genre) return suggestion.genre;
    return suggestion;
  };

  const getSuggestionSubtext = (suggestion) => {
    if (suggestion.author) return `by ${suggestion.author}`;
    if (suggestion.genre) return 'Genre';
    if (suggestion.title) return suggestion.genre || 'Book';
    return '';
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          disabled={isLoading}
        />
        {query && (
          <button
            className="clear-button"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="search-dropdown">
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <div className="section-header">
                <span>Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-icon">
                    {getSuggestionIcon(suggestion)}
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-text">
                      {getSuggestionText(suggestion)}
                    </div>
                    {getSuggestionSubtext(suggestion) && (
                      <div className="suggestion-subtext">
                        {getSuggestionSubtext(suggestion)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="recent-searches-section">
              <div className="section-header">
                <span>Recent Searches</span>
                <button
                  className="clear-recent-btn"
                  onClick={clearRecentSearches}
                  title="Clear recent searches"
                >
                  <FaTimes />
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className={`recent-search-item ${
                    selectedIndex === suggestions.length + index ? 'selected' : ''
                  }`}
                  onClick={() => handleRecentSearchClick(search)}
                >
                  <FaSearch className="recent-search-icon" />
                  <span>{search}</span>
                </div>
              ))}
            </div>
          )}

          {suggestions.length === 0 && recentSearches.length === 0 && (
            <div className="no-results">
              <FaSearch />
              <span>No suggestions available</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;