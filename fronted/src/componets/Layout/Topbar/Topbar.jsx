import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { SlSocialInstagram } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <a href="#" className="social-icon">
            <TbBrandMeta />
          </a>
          <a href="#" className="social-icon">
            <SlSocialInstagram />
          </a>
          <a href="#" className="social-icon">
            <FaXTwitter />
          </a>
        </div>

        <div className="topbar-center">
          <span className="shipping-text">
            We ship worldwide - Fast and reliable shipping
          </span>
        </div>

        <div className="topbar-right">
          <a href="tel:+1234567890" className="phone-link">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
