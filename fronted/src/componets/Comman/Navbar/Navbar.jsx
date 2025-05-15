import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FaBagShopping } from "react-icons/fa6";
import { useState } from "react";
import "./Navbar.css";
import SearchBar from "../Searchbar/SearchBar";
import CartDrawer from "../../Layout/CartDrawer/CartDrawer";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <div className="navbar-container">
        {/* Left - Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            Style Nest
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="nav-links">
          <Link to="/collections/all" className="men">
            Men
          </Link>
          <Link to="/women" className="women">
            Women
          </Link>
          <Link to="/kids" className="women">
            Kids
          </Link>
          <Link to="/topwear" className="topwear">
            Top Wear
          </Link>
          <Link to="/bottomwear" className="bottomwear">
            Bottom Wear
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="icons">

          <Link to="/admin">
            <button>Admin</button>
          </Link>

          {/* Search */}
          <SearchBar />
          {/* <button className="profile-icon">
            <HiBars3BottomRight className="icon" />
          </button> */}

          <Link to="/profile" className="profile-icon">
            <HiOutlineUserCircle className="nav-icons" />
          </Link>

          <button onClick={toggleCartDrawer} className="cart-button">
            <FaBagShopping className="nav-icons" />
            <span className="cart-count">*</span>
          </button>
        </div>
      </div>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
}

export default Navbar;
