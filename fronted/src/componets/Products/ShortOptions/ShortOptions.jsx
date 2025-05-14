import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ShortOptions.css";

function ShortOptions({ onSortChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentSort = queryParams.get("sort") || "recommended";

  const [sortOption, setSortOption] = useState(currentSort);

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);

    // Update query param in URL
    queryParams.set("sort", selectedSort);
    navigate(`${location.pathname}?${queryParams.toString()}`);

    // Notify parent component
    if (onSortChange) {
      onSortChange(selectedSort);
    }
  };

  useEffect(() => {
    setSortOption(currentSort);
  }, [currentSort]);

  return (
    <div className="short-options">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortOption}
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="recommended">Recommended</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}

export default ShortOptions;
