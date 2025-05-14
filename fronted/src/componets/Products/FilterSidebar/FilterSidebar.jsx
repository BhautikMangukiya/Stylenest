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
  const genders = ["Men", "Women", "Kids"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 1000,
    });

    setPriceRange([0, params.maxPrice || 1000]);
  }, [searchParams]);

  // ✅ Handle radio buttons (single value filters)
  const handleRadioChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = {
      ...Object.fromEntries(searchParams),
      [key]: value,
    };

    setSearchParams(newParams);
  };

  // ✅ Handle checkboxes (multi-value filters)
  const handleCheckboxChange = (key, value) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    const newFilters = { ...filters, [key]: updated };
    setFilters(newFilters);

    const newParams = {
      ...Object.fromEntries(searchParams),
      [key]: updated.join(","),
    };

    setSearchParams(newParams);
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
    <div className="filter-sidebar">
      <div className="filter-heading">
        <h2>Filters</h2>
        <button onClick={handleClearFilters} className="filter-remove">Remove filter</button>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4>Category</h4>
        {categories.map((cat) => (
          <label key={cat}>
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

      {/* Gender */}
      <div className="filter-section">
        <h4>Gender</h4>
        {genders.map((g) => (
          <label key={g}>
            <input
              type="radio"
              name="gender"
              checked={filters.gender === g}
              onChange={() => handleRadioChange("gender", g)}
            />
            {g}
          </label>
        ))}
      </div>

      {/* Color */}
      <div className="filter-section">
        <h4>Color</h4>
        {colors.map((color) => (
          <label key={color}>
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

      {/* Size */}
      <div className="filter-section">
        <h4>Sizes</h4>
        {sizes.map((size) => (
          <label key={size}>
            <input
              type="checkbox"
              checked={filters.size.includes(size)}
              onChange={() => handleCheckboxChange("size", size)}
            />
            {size}
          </label>
        ))}
      </div>

      {/* Material */}
      <div className="filter-section">
        <h4>Materials</h4>
        {materials.map((mat) => (
          <label key={mat}>
            <input
              type="checkbox"
              checked={filters.material.includes(mat)}
              onChange={() => handleCheckboxChange("material", mat)}
            />
            {mat}
          </label>
        ))}
      </div>

      {/* Brand */}
      <div className="filter-section">
        <h4>Brands</h4>
        {brands.map((b) => (
          <label key={b}>
            <input
              type="checkbox"
              checked={filters.brand.includes(b)}
              onChange={() => handleCheckboxChange("brand", b)}
            />
            {b}
          </label>
        ))}
      </div>

      {/* Price Range Display */}
      <div className="filter-section">
        <h4>Price</h4>
        <div className="price-range-labels">
           <p>₹0 - ₹1000</p>
        </div>

        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceRange[1]}
          onChange={(e) => {
            const newMax = parseInt(e.target.value);
            setPriceRange([0, newMax]);

            const newFilters = { ...filters, maxPrice: newMax };
            setFilters(newFilters);

            const newParams = {
              ...Object.fromEntries(searchParams),
              minPrice: 0,
              maxPrice: newMax,
            };

            setSearchParams(newParams);
          }}
        />

        <p>Selected Price: ₹{priceRange[1]}</p>
      </div>
    </div>
  );
}

export default FilterSidebar;
