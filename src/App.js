import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import HomePage from "./pages/Pages/HomePage/HomePage"
import SignIn from "./pages/LoginSingup/SignInSimple.jsx";
import SignUp from "./pages/LoginSingup/SignUp.jsx";
import Profile from "./pages/Pages/Profile/Profile";
import { useEffect, useState } from "react";
import Navbar from "./pages/Components/Navbar";
import LandingPage from "./pages/Pages/LandingPageSimple";
import Cart from "./pages/Pages/Cart/Cart";
import EditProfile from "./pages/Pages/Profile/EditProfile"
import Borrower from "./pages/Pages/Cart/Borrower";
import Explore from "./pages/Pages/Explore/Explore";
import PublicList from "./pages/Pages/Explore/PublicList";
import Checkout from "./pages/Pages/Checkout/Checkout";
import Reservations from "./pages/Pages/Reservations/Reservations";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for logged-in user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <Router>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        {!isLoading && (
          <Routes>
            <Route
              exact
              path="/"
              element={user ? <Navigate to="/home" /> : <LandingPage />}
            />
            <Route
              exact
              path="/home"
              element={user ? <HomePage user={user} /> : <SignIn />}
            />
            <Route exact path="/explore" element={<Explore />} />
            <Route exact path="/list/:slug" element={<PublicList />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route
              exact
              path="/signup"
              element={user ? <Navigate to="/home" /> : <SignUp />}
            />
            <Route
              exact
              path="/signin"
              element={user ? <Navigate to="/home" /> : <SignIn onLogin={handleLogin} />}
            />
            <Route
              exact
              path="/cart"
              element={user ? <Cart user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/edit/:id"
              element={user ? <EditProfile user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/borrower"
              element={user ? <Borrower user={user} /> : <Navigate to="/home" />}
            />
            <Route
              exact
              path="/reservations"
              element={user ? <Reservations user={user} /> : <Navigate to="/home" />}
            />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
