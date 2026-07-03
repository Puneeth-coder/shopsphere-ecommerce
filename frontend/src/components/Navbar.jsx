import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

import "../styles/navbar.css";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useUser();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Don't render navbar on login and register pages for a clean full-screen look
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const handleLogout = async () => {
    console.log("Logout clicked");
    await logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Shop<span>Sphere</span>
      </Link>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          Home
        </Link>

        <Link 
          to="/cart" 
          className={`nav-item ${location.pathname === "/cart" ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          Cart ({totalItems})
        </Link>

        {user ? (
          <>
            <span className="nav-user-greeting">
              Welcome, {user.name}
            </span>

            {user.role === "admin" && (
              <Link 
                to="/admin" 
                className={`nav-item ${location.pathname.startsWith("/admin") ? "active" : ""}`}
                onClick={handleLinkClick}
              >
                Admin Panel
              </Link>
            )}

            <Link 
              to="/profile" 
              className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-item ${location.pathname === "/login" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              Login
            </Link>

            <Link 
              to="/register" 
              className={`nav-item ${location.pathname === "/register" ? "active" : ""}`}
              onClick={handleLinkClick}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;