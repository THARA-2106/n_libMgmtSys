import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Assets/css/home.css";

const FavoriteButton = ({ isbn, favorites, toggleFavorite }) => {
  const isFavorite = favorites.includes(isbn);
  return (
    <button
      onClick={() => toggleFavorite(isbn)}
      style={{
        borderRadius: "1rem",
        padding: "0.4rem 0.8rem",
        border: "1px solid #ccc",
        background: isFavorite ? "#ffd166" : "#f1f1f1",
        cursor: "pointer",
      }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
};

const coverUrl = (isbn, title) => {
  if (isbn) return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-M.jpg?default=false`;
  const seed = encodeURIComponent((title || "book").slice(0, 50));
  return `https://picsum.photos/seed/${seed}/240/340`;
};

const Explore = () => {
  console.log("Explore component rendered"); // Debug log
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("bookwise_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookwise_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (isbn) => {
    setFavorites((prev) =>
      prev.includes(isbn) ? prev.filter((i) => i !== isbn) : [...prev, isbn]
    );
  };

  const fetchBooks = async () => {
    try {
      console.log("Fetching books..."); // Debug log
      const { data } = await axios.get("http://localhost:5000/allBook");
      console.log("Books fetched:", data.books?.length || 0); // Debug log
      setAllBooks(data.books || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err); // Debug log
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("Initializing Explore component..."); // Debug log
      setIsLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/allBook");
        const books = data.books || [];
        console.log("Initial books count:", books.length); // Debug log
        if (books.length === 0) {
          // Try to seed demo data then refetch
          try {
            console.log("Seeding demo data..."); // Debug log
            await axios.post("http://localhost:5000/seed");
          } catch (e) {
            console.log("Seed failed:", e); // Debug log
          }
          await fetchBooks();
        } else {
          setAllBooks(books);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in init:", error); // Debug log
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const genres = useMemo(() => {
    const gset = new Set();
    allBooks.forEach((b) => {
      if (typeof b.Genre === "string" && b.Genre.trim().length > 0) gset.add(b.Genre);
      if (Array.isArray(b.Genre)) b.Genre.forEach((g) => gset.add(g));
    });
    return ["all", ...Array.from(gset).sort()];
  }, [allBooks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allBooks.filter((b) => {
      const inGenre = genreFilter === "all" || b.Genre === genreFilter || (Array.isArray(b.Genre) && b.Genre.includes(genreFilter));
      if (!inGenre) return false;
      if (!q) return true;
      const hay = `${b.Title || ""} ${b.Author || ""} ${b.ISBN || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allBooks, query, genreFilter]);

  const publishFavorites = async () => {
    if (favorites.length === 0) return alert("No favorites to publish yet.");
    const title = prompt("Name your public list:", "My Favorite Books");
    if (!title) return;
    try {
      const { data } = await axios.post("http://localhost:5000/lists/publish", {
        title,
        isbns: favorites,
      });
      const url = `${window.location.origin}/list/${data.slug}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      alert(`Your list is published!\n\n${url}\n\n(Link copied to clipboard)`);
    } catch (e) {
      alert("Failed to publish list. Try again.");
    }
  };

  const buyFavorites = () => {
    if (favorites.length === 0) return alert("Add some favorites first.");
    navigate("/checkout", { state: { isbns: favorites } });
  };

  const buySingle = (isbn) => {
    navigate("/checkout", { state: { isbns: [isbn] } });
  };

  console.log("Rendering Explore with:", { isLoading, allBooksCount: allBooks.length, filteredCount: filtered.length }); // Debug log

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ background: "yellow", padding: "1rem", marginBottom: "1rem" }}>
        <strong>DEBUG: Explore component is rendering!</strong>
        <br />
        <span>Loading: {isLoading ? "Yes" : "No"}</span>
        <br />
        <span>Books count: {allBooks.length}</span>
        <br />
        <span>Filtered count: {filtered.length}</span>
      </div>
      
      <h1>Explore Books</h1>
      
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          type="search"
          placeholder="Search by title, author, or ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid #ddd",
          }}
          aria-label="Search books"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{ padding: "0.6rem 0.9rem", borderRadius: "0.75rem", border: "1px solid #ddd" }}
          aria-label="Filter by genre"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button onClick={publishFavorites} style={{ padding: "0.6rem 0.9rem", borderRadius: "0.75rem", border: "1px solid #ddd", cursor: "pointer" }}>Publish favorites</button>
        <button onClick={buyFavorites} style={{ padding: "0.6rem 0.9rem", borderRadius: "0.75rem", border: "1px solid #ddd", cursor: "pointer" }}>Buy favorites</button>
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: "0.95rem", color: "#666" }}>
        Browse featured books, search across the catalog, and save your favorites (stored locally).
      </div>

      {isLoading ? (
        <div style={{ padding: "3rem", textAlign: "center" }}>Loading books…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center" }}>No books found. Try a different search.</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {filtered.map((b) => (
            <div
              key={b.ISBN}
              style={{
                border: "1px solid #eee",
                borderRadius: "1rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                background: "#fff",
              }}
            >
              <img
                src={coverUrl(b.ISBN, b.Title)}
                alt={b.Title}
                style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: "0.75rem" }}
                onError={(e) => {
                  const seed = encodeURIComponent((b.Title || "book").slice(0, 50));
                  e.currentTarget.src = `https://picsum.photos/seed/${seed}/240/340`;
                }}
              />
              <div style={{ fontWeight: 600 }}>{b.Title}</div>
              <div style={{ fontSize: "0.9rem", color: "#555" }}>{b.Author}</div>
              <div style={{ fontSize: "0.8rem", color: "#777" }}>ISBN: {b.ISBN}</div>
              <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>{b.Genre}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <FavoriteButton isbn={b.ISBN} favorites={favorites} toggleFavorite={toggleFavorite} />
                  <button onClick={() => buySingle(b.ISBN)} style={{ borderRadius: "1rem", padding: "0.4rem 0.8rem", border: "1px solid #ccc", cursor: "pointer", background: "#28a745", color: "white" }}>Buy now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore; 