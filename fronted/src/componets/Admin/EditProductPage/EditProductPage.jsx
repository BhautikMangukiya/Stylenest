import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../../../redux/slices/productsSlice";
import { toast } from "sonner";
import axios from "axios";
import "./EditProductPage.css";


const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function EditProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    images: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);


  useEffect(() => {
    if (selectedProduct && selectedProduct._id === id) {
      setFormData({
        ...selectedProduct,
        tags: selectedProduct.tags?.join(", ") || "",
        sizes: selectedProduct.sizes?.length ? selectedProduct.sizes : [""],
        colors: selectedProduct.colors?.length ? selectedProduct.colors : [""],
        dimensions: selectedProduct.dimensions || { length: "", width: "", height: "" },
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct, id]);


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
    fileInputRef.current?.click();
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      altText: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Updating product...");

    try {
  
      const newFiles = formData.images.filter((img) => img.file instanceof File);
      const existingImages = formData.images
        .filter((img) => typeof img === "string" || (img.url && img.url.startsWith("http")))
        .map((img) =>
          typeof img === "string"
            ? { url: img, altText: "" }
            : { url: img.url, altText: img.altText || "" }
        );

      let uploadedImages = [];
      if (newFiles.length > 0) {
        const form = new FormData();
        newFiles.forEach((img) => form.append("images", img.file));

        const res = await axios.post(`${BASE_URL}/api/upload`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        uploadedImages = res.data.images || [];
      }


      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: parseFloat(formData.discountPrice),
        countInStock: parseInt(formData.countInStock),
        sizes: formData.sizes.filter(Boolean),
        colors: formData.colors.filter(Boolean),
        tags: formData.tags.split(",").map((t) => t.trim()),
        dimensions: {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height),
        },
        weight: parseFloat(formData.weight),
        images: [...existingImages, ...uploadedImages],
      };

      await dispatch(updateProduct({ id, productData: updatedData })).unwrap();

      toast.success("Product updated successfully!", { id: toastId });
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="edit-product__loading">Loading...</div>;
  if (error) return <div className="edit-product__error">Error: {error}</div>;

  return (
    <div className="edit-product">
      <header className="edit-product__header">
        <h2 className="edit-product__title">Edit Product</h2>
      </header>

      <form onSubmit={handleSubmit} className="edit-product__form">
        {/* BASIC INFO */}
        <section className="edit-product__section">
          <div className="edit-product__grid">
            {[
              { label: "Product Name", name: "name" },
              { label: "SKU", name: "sku" },
              { label: "Category", name: "category" },
              { label: "Brand", name: "brand" },
              { label: "Price", name: "price", type: "number" },
              { label: "Discount Price", name: "discountPrice", type: "number" },
              { label: "Stock Quantity", name: "countInStock", type: "number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="edit-product__form-group">
                <label htmlFor={name} className="edit-product__label">{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className="edit-product__input"
                  required={["name", "sku", "price", "countInStock"].includes(name)}
                />
              </div>
            ))}

            <div className="edit-product__form-group">
              <label htmlFor="gender" className="edit-product__label">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="edit-product__select"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="edit-product__section">
          <div className="edit-product__form-group edit-product__form-group--full">
            <label htmlFor="description" className="edit-product__label">Product Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="edit-product__textarea"
              required
            />
          </div>
        </section>

        {/* SIZES & COLORS */}
        <section className="edit-product__section">
          {["sizes", "colors"].map((field) => (
            <div key={field} className="edit-product__variant-group">
              <label className="edit-product__label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <div className="edit-product__dynamic-inputs">
                {formData[field].map((value, i) => (
                  <input
                    key={i}
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const updated = [...formData[field]];
                      updated[i] = e.target.value;
                      setFormData({ ...formData, [field]: updated });
                    }}
                    className="edit-product__input edit-product__input--dynamic"
                    placeholder={`${field.slice(0, -1)} ${i + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, [field]: [...formData[field], ""] })}
                  className="edit-product__add-btn"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* SEO TAGS */}
        <section className="edit-product__section">
          <div className="edit-product__grid">
            {["metaTitle", "metaKeyword"].map((field) => (
              <div key={field} className="edit-product__form-group">
                <label htmlFor={field} className="edit-product__label">{field.replace("meta", "Meta ")}</label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  value={formData[field]}
                  onChange={handleChange}
                  className="edit-product__input"
                />
              </div>
            ))}
            <div className="edit-product__form-group edit-product__form-group--full">
              <label htmlFor="metaDescription" className="edit-product__label">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                className="edit-product__textarea"
              />
            </div>
            <div className="edit-product__form-group edit-product__form-group--full">
              <label htmlFor="tags" className="edit-product__label">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="edit-product__input"
              />
            </div>
          </div>
        </section>

        {/* SHIPPING */}
        <section className="edit-product__section">
          <div className="edit-product__grid">
            {["length", "width", "height"].map((dim) => (
              <div key={dim} className="edit-product__form-group">
                <label htmlFor={`dimensions.${dim}`} className="edit-product__label">
                  {dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)
                </label>
                <input
                  id={`dimensions.${dim}`}
                  name={`dimensions.${dim}`}
                  type="number"
                  value={formData.dimensions[dim]}
                  onChange={handleChange}
                  className="edit-product__input"
                />
              </div>
            ))}
            <div className="edit-product__form-group">
              <label htmlFor="weight" className="edit-product__label">Weight (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="edit-product__input"
              />
            </div>
          </div>
        </section>

        {/* STATUS + IMAGES */}
        <section className="edit-product__section">
          <div className="edit-product__status-group">
            <label className="edit-product__checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="edit-product__checkbox"
              />
              Featured Product
            </label>
            <label className="edit-product__checkbox-label">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="edit-product__checkbox"
              />
              Published
            </label>
          </div>

          <div className="edit-product__image-upload">
            <label className="edit-product__label">Product Images</label>
            <div className="edit-product__upload-area" onClick={handleImageClick}>
              <span className="edit-product__upload-icon">+</span>
              <span className="edit-product__upload-text">Click to upload images</span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="edit-product__file-input"
            />
            <div className="edit-product__image-previews">
              {formData.images.map((img, idx) => (
                <div key={idx} className="edit-product__image-preview">
                  <img
                    src={typeof img === "string" ? img : img.url}
                    alt={img.altText || `Preview ${idx + 1}`}
                    className="edit-product__preview-image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="edit-product__remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="edit-product__actions">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="edit-product__cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="edit-product__submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
