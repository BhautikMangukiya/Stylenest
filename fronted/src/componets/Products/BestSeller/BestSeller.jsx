import React, { useEffect, useState } from "react";
import "./BestSeller.css";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../../redux/slices/cartSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function BestSeller() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products?bestSeller=true`);
        const bestSellers = data.slice(0, 4);
        setProducts(bestSellers);
        if (bestSellers.length > 0) {
          setSelectedProduct(bestSellers[0]);
          setSelectedColor("");
          setSelectedSize("");
          setQuantity(1);
        }
      } catch {
        toast.error("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleThumbnailClick = (product) => {
    if (!selectedProduct || selectedProduct._id !== product._id) {
      setSelectedProduct(product);
      setSelectedColor("");
      setSelectedSize("");
      setQuantity(1);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size before adding to cart");
      return;
    }

    dispatch(
      addToCart({
        productId: selectedProduct._id,
        name: selectedProduct.name,
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: selectedProduct.price,
        image: selectedProduct.images?.[0]?.url || "",
        userId: user ? user._id : null,
      })
    );

    toast.success(`${selectedProduct.name} added to cart!`);
  };

  if (loading) {
    return <div className="best-seller-section-v2">Loading best sellers...</div>;
  }

  if (!selectedProduct) {
    return (
      <div className="best-seller-section-v2">
        <h2>No best sellers available</h2>
      </div>
    );
  }

  const productColors = selectedProduct.colors || [];
  const productSizes = selectedProduct.sizes || [];
  const productImage = selectedProduct.images?.[0]?.url || "";

  return (
    <div className="best-seller-section-wrap">
      <section className="best-seller-section-v2">
        <div className="best-seller-header-v2">
          <h2 className="best-seller-heading-v2">Best Sellers</h2>
          <p className="best-seller-subtext-v2">
            Discover our top-rated products loved by customers.
          </p>
        </div>

        <div className="best-seller-content-v2">
          {/* Gallery */}
          <div className="thumbnail-gallery-v2">
            {products.map((product) => (
              <div
                key={product._id}
                className={`thumbnail-item-v2 ${selectedProduct._id === product._id ? "active-v2" : ""}`}
                onClick={() => handleThumbnailClick(product)}
                tabIndex={0}
                role="button"
                aria-label={`Show ${product.name}`}
                onKeyPress={(e) => e.key === "Enter" && handleThumbnailClick(product)}
              >
                <img
                  src={product.images?.[0]?.url || ""}
                  alt={product.name}
                  className="thumbnail-image-v2"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="main-image-container-v2">
            <img
              src={productImage}
              alt={selectedProduct.name}
              className="main-product-image-v2"
            />
          </div>

          {/* Product Details */}
          <div className="product-details-v2">
            <h3 className="product-title-v2">{selectedProduct.name}</h3>
            <p className="product-price-v2">₹{selectedProduct.price}</p>

            <div className="product-rating-v2">
              <span className="rating-value-v2">
                {selectedProduct.rating || 4.2} ★
              </span>
              <span className="rating-text-v2">
                ({selectedProduct.numReviews ?? Math.floor(Math.random() * 100 + 50)} reviews)
              </span>
            </div>

            <p className="product-description-v2">{selectedProduct.description}</p>

            {/* Options */}
            <div className="product-options-v2">
              {/* Color Select */}
              <div className="option-group-v2">
                <label className="option-label-v2" htmlFor="color-select">Color:</label>
                <select
                  id="color-select"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="color-select-v2"
                >
                  <option value="">Choose a color</option>
                  {productColors.length > 0 ? (
                    productColors.map((color, idx) => (
                      <option key={`${color}-${idx}`} value={color}>
                        {color}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No colors available
                    </option>
                  )}
                </select>
              </div>

              {/* Size Buttons */}
              <div className="option-group-v2">
                <label className="option-label-v2">Size:</label>
                <div className="size-selector-v2">
                  {productSizes.length > 0 ? (
                    productSizes.map((size, idx) => (
                      <button
                        key={`${size}-${idx}`}
                        type="button"
                        className={`size-option-v2 ${selectedSize === size ? "selected-v2" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <span>No sizes available</span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="option-group-v2">
                <label className="option-label-v2">Quantity:</label>
                <div className="quantity-selector-v2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="quantity-btn-v2"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-value-v2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="quantity-btn-v2"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              className="add-to-cart-btn-v2"
              onClick={handleAdd}
              disabled={!selectedColor || !selectedSize}
            >
              Add to Cart
            </button>

            {/* Additional Info */}
            <div className="product-info-v2">
              <p><strong>Brand:</strong> {selectedProduct.brand || "N/A"}</p>
              <p><strong>Material:</strong> {selectedProduct.material || "N/A"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BestSeller;
