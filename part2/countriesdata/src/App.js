import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CountriesList from "./components/CountriesList";
import CountryInfo from "./components/CountryInfo";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [resultCountries, setResultCountries] = useState([]);

  const loadCountries = () => {
    const url = "https://restcountries.com/v3.1/all";
    axios.get(url).then((result) => {
      setCountries(result.data);
    });
  };
  useEffect(loadCountries, []);

  useEffect(() => {
    findMatchingCountries();
  }, [searchTerm]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const findMatchingCountries = () => {
    if (searchTerm.length === 0) {
      setResultCountries([]);
      return;
    }
    const matchingCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResultCountries(matchingCountries);
  };

  const handleShowCountry = (country) => {
    const name = country.name.common;
    setSearchTerm(name);
    findMatchingCountries(name);
  };

  const renderCountries = () => {
    const countriesLength = resultCountries.length;
    if (countriesLength === 0) return <p>No results</p>;
    if (countriesLength === 1) {
      const country = resultCountries[0];
      return <CountryInfo country={country} />;
    }
    if (countriesLength <= 10)
      return (
        <CountriesList
          countries={resultCountries}
          handleClick={(country) => handleShowCountry(country)}
        />
      );
    return <p>Too many results</p>;
  };

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        handleChange={handleSearchTermChange}
      />
      {renderCountries()}
    </div>
  );
};

export default App;
