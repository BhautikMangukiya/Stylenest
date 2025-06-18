import React, { useEffect } from "react";
import MyOrderPage from "./MyOrderPage/MyOrderPage";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/authSlice";
import { clearCart } from "../../../redux/slices/cartSlice";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info-card">
          <h2>User Profile</h2>
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{user?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="profile-content">
        <MyOrderPage />
      </div>
    </div>
  );
}

export default Profile;