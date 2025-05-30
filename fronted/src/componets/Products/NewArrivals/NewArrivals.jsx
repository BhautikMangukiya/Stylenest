import React, { useEffect, useRef, useState } from "react";
import "./NewArrivals.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function NewArrivals() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError("Failed to load new arrivals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const updateCardWidth = () => {
      if (scrollRef.current && scrollRef.current.firstChild) {
        const card = scrollRef.current.firstChild;
        const style = window.getComputedStyle(card);
        const margin = parseFloat(style.marginRight);
        setCardWidth(card.offsetWidth + margin);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [newArrivals]); // Add newArrivals as dependency to recalculate when data loads

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const epsilon = 1;
    setCanScrollLeft(container.scrollLeft > epsilon);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth + epsilon <
        container.scrollWidth
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollButtons, 100);
    };

    container.addEventListener("scroll", handleScroll);
    updateScrollButtons();

    const observer = new IntersectionObserver(updateScrollButtons, {
      root: container,
      threshold: 0.1,
    });

    Array.from(container.children).forEach(child => {
      observer.observe(child);
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [newArrivals]);

  if (loading) {
    return (
      <div className="new-arrivals">
        <section className="new-arrivals__section">
          <div className="new-arrivals__header">
            <h2 className="new-arrivals__title">Explore New Arrivals</h2>
            <p className="new-arrivals__subtitle">
              Discover the latest styles and trends today!
            </p>
          </div>
          <div className="new-arrivals__content">
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="new-arrivals">
        <section className="new-arrivals__section">
          <div className="new-arrivals__header">
            <h2 className="new-arrivals__title">Explore New Arrivals</h2>
            <p className="new-arrivals__subtitle">
              Discover the latest styles and trends today!
            </p>
          </div>
          <div className="new-arrivals__content">
            <p className="new-arrivals__error">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="new-arrivals">
      <section className="new-arrivals__section">
        <div className="new-arrivals__header">
          <h2 className="new-arrivals__title">Explore New Arrivals</h2>
          <p className="new-arrivals__subtitle">
            Discover the latest styles and trends today!
          </p>
        </div>

        <div className="new-arrivals__scroll-wrapper">
          <button
            className="new-arrivals__scroll-btn new-arrivals__scroll-btn--left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <div className="new-arrivals__content" ref={scrollRef}>
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div className="new-arrivals__card" key={product._id}>
                  <img
                    src={product.images[0]?.url || ''}
                    alt={product.name || 'Product image'}
                    className="new-arrivals__image"
                    onError={(e) => {
                      e.target.src = 'path-to-fallback-image.jpg';
                    }}
                  />
                  <div className="new-arrivals__info">
                    <Link
                      to={`/product/${product._id}`}
                      className="new-arrivals__link"
                    >
                      <h4 className="new-arrivals__product-name">
                        {product.name}
                      </h4>
                      <p className="new-arrivals__product-price">
                        ₹ {product.price}
                      </p>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No new arrivals available</p>
            )}
          </div>

          <button
            className="new-arrivals__scroll-btn new-arrivals__scroll-btn--right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}

export default NewArrivals;