import React from "react";
import heroImg from "../../../assets/rabbit-hero.webp";
import "./Hero.css";


function Hero() {
  return (
    <>
      <section>
        <div className="hero-container">
          <div className="hero-image">
            <img src={heroImg} alt="StyleNest" className="hero-image" />
          </div>

          <div className="hero-text">
            <h1>Welcome to StyleNest</h1>
            <p>
              Discover a World of Fashion Where Comfort Meets Elegance — Curated
              Collections Designed to Inspire Every Step of Your Style Journey.
            </p>
            <span>
              Explore New Arrivals Daily · Enjoy Free Shipping on Your First
              Order · Hassle-Free Returns Within 30 Days
            </span>
            <br />
            <button>Explore the Collection</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
