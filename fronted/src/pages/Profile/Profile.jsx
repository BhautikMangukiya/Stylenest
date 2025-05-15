import React from "react";
import MyOrderPage from "./MyOrderPage/MyOrderPage";
import "./profile.css";

function Profile() {
  return (
    <div>
      <div className="user-profile-container">
        <div className="user-profile-left">
          <div className="user-profile-info">
            <h2>User Details</h2>
            <p>
              <strong>Name:</strong> John Doe
            </p>
            <p>
              <strong>Email:</strong> john.doe@example.com
            </p>
            <button className="btn-logout">Logout</button>
          </div>
        </div>

        <div className="user-profile-right">
          <MyOrderPage />
        </div>
      </div>
    </div>
  );
}

export default Profile;
