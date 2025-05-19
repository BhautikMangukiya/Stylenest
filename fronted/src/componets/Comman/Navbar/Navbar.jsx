import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaBagShopping } from "react-icons/fa6";
import SearchBar from "../Searchbar/SearchBar";
import CartDrawer from "../../Layout/CartDrawer/CartDrawer";
import "./Navbar.css";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (drawerOpen) setDrawerOpen(false);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setDrawerOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Mobile Sidebar */}
      <div
        className={`sidebar ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="sidebar-header">
          <span className="sidebar-logo">
            {" "}
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
          <Link
            to="/collections/all"
            className="sidebar-link"
            onClick={closeAll}
          >
            Men
          </Link>
          <Link to="/women" className="sidebar-link" onClick={closeAll}>
            Women
          </Link>
          <Link to="/kids" className="sidebar-link" onClick={closeAll}>
            Kids
          </Link>
          <Link to="/topwear" className="sidebar-link" onClick={closeAll}>
            Top Wear
          </Link>
          <Link to="/bottomwear" className="sidebar-link" onClick={closeAll}>
            Bottom Wear
          </Link>
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
              <span className="cart-count">0</span>
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
              <Link
                to="/collections/all"
                className="nav-link"
                onClick={closeAll}
              >
                Men
              </Link>
              <Link to="/women" className="nav-link" onClick={closeAll}>
                Women
              </Link>
              <Link to="/kids" className="nav-link" onClick={closeAll}>
                Kids
              </Link>
              <Link to="/topwear" className="nav-link" onClick={closeAll}>
                Top Wear
              </Link>
              <Link to="/bottomwear" className="nav-link" onClick={closeAll}>
                Bottom Wear
              </Link>
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
                <span className="cart-count">0</span>
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
