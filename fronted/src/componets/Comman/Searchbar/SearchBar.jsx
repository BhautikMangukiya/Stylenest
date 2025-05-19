import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handalSearch = (e) => {
    e.preventDefault();
    console.log("\n Serch Term:",searchTerm)
    
  };

  return (
    <form onSubmit={handalSearch} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-submit-btn">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
