import React from "react";
import arrowIcon from "../assets/arrow-icon.png";

const WeatherInfo = ({ weather, date }) => (
  <div>
    <div className="location-box">
      <div className="location">{weather.name}, {weather.sys.country}</div>
      <div className="date">{date}</div>
    </div>
    <div className="weather-box">
      <div className="temp">{Math.round(weather.main.temp)}°c</div>
      <div className="weather">{weather.weather[0].main}</div>
    </div>
    <div className="wind-box">
      <div className="wind-speed-and-direction">
        <span className="wind-speed">
          {Math.round(weather.wind.speed)} m/s
          {weather.wind.gust > 10 && ` (${Math.round(weather.wind.gust)} m/s)`}
        </span>
        <div className="wind-direction">
          <img
            src={arrowIcon}
            alt="Wind direction"
            style={{ transform: `rotate(${weather.wind.deg + 90}deg)` }}
            className="wind-icon"
          />
        </div>
      </div>
    </div>
  </div>
);

export default WeatherInfo;
