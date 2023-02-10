import React from "react";

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <>
      <p>Filter by name</p>
      <input value={filter} onChange={handleFilterChange} />
    </>
  );
};

export default Filter;
