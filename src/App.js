import { useState, useEffect } from "react";
import Cities from "./cities-fr.json";
import axios from "axios";
import "./App.css";

function App() {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({});
  const [weekday, setWeekDay] = useState([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);

  const handleChange = (city) => {
    let lat = Cities.filter((el) => el.nm === city)[0].lat;
    let lon = Cities.filter((el) => el.nm === city)[0].lon;

    setIsLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e571468d909ed70637365a26b56931ea&units=metric&lang=fr&cnt=40&exclude=hourly,minutely`;
    axios.get(url).then((res) => {
      setWeather(res.data);
      console.log("forcast data-", res.data);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    handleChange("Abbeville");
  }, []);
  useEffect(() => {
    let weatherData = {};
    if (weather.list) {
      weatherData.currentWeatherIcon = `https://openweathermap.org/img/wn/${weather?.list[0]?.weather[0]?.icon}.png`;
      weatherData.currentWeatherTemp = weather?.list[0]?.main?.temp;

      weather.list
        .filter((el) => el.dt_txt.includes("12:00:00"))
        .map((el, index) => {
          if (index < 3) {
            weatherData[index] = {};
            let dayNumber = new Date(el.dt_txt.substring(0, 10)).getDay(); // get day of the week
            weatherData[index].date = weekday[dayNumber];
            weatherData[
              index
            ].weatherIcon = `https://openweathermap.org/img/wn/${el.weather[0].icon}.png`;
            weatherData[index].weatherTempMin = el.main.temp_min;
            weatherData[index].weatherTempMax = el.main.temp_max;
          }
        });
    }
    console.log("weather data-", weatherData);
    setWeatherInfo(weatherData);
  }, [weather]);

  return (
    <div className="wrapper">
      <div className="weather-widget">
        <select
          className="city-selector"
          onChange={(e) => handleChange(e.target.value)}
        >
          {Cities.map((city, index) => {
            return <option key={index}>{city.nm}</option>;
          })}
        </select>
        {isLoading ? (
          <div className="weather-data-wrapper">
            <img
              width="50px"
              height="40px"
              src="https://media.giphy.com/media/17mNCcKU1mJlrbXodo/giphy.gif"
            />
          </div>
        ) : (
          <div className="weather-data-wrapper">
            <h1 className="wheaterh-city">{weather?.city?.name}</h1>
            <div className="weather-info">
              <div className="weather-icon">
                <img src={weatherInfo.currentWeatherIcon} alt="weather icon" />
              </div>
            </div>
            <div className="weather-info">
              <div className="weather-temp">
                {weatherInfo.currentWeatherTemp}°C
              </div>
            </div>
            <div className="forcast-container">
              {Object.keys(weatherInfo).map((el, index) => {
                if (index < 3) {
                  return (
                    <div className="forcast-item" key={index}>
                      <div className="forcast-date">{weatherInfo[el].date}</div>
                      <div className="forcast-icon">
                        <img
                          src={weatherInfo[el].weatherIcon}
                          alt="weather icon"
                        />
                      </div>
                      <div className="weather-temp">
                        {weatherInfo[el].weatherTempMin}°C -{" "}
                      </div>
                      <div className="weather-temp">
                        {weatherInfo[el].weatherTempMax}°C -{" "}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
