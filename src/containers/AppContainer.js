import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import WeatherInfo from "../components/WeatherInfo";
import RecommendationBox from "../components/RecommendationBox";
import { dateBuilder } from "../utils/dateBuilder";
import clearBg from "../assets/clear-bg.png";
import cloudBg from "../assets/clouds-bg.png";
import drizzleBg from "../assets/drizzle-bg.png";
import mistBg from "../assets/mist-bg.png";
import rainBg from "../assets/rain-bg.png";
import snowBg from "../assets/snow-bg.png";
import thunderstormBg from "../assets/thunderstorm-bg.png";

const AppContainer = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [recommendation, setRecommendation] = useState("");

  const backgroundImages = {
    Clear: clearBg,
    Clouds: cloudBg,
    Drizzle: drizzleBg,
    Fog: mistBg,
    Mist: mistBg,
    Rain: rainBg,
    Snow: snowBg,
    Thunderstorm: thunderstormBg,
  };

  const api = {
    weatherBase: "https://api.openweathermap.org/data/2.5/", // Hardcoded as in the original
  };

  const search = async (evt) => {
    if (evt.key === "Enter") {
      try {
        const weatherResponse = await fetch(
          `${api.weatherBase}weather?q=${query}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`
        );

        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
        setQuery("");

        const roundedTemp = Math.round(weatherData.main.temp);
        const prompt = `Give me a two-sentence recommendation on what to wear and something fun to do if the weather is ${roundedTemp}°C and ${weatherData.weather[0].description}. Keep it positive! =)`;

        const openAIResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_CHATGPT_API_KEY}`,
            },
          }
        );

        setRecommendation(openAIResponse.data.choices[0].message.content);
      } catch (error) {
        console.error("Error fetching weather or OpenAI response:", error);
      }
    }
  };

  const backgroundImage = {
    backgroundImage: weather.weather
      ? `url(${backgroundImages[weather.weather[0].main || "Clear"]})`
      : `url(${clearBg})`,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    height: "100vh",
  };

  return (
    <div className="app" style={backgroundImage}>
      <Header />
      <main>
        <SearchBox
          query={query}
          onQueryChange={(e) => setQuery(e.target.value)}
          onSearch={search}
        />
        {typeof weather.main !== "undefined" && (
          <WeatherInfo weather={weather} date={dateBuilder(new Date())} />
        )}
        {recommendation && <RecommendationBox recommendation={recommendation} />}
      </main>
    </div>
  );
};

export default AppContainer;
