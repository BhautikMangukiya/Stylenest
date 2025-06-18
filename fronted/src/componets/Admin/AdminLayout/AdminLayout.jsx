import React, { useState } from "react";
import { Outlet } from "react-router-dom";


import "./AdminLayout.css";
import AdminSidebarmobile from "../AdminSideBar/AdminSidebarmobile";


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
        <AdminSidebarmobile isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
    </div>
  );
}

export default AdminLayout;