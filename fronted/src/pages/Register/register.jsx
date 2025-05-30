import React, { useState } from "react";
import { Link } from "react-router-dom";
import registerImage from "../../assets/register.webp"; // Assumed image path
import "./Register.css";
import { registerUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="left-side">
            <h2 className="headding">Style Nest</h2>
            <h2 className="hey">Hey there!</h2>
            <p>Enter your details to join the Style Nest community.</p>
            <div className="name-input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="email-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>
            <button
              type="submit"
              aria-label="Sign up"
              className="Sign-up-button"
            >
              Sign Up
            </button>
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
          <div className="right-side">
            <img src={registerImage} alt="Register illustration" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
