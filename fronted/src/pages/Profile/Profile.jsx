import React, { useEffect } from "react";
import MyOrderPage from "./MyOrderPage/MyOrderPage";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/authSlice";
import { clearCart } from "../../../redux/slices/cartSlice";

function Profile() {

  const {user} = useSelector((state) => state.auth)

   const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user){
      navigate("/login")
    }
  }, [user, navigate])

  const handalLogout = () => {
    dispatch(logout())
    dispatch(clearCart)
    navigate("/login")
  }

  return (
    <div className="user-profile-wrap">
      <div className="user-profile-container">
        <div className="user-profile-left">
          <div className="user-profile-info">
            <h2>User Details</h2>
            <div className="p-wrap-myorderpage">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            </div>
            <button onClick={handalLogout} className="btn-logout" >Logout</button>
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
