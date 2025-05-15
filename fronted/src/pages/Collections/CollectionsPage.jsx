import React, { useRef, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../../componets/Products/FilterSidebar/FilterSidebar";
import "./CollectionsPage.css";
import ShortOptions from "../../componets/Products/ShortOptions/ShortOptions";

function CollectionsPage() {
  const [products, setProducts] = useState([]); // Fixed typo
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // Fixed typo
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const fetchProducts = [
        {
          id: "1",
          name: "Classic Denim Jacket",
          price: 799.99,
          image: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
        },
        {
          id: "2",
          name: "Cotton T-Shirt",
          price: 599.00,
          image: "https://images.pexels.com/photos/5325881/pexels-photo-5325881.jpeg",
        },
        {
          id: "3",
          name: "Slim Fit Jeans",
          price: 849.99,
          image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
        },
        {
          id: "4",
          name: "Hooded Sweatshirt",
          price: 699.00,
          image: "https://images.pexels.com/photos/6311394/pexels-photo-6311394.jpeg",
        },
        {
          id: "5",
          name: "Leather Jacket",
          price: 999.99,
          image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg",
        },
        {
          id: "6",
          name: "Formal Shirt",
          price: 649.00,
          image: "https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg",
        },
        {
          id: "7",
          name: "Chinos Pants",
          price: 729.99,
          image: "https://images.pexels.com/photos/6311611/pexels-photo-6311611.jpeg",
        },
        {
          id: "8",
          name: "Sports Shorts",
          price: 619.00,
          image: "https://images.pexels.com/photos/6311622/pexels-photo-6311622.jpeg",
        },
        {
          id: "9",
          name: "Long Coat",
          price: 899.99,
          image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg",
        },
        {
          id: "10",
          name: "Athletic Jacket",
          price: 759.00,
          image: "https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg",
        },
        {
          id: "11",
          name: "Trendy Hoodie",
          price: 679.99,
          image: "https://images.pexels.com/photos/5749152/pexels-photo-5749152.jpeg",
        },
        {
          id: "12",
          name: "Vintage Shirt",
          price: 639.00,
          image: "https://images.pexels.com/photos/6311634/pexels-photo-6311634.jpeg",
        },
        {
          id: "13",
          name: "Business Suit",
          price: 949.99,
          image: "https://images.pexels.com/photos/6311610/pexels-photo-6311610.jpeg",
        },
        {
          id: "14",
          name: "Graphic Tee",
          price: 609.00,
          image: "https://images.pexels.com/photos/5911886/pexels-photo-5911886.jpeg",
        },
        {
          id: "15",
          name: "Raincoat",
          price: 789.99,
          image: "https://images.pexels.com/photos/6311637/pexels-photo-6311637.jpeg",
        },
        {
          id: "16",
          name: "Plaid Flannel Shirt",
          price: 669.00,
          image: "https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg",
        },
        {
          id: "17",
          name: "Casual Blazer",
          price: 879.99,
          image: "https://images.pexels.com/photos/1030895/pexels-photo-1030895.jpeg",
        },
        {
          id: "18",
          name: "Women's Leather Pants",
          price: 739.00,
          image: "https://images.pexels.com/photos/5325697/pexels-photo-5325697.jpeg",
        },
        {
          id: "19",
          name: "Overcoat",
          price: 919.99,
          image: "https://images.pexels.com/photos/8941561/pexels-photo-8941561.jpeg",
        },
      ];
      

      setProducts(fetchProducts);
    }, 1000);
  }, []);

  return (
    <>
      <div className="All-products">
        {/* Mobile filter button */}
        <div className="mobbile-filter-button">
          <button onClick={toggleSidebar} aria-label="Toggle filter sidebar">
            <FaFilter className="mobile-view-filtter-icon" />
          </button>
        </div>

        {/* Filter sidebar */}
        <div
          className={`filter-sideBar ${isSidebarOpen ? "open" : ""}`}
          ref={sidebarRef}
        >
          <FilterSidebar />
        </div>

        {/* Product grid */}
        <div className="men-collection-heading">
          <div className="h2">
          <h2>
            Explore Our Exclusive Men's Collection – Style, Comfort & Confidence
            Redefined.
          </h2>

          <ShortOptions className="ShortOptions"/>
          </div>
          <div className="product-grid">
            {products.length === 0 ? (
              <p>Loading products...</p>
            ) : (
              products.map((item) => (
                <div key={item.id} className="product-card">
                  <img src={item.image} alt={item.name} />
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p>₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CollectionsPage;

// 
// 
// 
