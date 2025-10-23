import React, { useEffect, useState } from "react";
import "./Forecast.css";
import cloudy from "../assets/cloudy.png";
import drizzle from "../assets/drizzle.png";
import raining from "../assets/raining.png";
import snowflake from "../assets/snowflake.png";
import sun from "../assets/sun.png";

function Forecast({ city }) {
  const [forecast, setForecast] = useState([]);

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

  useEffect(() => {
    if (!city) return;

    const fetchForecast = async () => {
      try {
        const apiKey = import.meta.env.VITE_APP_ID;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== "200") {
          console.log("Error:", data);
          return;
        }

        const dailyData = [];
        const seenDays = new Set();

        for (let item of data.list) {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });

          if (!seenDays.has(day) && date.getHours() === 12) {
            seenDays.add(day);
            dailyData.push(item);
          }
        }

        setForecast(dailyData.slice(0, 7));
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchForecast();
  }, [city]); // <-- re-fetch when city changes

  return (
  <div className="forecast">
    <h3 className="forecast-title">7-Day Forecast</h3>
    <div className="forecast-container">
      {forecast.length > 0 ? (
        forecast.map((day, index) => {
          const icon = allIcons[day.weather[0].icon] || cloudy;
          return (
            <div key={index} className="forecast-day">
              <p className="forecast-dayname">
                {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <img src={icon} alt="weather icon" className="forecast-icon" />
              <p className="forecast-temp">
                {Math.round(day.main.temp_max)}° / {Math.round(day.main.temp_min)}°C
              </p>
            </div>
          );
        })
      ) : (
        <p>Loading forecast...</p>
      )}
    </div>
  </div>    
   );
 
}

export default Forecast;
