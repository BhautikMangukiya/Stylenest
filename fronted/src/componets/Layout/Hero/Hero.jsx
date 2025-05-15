import React from "react";
import heroImg from "../../../assets/rabbit-hero.webp";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section-v2">
      <div className="hero-wrapper-v2">
        <div className="hero-img-container-v2">
          <img src={heroImg} alt="StyleNest" className="hero-img-v2" />
        </div>

        <div className="hero-content-v2">
          <h1 className="hero-title-v2">Welcome to StyleNest</h1>
          <p className="hero-description-v2">
            Discover a World of Fashion Where Comfort Meets Elegance — Curated
            Collections Designed to Inspire Every Step of Your Style Journey.
          </p>
          <span className="hero-highlight-v2">
            Explore New Arrivals Daily · Enjoy Free Shipping on Your First
            Order · Hassle-Free Returns Within 30 Days
          </span>
          <br />
          <button className="hero-button-v2">Explore the Collection</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
