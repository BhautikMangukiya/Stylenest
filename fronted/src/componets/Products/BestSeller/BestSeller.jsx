import React, { useState } from "react";
import "./BestSeller.css";
import elegantShirt from "../../../assets/BestSeller/PMSX17088-K6_20_283_29.jpg";
import classicPolo from "../../../assets/BestSeller/PRISTO-WHITESFP_1.jpg";
import { toast } from 'sonner';
import { useCart } from "../../../componets/Cart/CartContent";

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
  const { addToCart } = useCart();

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size before adding to cart");
      return;
    }

    const productToAdd = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: selectedProduct.price,
      image: selectedProduct.image,
    };

    addToCart(productToAdd);
    toast.success(`${selectedProduct.name} added to cart!`);

    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };

  return (
    <section className="best-seller-section-v2">
      <div className="best-seller-header-v2">
        <h2 className="best-seller-heading-v2">Best Sellers</h2>
        <p className="best-seller-subtext-v2">
          Discover our top-rated products loved by customers.
        </p>
      </div>

      <div className="best-seller-content-v2">
        <div className="thumbnail-gallery-v2">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className={`thumbnail-item-v2 ${selectedProduct.id === product.id ? "active-v2" : ""}`}
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
                className="thumbnail-image-v2"
              />
            </div>
          ))}
        </div>

        <div className="main-image-container-v2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="main-product-image-v2"
          />
        </div>

        <div className="product-details-v2">
          <h3 className="product-title-v2">{selectedProduct.name}</h3>
          <div className="product-rating-v2">
            <span className="rating-value-v2">{selectedProduct.rating} ★</span>
            <span className="rating-text-v2">
              ({Math.floor(Math.random() * 100) + 50} reviews)
            </span>
          </div>
          <p className="product-price-v2">₹{selectedProduct.price}</p>
          <p className="product-description-v2">{selectedProduct.description}</p>

          <div className="product-options-v2">
            <div className="option-group-v2">
              <label className="option-label-v2">Color:</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="color-select-v2"
              >
                <option value="">Choose a color</option>
                {selectedProduct.colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group-v2">
              <label className="option-label-v2">Size:</label>
              <div className="size-selector-v2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-option-v2 ${selectedSize === size ? "selected-v2" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group-v2">
              <label className="option-label-v2">Quantity:</label>
              <div className="quantity-selector-v2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="quantity-btn-v2"
                >
                  -
                </button>
                <span className="quantity-value-v2">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn-v2"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="add-to-cart-btn-v2" 
            onClick={handleAdd}
          >
            Add to Cart
          </button>

          <div className="product-info-v2">
            <p><strong>Brand:</strong> {selectedProduct.brand}</p>
            <p><strong>Material:</strong> {selectedProduct.material}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
