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
    minPrice: 0,
    maxPrice: 1000,
  });

  const [priceRange, setPriceRange] = useState([0, 1000]);

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

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 1000,
    });

    setPriceRange([0, parseInt(params.maxPrice) || 1000]);
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
      minPrice: 0,
      maxPrice: 1000,
    };

    setFilters(defaultFilters);
    setSearchParams({});
    setPriceRange([0, 1000]);
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

      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price</h4>
        <div className="price-range-display">₹0 - ₹1000</div>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceRange[1]}
          onChange={(e) => {
            const newMax = parseInt(e.target.value);
            setPriceRange([0, newMax]);

            const updatedFilters = { ...filters, maxPrice: newMax };
            setFilters(updatedFilters);

            const updatedParams = {
              ...Object.fromEntries(searchParams),
              minPrice: 0,
              maxPrice: newMax,
            };
            setSearchParams(updatedParams);
          }}
        />
        <p className="selected-price">Selected Price: ₹{priceRange[1]}</p>
      </div>
    </aside>
  );
}

export default FilterSidebar;
