import React, { useEffect, useState } from "react";
import "./Forecast.css";
import cloudy from "../assets/cloudy.png"
import drizzle from "../assets/drizzle.png"
import humidity from "../assets/humidity.png"
import raining from "../assets/raining.png"
import snowflake from "../assets/snowflake.png"
import sun from "../assets/sun.png"
import wind from "../assets/wind.png"

function Forecast({ city, unit = "celsius" }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d": sun,
    "01n": sun,
    "02d": cloudy,
    "02n": cloudy,
    "03d": cloudy,
    "03n": cloudy,
    "04d": cloudy,
    "04n": cloudy,
    "09d": drizzle,
    "09n": drizzle,
    "10d": raining,
    "10n": raining,
    "13d": snowflake,
    "13n": snowflake,
  };

  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  }

  // Format temperature based on current unit
  const formatTemperature = (celsiusTemp) => {
    if (unit === "fahrenheit") {
      return Math.round(celsiusToFahrenheit(celsiusTemp));
    }
    return Math.round(celsiusTemp);
  }

  // Get temperature symbol
  const getTempSymbol = () => {
    return unit === "fahrenheit" ? "°F" : "°C";
  }

  useEffect(() => {
    if (!city) return;

    const fetchForecast = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_APP_ID;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
          console.log("Error:", data);
          setForecast([]);
          return;
        }

        // Aggregate min and max per day
        const dailyTemps = {};

        for (let item of data.list) {
          const date = new Date(item.dt_txt);
          const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

          if (!dailyTemps[dayKey]) {
            dailyTemps[dayKey] = {
              min: item.main.temp_min,
              max: item.main.temp_max,
              weather: item.weather[0],
            };
          } else {
            dailyTemps[dayKey].min = Math.min(dailyTemps[dayKey].min, item.main.temp_min);
            dailyTemps[dayKey].max = Math.max(dailyTemps[dayKey].max, item.main.temp_max);
          }
        }

        // Convert aggregated object to array for rendering
        const dailyData = Object.entries(dailyTemps)
          .slice(0, 5) // 5-day forecast
          .map(([date, info]) => ({
            dt_txt: date,
            main: { temp_min: info.min, temp_max: info.max },
            weather: [info.weather],
          }));

        setForecast(dailyData);
      } catch (error) {
        console.error("Error fetching forecast:", error);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, unit]);

  return (
    <div className="forecast">
      <h3 className="forecast-title">5-Day Forecast ({unit === "celsius" ? "°C" : "°F"})</h3>
      <div className="forecast-container">
        {loading ? (
          <p>Loading forecast...</p>
        ) : forecast.length > 0 ? (
          forecast.map((day, index) => {
            const icon = allIcons[day.weather[0].icon] || cloudy;
            return (
              <div key={index} className="forecast-day">
                <p className="forecast-dayname">
                  {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <img src={icon} alt="weather icon" className="forecast-icon" />
                <p className="forecast-temp">
                  {formatTemperature(day.main.temp_max)}° / {formatTemperature(day.main.temp_min)}°
                </p>
              </div>
            );
          })
        ) : (
          <p>No forecast data available</p>
        )}
      </div>
    </div>    
  );
}

export default Forecast;