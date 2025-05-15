import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedCollection.css";
import featuredImage from "../../../assets/featured.webp";

function FeaturedCollection() {
  return (
    <section className="featured-section">
      <div className="featured-container">
        {/* Left Text Section */}
        <div className="featured-text">
          <h4 className="featured-subtitle">Comfort in Every Step</h4>
          <h2 className="featured-title">
            Effortless Style for Your Daily Adventures
          </h2>
          <p className="featured-description">
            Unleash your unique vibe with our handpicked apparel collection,
            crafted for ultimate comfort and timeless style. Every piece is
            designed to enhance your everyday look and keep you feeling
            confident. Dive in and discover your new wardrobe essentials today!
          </p>
          <Link to="/collections/all" className="featured-button">
            Shop Now
          </Link>
        </div>

        {/* Right Image Section */}
        <div className="featured-image-wrapper">
          <img
            src={featuredImage}
            alt="Featured Collection"
            className="featured-image"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
