import React, { useRef, useEffect, useState, useCallback } from "react";
import { FaFilter, FaExclamationCircle } from "react-icons/fa";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../../componets/Products/FilterSidebar/FilterSidebar";
import SortOptions from "../../componets/Products/ShortOptions/ShortOptions";
import { fetchProductsByFilters } from "../../../redux/slices/productsSlice";
import "./CollectionsPage.css";

// Always get image URL from DB
const getImageUrl = (image) => {
  if (!image) return ""; // No fallback!
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
  const url = typeof image === "string" ? image : image?.url;
  return url?.startsWith("http") ? url : `${baseUrl}${url || ""}`;
};

const CollectionsPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const queryParams = Object.fromEntries(searchParams);

  const handleProductClick = useCallback(
    (productId) => navigate(`/product/${productId}`),
    [navigate]
  );

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection: collection || "", ...queryParams }));
  }, [collection, searchParams, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".mobile-filter-button")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="collections-page">
      <button
        className="mobile-filter-button"
        onClick={toggleSidebar}
        aria-label="Toggle filters"
        aria-expanded={isSidebarOpen}
        aria-controls="filter-sidebar"
      >
        <FaFilter className="filter-icon" />
        <span>Filters</span>
      </button>

      <div
        id="filter-sidebar"
        className={`filter-sidebar-container ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
        aria-hidden={!isSidebarOpen}
      >
        <FilterSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="main-content">
        <header className="collection-header">
          <h1>Discover Fashion – Where Style Meets Confidence</h1>
          <div className="sort-options-container">
            <SortOptions />
          </div>
        </header>

        <section className="product-grid" aria-label="Product listings">
          {loading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <FaExclamationCircle className="error-icon" />
              <p>Error loading products: {error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Retry
              </button>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            products
              // Only render if product._id exists
              .filter(product => product._id && (product.images?.[0]?.url || product.image))
              .map((product) => {
                const productId = product._id;
                return (
                  <article
                    key={productId}
                    className="product-card"
                    onClick={() => handleProductClick(productId)}
                    onKeyDown={(e) => e.key === "Enter" && handleProductClick(productId)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name || "Product"}, priced at ₹${(product.price || 0).toFixed(2)}`}
                  >
                    <div className="product-image-container">
                      <img
                        src={getImageUrl(product.image || product.images?.[0])}
                        alt={product.name || "Product image"}
                        loading="lazy"
                        decoding="async"
                        width="300"
                        height="400"
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name || "Unnamed Product"}</h3>
                      <p className="product-price">₹{(product.price || 0).toFixed(2)}</p>
                      <div className="product-meta">
                        <span className="product-brand">{product.brand || "Unknown Brand"}</span>
                      </div>
                    </div>
                  </article>
                );
              })
          )}
        </section>
      </main>
    </div>
  );
};

export default CollectionsPage;
