import React, { useState } from "react";
import { Outlet } from "react-router-dom";


import "./AdminLayout.css";
import AdminSidebar from "../AdminSideBar/AdminSideBar";

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