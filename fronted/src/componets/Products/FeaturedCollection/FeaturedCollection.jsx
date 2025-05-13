import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedCollection.css";
import featuredCollection from "../../../assets/featured.webp"; // Adjust the path as necessary


function FeaturedCollection() {
  return (
    <section>
      <div className="featured-collection">
        {/* left Contenet */}

        <div className="left-content">
          <h4>Comfort in Every Step</h4>

          <h2>Effortless Style for Your Daily Adventures</h2>

          <p>
          Unleash your unique vibe with our handpicked apparel collection, crafted for ultimate comfort and timeless style. Every piece is designed to enhance your everyday look and keep you feeling confident. Dive in and discover your new wardrobe essentials today!
          </p>

          <Link to="/collections/all" className="FeaturedCollection-Button">
            Shop Now
          </Link>
        </div>
        {/* right Content */}

        <div className="right-content">
          <img
            src={featuredCollection}
            alt="featured collection"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
