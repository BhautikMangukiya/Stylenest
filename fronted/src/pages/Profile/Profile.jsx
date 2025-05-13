import React from "react";
import MyOrderPage from "./MyOrderPage/MyOrderPage";
import "./profile.css"

function profile() {
  return (
    <div>
      <div className="profile-page">
        <div className="left-section">
          <div className="profile-info">
            <h2>Profile Information</h2>
            <p>
              <strong>Name:</strong> John Doe
            </p>
            <p>
              <strong>Email:</strong> john.doe@example.com
            </p>
            <button className="Logout-button">Logout</button>
          </div>
        </div>

        <div className="right-section">
            <MyOrderPage />
        </div>
      </div>
    </div>
  );
}

export default profile;
