import axios from "axios";

const getCityWeather = async (latlng) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${process.env.REACT_APP_API_KEY}`;
  const request = axios.get(url);
  return request.then((res) => res.data);
};

export default { getCityWeather };
