import React, { useState } from "react";
import { TbBrandMeta } from "react-icons/tb";
import { SlSocialInstagram } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import "./Topbar.css";

function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="topbar">
      {/* Mobile Topbar - Only visible on mobile */}
      <div className="topbar-mobile">
        <div className="topbar-mobile-container">
          <span className="mobile-logo">StyleNest</span>
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
        </div>
        
        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-dropdown">
            <div className="mobile-menu-content">
              <a href="#" className="social-icon">
                <TbBrandMeta />
              </a>
              <a href="#" className="social-icon">
                <SlSocialInstagram />
              </a>
              <a href="#" className="social-icon">
                <FaXTwitter />
              </a>
              <a href="tel:+1234567890" className="phone-link">
                +1 (234) 567-890
              </a>
              <p className="shipping-text">
                We ship worldwide - Fast and reliable shipping
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Topbar - Only visible on desktop */}
      <div className="topbar-desktop">
        <div className="topbar-container">
          <div className="topbar-left">
            <a href="#" className="social-icon" aria-label="Meta">
              <TbBrandMeta />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <SlSocialInstagram />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
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
    </div>
  );
}

export default Topbar;