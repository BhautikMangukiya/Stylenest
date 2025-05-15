import React from "react";
import "./MenWomen.css";
import MenImg from "../../../assets/men-section.jpg";
import WomenImg from "../../../assets/women-section.jpg";
import KidsImg from "../../../assets/kids-section.jpg";
import { useNavigate } from "react-router-dom";

function MenWomen() {
  const navigate = useNavigate();

  return (
    <div className="category-section-v2">
      {/* Men Section */}
      <div className="category-card-v2">
        <div className="category-img-container-v2">
          <img src={MenImg} alt="Men" className="category-img-v2" />
        </div>
        <div className="category-content-v2">
          <h1 className="category-title-v2">Men</h1>
          <p className="category-desc-v2">
            Discover the latest trends in men's fashion.
          </p>
          <button
            className="category-btn-v2"
            onClick={() => navigate("/men")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Kids Section */}
      <div className="category-card-v2">
        <div className="category-img-container-v2">
          <img src={KidsImg} alt="Kids" className="category-img-v2" />
        </div>
        <div className="category-content-v2">
          <h1 className="category-title-v2">Kids</h1>
          <p className="category-desc-v2">
            Explore fun and stylish clothing for kids.
          </p>
          <button
            className="category-btn-v2"
            onClick={() => navigate("/kids")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Women Section */}
      <div className="category-card-v2">
        <div className="category-img-container-v2">
          <img src={WomenImg} alt="Women" className="category-img-v2" />
        </div>
        <div className="category-content-v2">
          <h1 className="category-title-v2">Women</h1>
          <p className="category-desc-v2">
            Discover the latest trends in women's fashion.
          </p>
          <button
            className="category-btn-v2"
            onClick={() => navigate("/women")}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenWomen;
