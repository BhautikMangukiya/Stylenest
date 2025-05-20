import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./FilterSidebar.css";

function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 499,
    maxPrice: 3000,
  });

  const [priceRange, setPriceRange] = useState([499, 3000]);

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women", "Kids"];
  const colors = ["red", "blue", "green", "yellow", "orange", "purple"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton", "Denim", "Leather", "Wool", "Polyester",
    "Linen", "Silk", "Nylon", "Fleece", "Viscose"
  ];
  const brands = [
    "Nike", "Adidas", "Zara", "H&M", "Levi's",
    "Gucci", "Puma", "Under Armour", "Uniqlo", "The North Face"
  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    const minPrice = parseInt(params.minPrice) || 499;
    const maxPrice = parseInt(params.maxPrice) || 3000;

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice,
      maxPrice,
    });

    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  const handleRadioChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    const updatedParams = { ...Object.fromEntries(searchParams), [key]: value };
    setSearchParams(updatedParams);
  };

  const handleCheckboxChange = (key, value) => {
    const currentValues = filters[key];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    const updatedFilters = { ...filters, [key]: updatedValues };
    setFilters(updatedFilters);

    const updatedParams = {
      ...Object.fromEntries(searchParams),
      [key]: updatedValues.join(","),
    };
    setSearchParams(updatedParams);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 499,
      maxPrice: 3000,
    };

    setFilters(defaultFilters);
    setSearchParams({});
    setPriceRange([499, 3000]);
  };

  const handleMinPriceChange = (e) => {
    const newMin = parseInt(e.target.value) || 499;
    const newPriceRange = [Math.min(newMin, priceRange[1] - 100), priceRange[1]];
    setPriceRange(newPriceRange);

    const updatedFilters = { ...filters, minPrice: newPriceRange[0], maxPrice: newPriceRange[1] };
    setFilters(updatedFilters);

    const updatedParams = {
      ...Object.fromEntries(searchParams),
      minPrice: newPriceRange[0],
      maxPrice: newPriceRange[1],
    };
    setSearchParams(updatedParams);
  };

  const handleMaxPriceChange = (e) => {
    const newMax = parseInt(e.target.value) || 3000;
    const newPriceRange = [priceRange[0], Math.max(newMax, priceRange[0] + 100)];
    setPriceRange(newPriceRange);

    const updatedFilters = { ...filters, minPrice: newPriceRange[0], maxPrice: newPriceRange[1] };
    setFilters(updatedFilters);

    const updatedParams = {
      ...Object.fromEntries(searchParams),
      minPrice: newPriceRange[0],
      maxPrice: newPriceRange[1],
    };
    setSearchParams(updatedParams);
  };

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <h2 className="filter-title">Filters</h2>
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Category</h4>
        {categories.map((cat) => (
          <label key={cat} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat}
              onChange={() => handleRadioChange("category", cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Gender</h4>
        {genders.map((gender) => (
          <label key={gender} className="filter-option">
            <input
              type="radio"
              name="gender"
              checked={filters.gender === gender}
              onChange={() => handleRadioChange("gender", gender)}
            />
            {gender}
          </label>
        ))}
      </div>

      {/* Color Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Color</h4>
        {colors.map((color) => (
          <label key={color} className="filter-option">
            <input
              type="radio"
              name="color"
              checked={filters.color === color}
              onChange={() => handleRadioChange("color", color)}
            />
            {color}
          </label>
        ))}
      </div>

      {/* Size Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Sizes</h4>
        {sizes.map((size) => (
          <label key={size} className="filter-option">
            <input
              type="checkbox"
              checked={filters.size.includes(size)}
              onChange={() => handleCheckboxChange("size", size)}
            />
            {size}
          </label>
        ))}
      </div>

      {/* Material Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Materials</h4>
        {materials.map((mat) => (
          <label key={mat} className="filter-option">
            <input
              type="checkbox"
              checked={filters.material.includes(mat)}
              onChange={() => handleCheckboxChange("material", mat)}
            />
            {mat}
          </label>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Brands</h4>
        {brands.map((brand) => (
          <label key={brand} className="filter-option">
            <input
              type="checkbox"
              checked={filters.brand.includes(brand)}
              onChange={() => handleCheckboxChange("brand", brand)}
            />
            {brand}
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price Range</h4>
        <div className="price-range-container">
          <div className="price-range-header">
            <span className="price-range-title">PRICE RANGE</span>
            <span className="price-range-values">₹{priceRange[0]} - ₹{priceRange[1]}</span>
          </div>
          
          <div className="price-slider-container">
            <div className="price-slider-track"></div>
            <div 
              className="price-slider-range" 
              style={{
                left: `${((priceRange[0] - 499) / (3000 - 499)) * 100}%`,
                width: `${((priceRange[1] - priceRange[0]) / (3000 - 499)) * 100}%`
              }}
            ></div>
            
            <input
              type="range"
              min="499"
              max="3000"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="price-slider"
            />
            
            <input
              type="range"
              min="499"
              max="3000"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="price-slider"
            />
          </div>

        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;

// Compare this snippet from backend/models/Product.js: