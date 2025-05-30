import React, { use } from "react";
import { useState } from "react";
import loginImage from "../../assets/login.webp";
import { Link } from "react-router-dom";
import "./login.css";
import { loginUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="left-side">
            <h2 className="headding">Style Nest</h2>

            <h2 className="hey">Hey there!</h2>

            <p>Enter your Email and password to login..</p>
            <div className="username-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password-input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="sign-in">
              Sign In
            </button>
            <p>Don't have an account ? </p>
            <Link to="/register" className="register">
              Register
            </Link>
          </div>

          <div className="right-side">
            <img src={loginImage} alt="login" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default login;
