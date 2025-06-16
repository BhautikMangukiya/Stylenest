import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import SearchBar from "../Searchbar/SearchBar";
import "./Navbar.css";
import { useSelector } from "react-redux";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const cartItemCount = cart?.products?.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/collections/all", label: "Shop All" },
    { to: "/collections/all?gender=Men", label: "His Style" },
    { to: "/collections/all?gender=Women", label: "Her Style" },
    { to: "/collections/all?category=Top Wear", label: "Tops" },
    { to: "/collections/all?category=Bottom Wear", label: "Bottoms" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="navbar">
      {/* Mobile Hamburger Menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo-link-mobile-menu" onClick={closeMenu}>
            StyleNest
          </Link>
          <button
            className="menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <HiXMark />
          </button>
        </div>
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="navbar-mobile">
        <div className="navbar-mobile-container">
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <HiBars3 />
          </button>
          <div className="logo">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              StyleNest
            </Link>
          </div>
          <div className="mobile-icons">
            <Link
              to="/profile"
              className="profile-icon-mobile"
              aria-label="Profile"
              onClick={closeMenu}
            >
              <HiOutlineUserCircle />
            </Link>
            <button
              onClick={() => {
                closeMenu();
                navigate("/cart");
              }}
              className="cart-button"
              aria-label="Cart"
            >
              <FaBagShopping />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
        <div className="mobile-search">
          <SearchBar />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="navbar-desktop">
        <div className="navbar-container">
          <div className="logo">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              StyleNest
            </Link>
          </div>

          <div className="desktop-nav">
            <div className="nav-links">
              {navLinks
                .filter((link) => link.label !== "Profile")
                .map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className="desktop-actions">
            {user?.role === "admin" && (
              <Link to="/admin" className="admin-link" onClick={closeMenu}>
                Admin
              </Link>
            )}

            <SearchBar />
            <div className="action-icons">
              <Link to="/profile" className="profile-icon" aria-label="Profile">
                <HiOutlineUserCircle />
              </Link>

              <button
                onClick={() => {
                  closeMenu();
                  navigate("/cart");
                }}
                className="cart-button"
                aria-label="Cart"
              >
                <FaBagShopping />
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
