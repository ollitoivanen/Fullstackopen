import React, { useEffect, useState } from "react";
import WeatherReport from "./WeatherReport";
import weatherService from "../services/weather";

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getCityWeather(country.capitalInfo.latlng)
      .then((capitalWeather) => {
        setWeather(capitalWeather);
      });
  }, []);

  const { capital, area, languages, flags } = country;
  if (!weather) return null;
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{`Capital: ${capital}`}</p>
      <p>{`Area: ${area}㎢`}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(languages).map((lang) => {
          return <li key={lang}>{lang}</li>;
        })}
      </ul>
      <img src={flags.png} />
      <WeatherReport weather={weather} />
    </div>
  );
};

export default CountryInfo;
