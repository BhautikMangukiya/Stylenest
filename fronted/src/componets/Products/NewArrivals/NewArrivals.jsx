import React, { useEffect, useRef, useState } from "react";
import "./NewArrivals.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function NewArrivals() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);

  const NewArrivals = [
    {
        _id: "1",
        name: "Stylish Jacket",
        price: 1500,
        images: [{ url: "https://picsum.photos/seed/jacket1/500/500" }],
      },
      {
        _id: "2",
        name: "Casual Hoodie",
        price: 1200,
        images: [{ url: "https://picsum.photos/seed/hoodie2/500/500" }],
      },
      {
        _id: "3",
        name: "Denim Jeans",
        price: 1800,
        images: [{ url: "https://picsum.photos/seed/jeans3/500/500" }],
      },
      {
        _id: "4",
        name: "Summer Dress",
        price: 1700,
        images: [{ url: "https://picsum.photos/seed/dress4/500/500" }],
      },
      {
        _id: "5",
        name: "Sneakers",
        price: 2200,
        images: [{ url: "https://picsum.photos/seed/sneakers5/500/500" }],
      },
      {
        _id: "6",
        name: "Leather Boots",
        price: 2500,
        images: [{ url: "https://picsum.photos/seed/boots6/500/500" }],
      },
      {
        _id: "7",
        name: "Graphic T-Shirt",
        price: 800,
        images: [{ url: "https://picsum.photos/seed/tshirt7/500/500" }],
      },
      {
        _id: "8",
        name: "Formal Shirt",
        price: 1300,
        images: [{ url: "https://picsum.photos/seed/shirt8/500/500" }],
      },
  ];

  // Calculate card width on mount and resize
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
    window.addEventListener('resize', updateCardWidth);
    
    return () => {
      window.removeEventListener('resize', updateCardWidth);
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  };

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const epsilon = 1; // Small tolerance for floating point errors
    const newCanScrollLeft = container.scrollLeft > epsilon;
    const newCanScrollRight = 
      container.scrollLeft + container.clientWidth + epsilon < container.scrollWidth;
    
    setCanScrollLeft(newCanScrollLeft);
    setCanScrollRight(newCanScrollRight);
  };

  // Throttle the scroll event for better performance
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollButtons, 100);
    };

    container.addEventListener("scroll", handleScroll);
    updateScrollButtons(); // initial check

    // Add intersection observer for more precise detection
    const observer = new IntersectionObserver(updateScrollButtons, {
      root: container,
      threshold: 0.1
    });

    // Observe first and last child
    if (container.firstChild) observer.observe(container.firstChild);
    if (container.lastChild) observer.observe(container.lastChild);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="NewArrivals">
    <section className="slider-section">
      <div className="NewArrivals-Slider">
        <h2 className="New-Arrivals-heading">Explore New Arrivals</h2>
        <p>Discover the latest styles and trends today!</p>
      </div>

      <div className="scroll-wrapper">
        <button
          className="scroll-btn left"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <FaChevronLeft />
        </button>

        <div className="Scrollable-content" ref={scrollRef}>
          {NewArrivals.map((product) => (
            <div className="each-product" key={product._id}>
              <img src={product.images[0]?.url} alt={product.name} />
              <div className="product-info">
                <Link to={`/product/${product._id}`}>
                  <h4>{product.name}</h4>
                  <p>₹ {product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button
          className="scroll-btn right"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <FaChevronRight />
        </button>
      </div>
      
    </section>
    </div>
  );
}

export default NewArrivals;