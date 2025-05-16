import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../AdminSidebar/AdminSidebar";
import "./AdminLayout.css";
// import AdminNavbar from "../AdminNavbar/AdminNavbar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* <AdminNavbar /> */}
      <div className="admin-content">
        <main className="admin-main">
          <Outlet />
        </main>
        <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
    </div>
  );
}

export default AdminLayout;