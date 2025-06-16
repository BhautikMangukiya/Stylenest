import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { toast } from "sonner";
import axios from "axios";
import "./SelectedProduct.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function SelectedProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        if (data.images?.length > 0) {
          setMainImage(data.images[0].url); // default to first image
        }
      } catch {
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size.");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: product.price,
        image: mainImage,
        userId: user ? user._id : null,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (loading) return <div className="selected-product">Loading...</div>;
  if (!product)
    return <div className="selected-product">Product not found.</div>;

  const {
    name,
    price,
    discountPrice,
    description,
    brand,
    material,
    rating,
    numReviews,
    images,
    colors,
    sizes,
  } = product;

  return (
    <div className="selected-product">
      <div className="product-wrapper">
        <div className="image-preview-container">
          <div className="thumbnail-images-vertical">
            {images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(img.url)}
                className={`thumbnail-img-vertical ${
                  mainImage === img.url ? "active" : ""
                }`}
              />
            ))}
          </div>

          <div className="main-image-container">
            <img src={mainImage} alt={name} className="main-image-preview" />
          </div>
        </div>

        <div className="details-section">
          <h2>{name}</h2> 
          <div className="price-block">
            {discountPrice ? (
              <>
                <p className="price discounted">₹{discountPrice}</p>
                <p className="price original">₹{price}</p>
              </>
            ) : (
              <p className="price">₹{price}</p>
            )}
          </div>

          <div className="rating">
            <span>{rating || 4.2} ★</span>
            <span>({numReviews || 100} reviews)</span>
          </div>
          <p>{description}</p>

          <div className="option-group">
            <label htmlFor="color-select">Color:</label>
            <select
              id="color-select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Select color</option>
              {colors?.map((color, i) => (
                <option key={i} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label>Size:</label>
            <div className="size-options">
              {sizes?.map((size, i) => (
                <button
                  key={i}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>Quantity:</label>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <button
            className="add-to-cart"
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize}
          >
            Add to Cart
          </button>

          <div className="extra-info">
            <p>
              <strong>Brand:</strong> {brand || "N/A"}
            </p>
            <p>
              <strong>Material:</strong> {material || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedProduct;
