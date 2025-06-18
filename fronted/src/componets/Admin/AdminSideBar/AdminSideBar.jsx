import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBoxOpen, FaClipboardList, FaStore, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "./AdminSidebar.css";



function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const navLinks = [
    { to: "/admin/users", icon: <FaUser />, label: "Users" },
    { to: "/admin/products", icon: <FaBoxOpen />, label: "Products" },
    { to: "/admin/orders", icon: <FaClipboardList />, label: "Orders" },
    { to: "/", icon: <FaStore />, label: "Shop" },
  ];


  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin"><h2>Style Nest</h2></Link>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <nav className="admin-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "admin-link active" : "admin-link"
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
}

export default AdminSidebar;