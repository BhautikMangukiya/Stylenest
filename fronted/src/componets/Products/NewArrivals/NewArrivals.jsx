import React, { useEffect, useRef, useState } from "react";
import "./NewArrivals.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function NewArrivals() {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);

  // Fetch new arrivals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(res.data || []);
      } catch (err) {
        setError("Failed to load new arrivals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set card width for scroll amount
  useEffect(() => {
    const updateCardSize = () => {
      if (scrollRef.current?.firstChild) {
        const card = scrollRef.current.firstChild;
        const style = window.getComputedStyle(card);
        const margin = parseFloat(style.marginRight || "0");
        setCardWidth(card.offsetWidth + margin);
      }
    };

    updateCardSize();
    window.addEventListener("resize", updateCardSize);
    return () => window.removeEventListener("resize", updateCardSize);
  }, [newArrivals]);

  // Handle scroll state
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const buffer = 5;
    setCanScrollLeft(el.scrollLeft > buffer);
    setCanScrollRight(el.scrollLeft + el.clientWidth + buffer < el.scrollWidth);
  };

  // Attach scroll observer
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => updateScrollButtons();
    container.addEventListener("scroll", onScroll);
    updateScrollButtons();

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [newArrivals]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const scrollAmount = dir === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const renderHeader = () => (
    <div className="new-arrivals__header">
      <h2 className="new-arrivals__title">Explore New Arrivals</h2>
      <p className="new-arrivals__subtitle">
        Discover the latest styles and trends today!
      </p>
    </div>
  );

  // Only uses product image from your DB
  const renderProductCard = (product) => (
    <Link to={`/product/${product._id}`} className="new-arrivals__link">
    <div className="new-arrivals__card" key={product._id}>
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="new-arrivals__image"
      />
      <div className="new-arrivals__info">
        
          <h4 className="new-arrivals__product-name">{product.name}</h4>
          <p className="new-arrivals__product-price">₹ {product.price}</p>
        
      </div>
    </div>
    </Link>
  );

  const renderScrollButtons = () => (
    <>
      <button
        className="new-arrivals__scroll-btn new-arrivals__scroll-btn--left"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>
      <button
        className="new-arrivals__scroll-btn new-arrivals__scroll-btn--right"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </>
  );

  const renderContent = () => {
    if (loading) {
      return <p className="new-arrivals__loading">Loading new arrivals...</p>;
    }

    if (error) {
      return <p className="new-arrivals__error">{error}</p>;
    }

    if (newArrivals.length === 0) {
      return <p className="new-arrivals__empty">No new arrivals found.</p>;
    }

    return (
      <div className="new-arrivals__scroll-wrapper">
        {renderScrollButtons()}
        <div className="new-arrivals__content" ref={scrollRef}>
          {newArrivals.map(renderProductCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="new-arrivals">
      <section className="new-arrivals__section">
        {renderHeader()}
        {renderContent()}
      </section>
    </div>
  );
}

export default NewArrivals;
