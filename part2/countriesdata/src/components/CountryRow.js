import React from "react";

const CountryRow = ({ name, handleClick }) => {
  return (
    <p>
      {name} <button onClick={handleClick}>show</button>
    </p>
  );
};

export default CountryRow;
