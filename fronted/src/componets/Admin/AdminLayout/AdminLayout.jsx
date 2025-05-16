import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import AdminSidebar from "../AdminSideBar/AdminSideBar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <h1>Admin Dashboard</h1>
        </header>

        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
