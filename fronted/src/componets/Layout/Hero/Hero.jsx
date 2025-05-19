import React from "react";
import heroImg from "../../../assets/rabbit-hero.webp";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-wrapper">
        <div className="hero-img-container">
          <img src={heroImg} alt="StyleNest Hero" className="hero-img" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to StyleNest</h1>
          <p className="hero-description">
            Discover a World of Fashion Where Comfort Meets Elegance — Curated
            Collections Designed to Inspire Every Step of Your Style Journey.
          </p>
          <span className="hero-highlight">
            Explore New Arrivals Daily · Enjoy Free Shipping on Your First
            Order · Hassle-Free Returns Within 30 Days
          </span>
          <button className="hero-button">Explore the Collection</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;