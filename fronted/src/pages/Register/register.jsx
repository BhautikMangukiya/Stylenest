import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/slices/authSlice";
import registerImage from "../../assets/register.webp";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="left-side">
            <h2 className="heading">Style Nest</h2>
            <h2 className="greeting">Welcome!</h2>
            <p>Join Style Nest and unlock exclusive benefits.</p>

            {error && <p className="error-message" role="alert">{error}</p>}

            <div className="form-group">
              <label htmlFor="name" className="input-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="sign-up-button" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="already-have-account">Already have an account?</p>
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="login-link"
            >
              Login
            </Link>
          </div>

          <div className="right-side">
            <img src={registerImage} alt="Registration visual" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
