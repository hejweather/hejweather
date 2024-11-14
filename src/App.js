// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import clearBg from './assets/clear-bg.png';
import cloudBg from './assets/clouds-bg.png';
import drizzleBg from './assets/drizzle-bg.png';
import mistBg from './assets/mist-bg.png';
import rainBg from './assets/rain-bg.png';
import snowBg from './assets/snow-bg.png';
import thunderstormBg from './assets/thunderstorm-bg.png';
import arrowIcon from './assets/arrow-icon.png'; 

// API URLs and API keys
const api = {
  weatherBase: "https://api.openweathermap.org/data/2.5/",
};
const OPENAI_API_KEY = process.env.REACT_APP_CHATGPT_API_KEY;

const backgroundImages = {
  Clear: clearBg,
  Clouds: cloudBg,
  Drizzle: drizzleBg,
  Fog: mistBg,
  Mist: mistBg,
  Rain: rainBg,
  Snow: snowBg,
  Thunderstorm: thunderstormBg
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [recommendation, setRecommendation] = useState(''); // For OpenAI response
  
  // Search weather function
  const search = async (evt) => {
    if (evt.key === "Enter") {
      try {
        const weatherResponse = await fetch(`${api.weatherBase}weather?q=${query}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
        setQuery('');
        
        // Call OpenAI API with weather data to get recommendation
        const roundedTemp = Math.round(weatherData.main.temp);
        const prompt = `Give me a two-sentence recommendation on what to wear and something fun to do if the weather is ${roundedTemp}°C and ${weatherData.weather[0].description}. keep it positive!=)`;
        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,  // Limiting tokens to keep the response brief

        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          }
        });
        
        setRecommendation(openAIResponse.data.choices[0].message.content); // Set the recommendation text
      } catch (error) {
        console.error("Error fetching weather or OpenAI response:", error);
      }
    }
  };

  // Date builder function
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const backgroundImage = {
    backgroundImage: weather.weather
      ? `url(${backgroundImages[weather.weather[0].main || 'Clear']})`
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
            <div className="wind-box">
              <div className="wind-speed-and-direction">
                <span className="wind-speed">Wind: {Math.round(weather.wind.speed)} m/s</span>
                  <div className="wind-direction">
                    <img src={arrowIcon}
                      alt="Wind direction"
                      style={{ transform: `rotate(${weather.wind.deg + 90}deg)` }}
                      className="wind-icon"
                    />
                  </div>
              </div>
            </div>
          </div>
        ) : ('')}
        
        {recommendation && (
          <div className="recommendation-box">
            <h3>Recommendation</h3>
            <p>{recommendation}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
