import React from "react";

const SearchBar = ({ searchTerm, handleChange }) => {
  return (
    <div>
      <p>Find countries</p>
      <input value={searchTerm} onChange={handleChange}></input>
    </div>
  );
};

export default SearchBar;
