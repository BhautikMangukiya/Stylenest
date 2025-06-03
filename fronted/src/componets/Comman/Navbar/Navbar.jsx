import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import SearchBar from "../Searchbar/SearchBar";
import CartDrawer from "../../Layout/CartDrawer/CartDrawer";
import "./Navbar.css";
import { useSelector } from "react-redux";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart?.products?.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (drawerOpen) setDrawerOpen(false);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  // Navigation links array for reusability
  const navLinks = [
    { to: "/collections/all", label: "Shop All" },
    { to: "/collections/all?gender=Men", label: "His Style" },
    { to: "/collections/all?gender=Women", label: "Her Style" },
    { to: "/collections/all?category=Top Wear", label: "Tops" },
    { to: "/collections/all?category=Bottom Wear", label: "Bottoms" },
  ];

  return (
    <nav className="navbar">
      {/* Mobile Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="sidebar-header">
          <span className="sidebar-logo">
            <Link to="/" className="logo-link" onClick={closeAll}>
              StyleNest
            </Link>
          </span>
          <button
            className="sidebar-close"
            onClick={closeAll}
            aria-label="Close menu"
          >
            <HiXMark />
          </button>
        </div>
        <div className="sidebar-links">
          <Link to="/profile" className="sidebar-link" onClick={closeAll}>
            <HiOutlineUserCircle className="sidebar-profile-icon" />
            My Profile
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="sidebar-link"
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeAll}
        aria-hidden={!menuOpen}
      />

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
            <Link to="/" className="logo-link" onClick={closeAll}>
              StyleNest
            </Link>
          </div>
          <div className="mobile-icons">
            <Link
              to="/profile"
              className="profile-icon-mobile"
              aria-label="Profile"
            >
              <HiOutlineUserCircle />
            </Link>
            <button
              onClick={toggleCartDrawer}
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
            <Link to="/" className="logo-link" onClick={closeAll}>
              StyleNest
            </Link>
          </div>

          <div className="desktop-nav">
            <div className="nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="nav-link"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="desktop-actions">
            <SearchBar />
            <div className="action-icons">
              <Link to="/profile" className="profile-icon" aria-label="Profile">
                <HiOutlineUserCircle />
              </Link>
              <Link to="/admin" className="admin-link" onClick={closeAll}>
                Admin
              </Link>
              <button
                onClick={toggleCartDrawer}
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

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </nav>
  );
}

export default Navbar;
