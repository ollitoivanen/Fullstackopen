import React from "react";

const WeatherReport = ({ weather }) => {
  return (
    <div>
      <h2>{`Weather in ${weather.name}`}</h2>
      <p>{`Temperature ${(weather.main.temp - 273.15).toFixed(2)} Celsius`}</p>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      ></img>
      <p>{`Wind ${weather.wind.speed} m/s`}</p>
    </div>
  );
};

export default WeatherReport;
