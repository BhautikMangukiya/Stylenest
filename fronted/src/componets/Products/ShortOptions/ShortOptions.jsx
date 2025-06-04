import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ShortOptions.css";

function ShortOptions({ onSortChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentSort = queryParams.get("sort") || "recommended";

  const [sortOption, setSortOption] = useState(currentSort);

  useEffect(() => {
    setSortOption(currentSort);
  }, [currentSort]);

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);

    // Update URL with new sort
    queryParams.set("sort", selectedSort);
    navigate(`${location.pathname}?${queryParams.toString()}`);

    // Call parent handler if provided
    if (onSortChange) {
      onSortChange(selectedSort);
    }
  };

  return (
    <div className="sort-options-container-short">
      <label htmlFor="sort-options-select" className="sort-options-label">
        Sort by:
      </label>
      <select
        id="sort-options-select"
        value={sortOption}
        onChange={handleSortChange}
        className="sort-options-dropdown"
      >
        <option value="recommended">Recommended</option> {/* maps to createdAt */}
        <option value="priceasc">Price: Low to High</option>
        <option value="pricedesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
}

export default ShortOptions;
