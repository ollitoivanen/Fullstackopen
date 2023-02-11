import React from "react";
import CountryRow from "./CountryRow";

const CountriesList = ({ countries, handleClick }) => {
  return (
    <ul>
      {countries.map((country) => {
        return (
          <CountryRow
            key={country.name.common}
            name={country.name.common}
            handleClick={() => handleClick(country)}
          />
        );
      })}
    </ul>
  );
};

export default CountriesList;
