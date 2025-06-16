import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../../redux/slices/productsSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./AddNewProduct.css";

function AddNewProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [""],
    colors: [""],
    collections: "",
    material: "",
    gender: "Unisex",
    isFeatured: false,
    isPublished: true,
    tags: "",
    metaTitle: "",
    metaDescription: "",
    metaKeyword: "",
    dimensions: { length: "", width: "", height: "" },
    weight: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("dimensions.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      altText: file.name,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Creating product...");

    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      discountPrice: parseFloat(formData.discountPrice) || 0,
      countInStock: parseInt(formData.countInStock) || 0,
      sizes: formData.sizes.filter(Boolean),
      colors: formData.colors.filter(Boolean),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dimensions: {
        length: parseFloat(formData.dimensions.length) || 0,
        width: parseFloat(formData.dimensions.width) || 0,
        height: parseFloat(formData.dimensions.height) || 0,
      },
      weight: parseFloat(formData.weight) || 0,
    };

    try {
      const resultAction = await dispatch(
        createProduct({ productData, imageFiles })
      );

      if (createProduct.fulfilled.match(resultAction)) {
        toast.success("Product created successfully!", { id: toastId });
        navigate("/admin/products");
      } else {
        toast.error(resultAction.payload || "Failed to create product", { id: toastId });
      }
    } catch (err) {
      toast.error("Unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="productadd-page">
      <h2 className="productadd-title">Add New Product</h2>
      <form onSubmit={handleSubmit} className="productadd-form">
        <div className="productadd-form-grid">
          {[
            "name",
            "sku",
            "category",
            "brand",
            "collections",
            "material",
            "price",
            "discountPrice",
            "countInStock",
          ].map((field, index) => (
            <input
              key={index}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              type={["price", "discountPrice", "countInStock"].includes(field) ? "number" : "text"}
              required={["name", "sku", "category", "collections", "price", "countInStock"].includes(field)}
              min="0"
              step="0.01"
            />
          ))}

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Unisex">Unisex</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
        />

        {["sizes", "colors"].map((field) => (
          <div key={field} className="productadd-dynamic-input">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <div className="productadd-input-plus">
              {formData[field].map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const updated = [...formData[field]];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, [field]: updated });
                  }}
                  placeholder={`${field.slice(0, -1)} ${idx + 1}`}
                />
              ))}
              <button type="button" className="add-btn" onClick={() => setFormData({ ...formData, [field]: [...formData[field], ""] })}>+</button>
            </div>
          </div>
        ))}

        <div className="productadd-form-grid">
          {["metaTitle", "metaDescription", "metaKeyword", "tags"].map((field, index) => (
            <input
              key={index}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace("meta", "Meta ")}
            />
          ))}
        </div>

        <div className="productadd-form-grid">
          {["length", "width", "height"].map((dim) => (
            <input
              key={dim}
              name={`dimensions.${dim}`}
              type="number"
              value={formData.dimensions[dim]}
              onChange={handleChange}
              placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
              min="0"
              step="0.01"
            />
          ))}
          <input
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            min="0"
            step="0.01"
          />
        </div>

        <div className="productadd-checkbox-row">
          {["isFeatured", "isPublished"].map((field) => (
            <label key={field}>
              <input
                type="checkbox"
                name={field}
                checked={formData[field]}
                onChange={handleChange}
                className="productadd-checkbox"
              />
              {field.replace("is", "")}
            </label>
          ))}
        </div>

        <div className="productadd-upload-wrapper">
          <div className="productadd-upload-box" onClick={handleImageClick}>
            <div className="productadd-upload-text">Upload</div>
            <div className="productadd-upload-plus">+</div>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="productadd-image-preview">
          {imagePreviews.map((img, idx) => (
            <div key={idx} className="productadd-image-thumb">
              <img src={img.url} alt={img.altText} />
              <button type="button" onClick={() => handleRemoveImage(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="productadd-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}

export default AddNewProduct;
