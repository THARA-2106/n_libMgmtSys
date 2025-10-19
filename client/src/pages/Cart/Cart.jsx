import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../Assets/css/cart.css";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/getCart?username=${user.username}`,
        { withCredentials: true }
      );
      setCartItems(data.books || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:5000/removeFromCart",
        {
          username: user.username,
          bookId: bookId,
        },
        { withCredentials: true }
      );
      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/checkout",
        { username: user.username },
        { withCredentials: true }
      );
      toast.success("Purchase successful! Your books have been added to your library.");
      setCartItems([]);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.response?.data?.msg || "Failed to complete purchase");
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!user) {
    return <div>Please log in to view your cart.</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img 
                  src={item.coverImage || "/placeholder-cover.jpg"} 
                  alt={item.title} 
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>by {item.author}</p>
                  <p>ISBN: {item.isbn}</p>
                  <button 
                    onClick={() => handleRemoveItem(item._id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleCheckout}
            className="checkout-button"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
