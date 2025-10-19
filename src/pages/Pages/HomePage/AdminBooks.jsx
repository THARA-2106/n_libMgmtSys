import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const emptyForm = {
  BibNum: "",
  Title: "",
  Author: "",
  ISBN: "",
  Publisher: "",
  Genre: "",
  ItemCount: "1",
};

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editIsbn, setEditIsbn] = useState("");
  const [query, setQuery] = useState("");

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/allBook");
      setBooks(data.books || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setEditIsbn("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        BibNum: form.BibNum?.trim(),
        Title: form.Title?.trim(),
        Author: form.Author?.trim(),
        ISBN: form.ISBN?.trim(),
        Publisher: form.Publisher?.trim(),
        Genre: form.Genre?.trim(),
        ItemCount: String(form.ItemCount || "1"),
      };
      if (!payload.Title || !payload.ISBN) return alert("Title and ISBN are required");
      await axios.post("http://localhost:5000/addBook", payload);
      await loadBooks();
      resetForm();
    } catch (e) {
      alert(e?.response?.data?.msg || "Failed to add book");
    }
  };

  const onEdit = (b) => {
    setIsEditing(true);
    setEditIsbn(b.ISBN);
    setForm({
      BibNum: b.BibNum || "",
      Title: b.Title || "",
      Author: b.Author || "",
      ISBN: b.ISBN || "",
      Publisher: b.Publisher || "",
      Genre: Array.isArray(b.Genre) ? b.Genre.join(", ") : (b.Genre || ""),
      ItemCount: String(b.ItemCount ?? "1"),
    });
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    if (!editIsbn) return;
    try {
      const updates = {
        Title: form.Title?.trim(),
        Author: form.Author?.trim(),
        Publisher: form.Publisher?.trim(),
        Genre: form.Genre?.trim(),
        ItemCount: form.ItemCount,
        BibNum: form.BibNum?.trim(),
      };
      await axios.put(`http://localhost:5000/book/${encodeURIComponent(editIsbn)}`, updates);
      await loadBooks();
      resetForm();
    } catch (e) {
      alert(e?.response?.data?.msg || "Failed to update book");
    }
  };

  const onDelete = async (isbn) => {
    if (!window.confirm(`Delete book ${isbn}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/book/${encodeURIComponent(isbn)}`);
      await loadBooks();
    } catch (e) {
      alert(e?.response?.data?.msg || "Failed to delete book");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) => {
      const hay = `${b.Title || ""} ${b.Author || ""} ${b.ISBN || ""} ${b.Genre || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [books, query]);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Manage Books</h2>
        <input
          type="search"
          placeholder="Search Title/Author/ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <form onSubmit={isEditing ? onUpdate : onAdd} style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <input name="Title" value={form.Title} onChange={onChange} placeholder="Title*" />
        <input name="Author" value={form.Author} onChange={onChange} placeholder="Author" />
        <input name="ISBN" value={form.ISBN} onChange={onChange} placeholder="ISBN*" disabled={isEditing} />
        <input name="Publisher" value={form.Publisher} onChange={onChange} placeholder="Publisher" />
        <input name="Genre" value={form.Genre} onChange={onChange} placeholder="Genre" />
        <input name="ItemCount" type="number" min="0" value={form.ItemCount} onChange={onChange} placeholder="ItemCount" />
        <input name="BibNum" value={form.BibNum} onChange={onChange} placeholder="BibNum" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" className="land-button" style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}>
            <span className="landing-button-hover">{isEditing ? "Update" : "Add"} Book</span>
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ padding: "0.4rem 0.8rem", cursor: "pointer" }}>Cancel</button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead style={{ backgroundColor: "#3d5a80", color: "white" }}>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>ItemCount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.ISBN}>
                  <td>{b.Title}</td>
                  <td>{b.Author}</td>
                  <td>{b.ISBN}</td>
                  <td>{Array.isArray(b.Genre) ? b.Genre.join(", ") : b.Genre}</td>
                  <td>{b.ItemCount}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onEdit(b)} style={{ padding: "0.25rem 0.6rem", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => onDelete(b.ISBN)} style={{ padding: "0.25rem 0.6rem", cursor: "pointer", color: "#b91c1c" }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>No books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
