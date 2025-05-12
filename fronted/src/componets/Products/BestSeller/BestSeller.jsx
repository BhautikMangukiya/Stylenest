import React, { useState } from "react";
import "./BestSeller.css";
import elegantShirt from "../../../assets/BestSeller/PMSX17088-K6_20_283_29.jpg";
import classicPolo from "../../../assets/BestSeller/PRISTO-WHITESFP_1.jpg";
import { toast } from 'sonner';

const mockProducts = [
  {
    id: 1,
    name: "Elegant Shirt",
    price: 999,
    description: "A premium quality cotton shirt perfect for any occasion.",
    image: elegantShirt,
    colorOptions: ["White", "Black", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    brand: "FashionHub",
    material: "100% Cotton",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Classic Polo",
    price: 650,
    description: "Stylish polo made from soft breathable fabric.",
    image: classicPolo,
    colorOptions: ["Navy", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    brand: "UrbanStyle",
    material: "Cotton Blend",
    rating: 4.2,
  },
];

function BestSeller() {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size before adding to cart", {
        position: "top-right",
        duration: 3000,
        className: "mt-9",
      });
      return;
    }
  };

  return (
    <section className="best-seller-section">
      <div className="best-seller-header">
        <h2 className="best-seller-heading">Best Sellers</h2>
        <p className="best-seller-subtext">
          Discover our top-rated products loved by customers.
        </p>
      </div>

      {/* left */}
      <div className="best-seller-content">
        <div className="thumbnail-gallery">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className={`thumbnail-item ${
                selectedProduct.id === product.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedProduct(product);
                setSelectedColor("");
                setSelectedSize("");
                setQuantity(1);
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="thumbnail-image"
              />
            </div>
          ))}
        </div>

        <div className="main-image-container">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="main-product-image"
          />
        </div>

        <div className="product-details">
          <h3 className="product-title">{selectedProduct.name}</h3>
          <div className="product-rating">
            <span className="rating-value">{selectedProduct.rating} ★</span>
            <span className="rating-text">
              ({Math.floor(Math.random() * 100) + 50} reviews)
            </span>
          </div>
          <p className="product-price">₹{selectedProduct.price}</p>
          <p className="product-description">{selectedProduct.description}</p>

          <div className="product-options">
            <div className="option-group">
              <label className="option-label">Color:</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="color-select"
              >
                <option value="">Choose a color</option>
                {selectedProduct.colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label className="option-label">Size:</label>
              <div className="size-selector">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label className="option-label">Quantity:</label>
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAdd}>
            Add to Cart
          </button>

          <div className="product-info">
            <p>
              <strong>Brand:</strong> {selectedProduct.brand}
            </p>
            <p>
              <strong>Material:</strong> {selectedProduct.material}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
