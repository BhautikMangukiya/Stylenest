import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlice";
import { mergeCart } from "../../../redux/slices/cartSlice";
import loginImage from "../../assets/login.webp";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart = [] } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      const destination = isCheckoutRedirect ? "/checkout" : redirect;

      if (cart.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(destination);
        });
      } else {
        navigate(destination);
      }
    }
  }, [user, guestId, cart, dispatch, isCheckoutRedirect, navigate, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Both email and password are required.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="left-side-login">
            <h2 className="heading">Style Nest</h2>
            <h2 className="greeting">Hey there!</h2>
            <p>Enter your email and password to login.</p>

            {error && <p className="error-message" role="alert">{error}</p>}

            <div className="input-group-login">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group-login">
              <label htmlFor="password">Password</label>
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

            <button type="submit" className="sign-in" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="dont-have-account">Don't have an account?</p>
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="register"
            >
              Register
            </Link>
          </div>

          <div className="right-side-login">
            <img src={loginImage} alt="Login visual" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
