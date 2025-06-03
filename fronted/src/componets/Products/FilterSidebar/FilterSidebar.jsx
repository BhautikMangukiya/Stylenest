import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./FilterSidebar.css";

function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    sizes: [],
    material: [],
    brand: [],
    minPrice: 499,
    maxPrice: 3000,
  });

  const [priceRange, setPriceRange] = useState([499, 3000]);

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women"];
  const colors = ["red", "blue", "green", "yellow", "orange", "purple"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Denim",
    "Leather",
    "Wool",
    "Polyester",
    "Linen",
    "Silk",
    "Nylon",
    "Fleece",
    "Viscose",
  ];
  const brands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Levi's",
    "Gucci",
    "Puma",
    "Under Armour",
    "Uniqlo",
    "The North Face",
  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const minPrice = parseInt(params.minPrice) || 499;
    const maxPrice = parseInt(params.maxPrice) || 3000;

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      sizes: params.sizes ? params.sizes.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice,
      maxPrice,
    });

    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);

  function handleRadioChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const params = { ...Object.fromEntries(searchParams), [key]: value };
    setSearchParams(params);
  }

  function handleCheckboxChange(key, value) {
    const current = filters[key];
    const exists = current.includes(value);
    const values = exists
      ? current.filter((item) => item !== value)
      : [...current, value];
    setFilters((prev) => ({ ...prev, [key]: values }));
    const params = {
      ...Object.fromEntries(searchParams),
      [key]: values.join(","),
    };
    setSearchParams(params);
  }

  function handleClearFilters() {
    const initial = {
      category: "",
      gender: "",
      color: "",
      sizes: [],
      material: [],
      brand: [],
      minPrice: 499,
      maxPrice: 3000,
    };
    setFilters(initial);
    setPriceRange([499, 3000]);
    setSearchParams({});
  }

  function handleMinPriceChange(e) {
    const min = parseInt(e.target.value) || 499;
    const range = [Math.min(min, priceRange[1] - 100), priceRange[1]];
    setPriceRange(range);
    setFilters((prev) => ({ ...prev, minPrice: range[0], maxPrice: range[1] }));
    const params = {
      ...Object.fromEntries(searchParams),
      minPrice: range[0],
      maxPrice: range[1],
    };
    setSearchParams(params);
  }

  function handleMaxPriceChange(e) {
    const max = parseInt(e.target.value) || 3000;
    const range = [priceRange[0], Math.max(max, priceRange[0] + 100)];
    setPriceRange(range);
    setFilters((prev) => ({ ...prev, minPrice: range[0], maxPrice: range[1] }));
    const params = {
      ...Object.fromEntries(searchParams),
      minPrice: range[0],
      maxPrice: range[1],
    };
    setSearchParams(params);
  }

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <h2 className="filter-title">Filters</h2>
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

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

      <div className="filter-group">
        <h4 className="filter-group-title">Sizes</h4>
        {sizes.map((size) => (
          <label key={size} className="filter-option">
            <input
              type="checkbox"
              checked={filters.sizes.includes(size)}
              onChange={() => handleCheckboxChange("sizes", size)}
            />
            {size}
          </label>
        ))}
      </div>

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

      <div className="filter-group">
        <h4 className="filter-group-title">Price Range</h4>
        <div className="price-range-container">
          <div className="price-range-header">
            <span className="price-range-title">PRICE RANGE</span>
            <span className="price-range-values">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </span>
          </div>
          <div className="price-slider-container">
            <div className="price-slider-track"></div>
            <div
              className="price-slider-range"
              style={{
                left: `${((priceRange[0] - 499) / (3000 - 499)) * 100}%`,
                width: `${
                  ((priceRange[1] - priceRange[0]) / (3000 - 499)) * 100
                }%`,
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
