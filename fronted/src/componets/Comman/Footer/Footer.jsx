import React from "react";
import { FaRegCopyright } from "react-icons/fa";
import "./Footer.css";
import { SlSocialInstagram } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { CiFacebook } from "react-icons/ci";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        <div className="footer-column">
          <h2>Newsletter</h2>
          <p>
            Be the first to hear about new products, <br /> exclusive events,
            and online offers.
          </p>
          <p>Sign up and get 10% off your first order!</p>
          <div className="subscribe">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <ul>
            <li>
              <a href="#">Men</a>
            </li>
            <li>
              <a href="#">Women</a>
            </li>
            <li>
              <a href="#">Kids</a>
            </li>
            <li>
              <a href="#">Sale</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Returns</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <div className="social">
            <h3>Follow Us</h3>
            <ul className="social-links">
              <li>
                <a href="#">
                  <SlSocialInstagram />
                </a>
              </li>
              <li>
                <a href="#">
                  <FaXTwitter />
                </a>
              </li>
              <li>
                <a href="#">
                  <CiFacebook />
                </a>
              </li>
            </ul>
          </div>

          <div className="call">
            <h3>Call Us</h3>
            <p>+1 (234) 567-890</p>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>
          &copy; 2025 Style Nest. All Rights Reserved. Designed & Developed by
          Style Nest Team.
        </p>
      </div>
    </div>
  );
}

export default Footer;
