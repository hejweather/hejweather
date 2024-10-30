import React, { useState } from 'react';
import clearBg from './assets/clear-bg.png';
import cloudBg from './assets/clouds-bg.png';
import drizzleBg from './assets/drizzle-bg.png';
import mistBg from './assets/mist-bg.png';
import rainBg from './assets/rain-bg.png';
import snowBg from './assets/snow-bg.png';
import thunderstormBg from './assets/thunderstorm-bg.png';

const api = {
  base: "https://api.openweathermap.org/data/2.5/"
}

const backgroundImages = {
  Clear: clearBg,
  Clouds: cloudBg,
  Drizzle: drizzleBg,
  Mist: mistBg,
  Rain: rainBg,
  Snow: snowBg,
  Thunderstorm: thunderstormBg
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "Mars", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  const backgroundImage = {
    backgroundImage: weather.weather
    ? `url(${backgroundImages[weather.weather[0].main || clearBg]})`
    : `url(${clearBg})`,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    height: "100vh"
  };

  return (
    <div className="app" style={backgroundImage}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {typeof weather.main !== "undefined" ? (
        <div>
        <div className="location-box">
          <div className="location">{weather.name}, {weather.sys.country}</div>
          <div className="date">{dateBuilder(new Date())}</div>
        </div>
        <div className="weather-box">
          <div className="temp">
            {Math.round(weather.main.temp)}°c
          </div>
          <div className="weather">{weather.weather[0].main}</div>
        </div>
        </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
