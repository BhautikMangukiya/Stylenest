import React from "react";
import "./MenWomen.css";
import MenImg from "../../../assets/men-section.jpg";
import WomenImg from "../../../assets/women-section.jpg";
import KidsImg from "../../../assets/kids-section.jpg"; // Assumed import for kids image
import { useNavigate } from 'react-router-dom';


function MenWomen() {

const navigate = useNavigate()

  return (
    <div className="men-women-section">
      <div className="men-section">
        <div className="men-imag">
          <img src={MenImg} alt="Men" />    
        </div>
        <div className="men-description">
          <h1>men</h1>
          <p>Discover the latest trends in men's fashion.</p>
          <button onClick={() => navigate('/men')}>Shop Now</button>
        </div>
      </div>

      <div className="kids-section">
        <div className="kids-imag">
          <img src={KidsImg} alt="Kids" />
        </div>
        <div className="kids-description">
          <h1>Kids</h1>
          <p>Explore fun and stylish clothing for kids.</p>
          <button onClick={() => navigate('/kids')}>Shop Now</button>
        </div>
      </div>

      <div className="Women-section">
        <div className="Women-imag">
          <img src={WomenImg} alt="Women" />
        </div>
        <div className="Women-description">
          <h1>Women</h1>
          <p>Discover the latest trends in Women's fashion.</p>
          <button onClick={() => navigate('/women')}>Shop Now</button>
        </div>
      </div>
    </div>
  );
}

export default MenWomen;