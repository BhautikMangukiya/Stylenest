import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProtectedAdmin.css";

const ProtectedAdminRoute = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="protected-admin-route">
        <div className="access-denied" role="alert">
          🚫 Access Denied: You do not have permission to view this page.
        </div>
        <div className="shop-button">
          <button onClick={() => navigate("/")} className="go-home-button">
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
