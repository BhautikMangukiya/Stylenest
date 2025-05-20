import React, { useRef, useEffect, useState, useCallback } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../../componets/Products/FilterSidebar/FilterSidebar";
import SortOptions from "../../componets/Products/ShortOptions/ShortOptions";
import "./CollectionsPage.css";

function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sidebarRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !event.target.closest(".mobile-filter-button")
    ) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleProductClick = useCallback((product) => {
    // In a real app, you would use react-router's navigate
    window.location.href = `/product/${product.id}`;
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Simulated API call with more realistic data
const mockData = [
  {
    id: "1",
    name: "Casual T-Shirt",
    price: 499.0,
    image: "https://images.pexels.com/photos/1006227/pexels-photo-1006227.jpeg",
    category: "Top Wear",
    gender: "Men",
    color: "black",
    size: ["S", "M", "L"],
    material: "Cotton",
    brand: "H&M"
  },
  {
    id: "2",
    name: "Denim Jeans",
    price: 999.0,
    image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
    category: "Bottom Wear",
    gender: "Women",
    color: "gray",
    size: ["28", "30", "32"],
    material: "Denim",
    brand: "Levi's"
  },
  {
    id: "3",
    name: "Summer Dress",
    price: 1299.0,
    image: "https://images.pexels.com/photos/6311395/pexels-photo-6311395.jpeg",
    category: "One Piece",
    gender: "Women",
    color: "green",
    size: ["S", "M"],
    material: "Chiffon",
    brand: "Zara"
  },
  {
    id: "4",
    name: "Formal Shirt",
    price: 799.0,
    image: "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg",
    category: "Top Wear",
    gender: "Men",
    color: "white",
    size: ["M", "L", "XL"],
    material: "Cotton",
    brand: "Arrow"
  },
  {
    id: "5",
    name: "Kurti",
    price: 699.0,
    image: "https://images.pexels.com/photos/1493111/pexels-photo-1493111.jpeg",
    category: "Ethnic Wear",
    gender: "Women",
    color: "green",
    size: ["S", "M", "L", "XL"],
    material: "Rayon",
    brand: "Biba"
  },
  {
    id: "6",
    name: "Track Pants",
    price: 599.0,
    image: "https://images.pexels.com/photos/1484808/pexels-photo-1484808.jpeg",
    category: "Bottom Wear",
    gender: "Men",
    color: "gray",
    size: ["M", "L"],
    material: "Polyester",
    brand: "Nike"
  },
  {
    id: "7",
    name: "Printed Saree",
    price: 1499.0,
    image: "https://images.pexels.com/photos/6311396/pexels-photo-6311396.jpeg",
    category: "Ethnic Wear",
    gender: "Women",
    color: "pink",
    size: ["Free"],
    material: "Georgette",
    brand: "Fabindia"
  },
  {
    id: "8",
    name: "Hoodie",
    price: 899.0,
    image: "https://images.pexels.com/photos/853261/pexels-photo-853261.jpeg",
    category: "Top Wear",
    gender: "Men",
    color: "black",
    size: ["M", "L", "XL"],
    material: "Fleece",
    brand: "Puma"
  },
  {
    id: "9",
    name: "Leggings",
    price: 499.0,
    image: "https://images.pexels.com/photos/3735645/pexels-photo-3735645.jpeg",
    category: "Bottom Wear",
    gender: "Women",
    color: "maroon",
    size: ["S", "M", "L"],
    material: "Lycra",
    brand: "Jockey"
  },
  {
    id: "10",
    name: "Oversized T-Shirt",
    price: 599.0,
    image: "https://images.pexels.com/photos/1677030/pexels-photo-1677030.jpeg",
    category: "Top Wear",
    gender: "Unisex",
    color: "white",
    size: ["M", "L", "XL"],
    material: "Cotton",
    brand: "Bewakoof"
  }
];


        await new Promise((resolve) => setTimeout(resolve, 800));
        setProducts(mockData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
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
          {isLoading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${product.name}, priced at ₹${product.price.toFixed(2)}`}
                onKeyDown={(e) => e.key === "Enter" && handleProductClick(product)}
              >
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="400"
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                  <div className="product-meta">
                    <span className="product-brand">{product.brand}</span>
                    <span
                      className="product-color"
                      style={{ backgroundColor: product.color }}
                      aria-label={`Color: ${product.color}`}
                    ></span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default CollectionsPage;