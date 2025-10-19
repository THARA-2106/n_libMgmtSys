import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD"
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      try {
        const isbns = location.state?.isbns || [];
        if (isbns.length === 0) {
          alert("No books selected for purchase");
          navigate("/explore");
          return;
        }

        // Fetch book details
        const booksResponse = await axios.get("http://localhost:5000/allBook");
        const allBooks = booksResponse.data.books || [];
        const selectedBooks = allBooks.filter(book => isbns.includes(book.ISBN));
        setBooks(selectedBooks);

        // Fetch pricing
        const pricingResponse = await axios.post("http://localhost:5000/pricing", { isbns });
        setPrices(pricingResponse.data.prices || []);
      } catch (error) {
        console.error("Error loading checkout data:", error);
        alert("Failed to load checkout data");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return prices.reduce((sum, price) => sum + price.price, 0);
  };

  const handlePlaceOrder = async () => {
    // Validate form
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setPlacing(true);
    try {
      const isbns = books.map(book => book.ISBN);
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      
      const orderResponse = await axios.post("http://localhost:5000/order", {
        username: "guest",
        isbns,
        shippingAddress,
        paymentMethod: formData.paymentMethod
      });

      alert(`Order placed successfully!\n\nOrder ID: ${orderResponse.data.orderId}\nTotal Amount: ₹${orderResponse.data.totalAmount}\n\nThank you for your purchase!`);
      navigate("/explore");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Loading checkout details...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, color: "#333" }}>Checkout</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>Complete your purchase</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Order Summary */}
        <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "1rem" }}>
          <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>Order Summary</h2>
          {books.map((book, index) => {
            const price = prices.find(p => p.isbn === book.ISBN);
            return (
              <div key={book.ISBN} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "1rem 0",
                borderBottom: index < books.length - 1 ? "1px solid #dee2e6" : "none"
              }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{book.Title}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>{book.Author}</div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>ISBN: {book.ISBN}</div>
                </div>
                <div style={{ fontWeight: "600", color: "#28a745" }}>
                  ₹{price?.price || 0}
                </div>
              </div>
            );
          })}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "1rem 0",
            borderTop: "2px solid #dee2e6",
            marginTop: "1rem"
          }}>
            <div style={{ fontWeight: "700", fontSize: "1.2rem" }}>Total</div>
            <div style={{ fontWeight: "700", fontSize: "1.2rem", color: "#28a745" }}>
              ₹{calculateTotal()}
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "1rem" }}>
          <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>Shipping Information</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                  minHeight: "80px",
                  resize: "vertical"
                }}
                placeholder="Enter your complete address"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ddd",
                    fontSize: "1rem"
                  }}
                  placeholder="City"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ddd",
                    fontSize: "1rem"
                  }}
                  placeholder="State"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
                placeholder="Enter pincode"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #ddd",
                  fontSize: "1rem"
                }}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          style={{
            background: "#28a745",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: placing ? "not-allowed" : "pointer",
            opacity: placing ? 0.7 : 1
          }}
        >
          {placing ? "Placing Order..." : `Place Order - ₹${calculateTotal()}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
