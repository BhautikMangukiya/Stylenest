import React, { useState } from "react";
import "./EditProductPage.css";

function EditProductPage() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    size: [],
    color: "",
    image: null,
  });

  const sizes = ["S", "M", "L", "XL", "XXL", "3XL"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (e) => {
    const selectedSize = e.target.value;
    setProductData((prev) => {
      const updatedSizes = prev.size.includes(selectedSize)
        ? prev.size.filter((s) => s !== selectedSize)
        : [...prev.size, selectedSize];
      return { ...prev, size: updatedSizes };
    });
  };

  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setProductData((prev) => ({
      ...prev,
      image: selectedFiles, // Store multiple files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product:", productData);
    // Here, you'd send this data to your API/backend
  };

  return (
    <div className="edit-product-container">
      <h1 className="form-title">Edit Product</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Count in Stock:
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            required
          />
        </label>

        <div className="sku-size">
          <label>
            SKU:
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset className="size-section">
            <legend>Sizes:</legend>
            <div className="size-options">
              {sizes.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    value={s}
                    checked={productData.size.includes(s)}
                    onChange={handleSizeChange}
                  />
                  <span className="custom-checkbox"></span>
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <label>
          Color:
          <input
            type="text"
            name="color"
            value={productData.color}
            onChange={handleChange}
            placeholder="Enter color (e.g., red, #000)"
          />
        </label>

        <label>
          Upload Image:
          <div className="file-upload-wrapper">
            <div className="file-upload-btn">
              {productData.image ? "File selected" : "Choose file"}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </div>
        </label>

        <button type="submit" className="submit-btn">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProductPage;
