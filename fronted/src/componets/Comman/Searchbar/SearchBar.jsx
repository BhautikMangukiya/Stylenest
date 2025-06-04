import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters, fetchProductsByFilters } from "../../../../redux/slices/productsSlice";
import "./SearchBar.css";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();

    const term = searchTerm.trim().toLowerCase();
    if (term === "") return;

    dispatch(setFilters({ search: term }));
    dispatch(fetchProductsByFilters({ search: term }));
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-submit-btn">Search</button>
    </form>
  );
}

export default SearchBar;
