import React, { useEffect, useRef, useState } from "react"
import "./CurrentWeather.css"
import searchIcon from "../assets/search.png"
import cloudy from "../assets/cloudy.png"
import drizzle from "../assets/drizzle.png"
import humidityIcon from "../assets/humidity.png"
import raining from "../assets/raining.png"
import snowflake from "../assets/snowflake.png"
import sun from "../assets/sun.png"
import windIcon from "../assets/wind.png"

export default function CurrentWeather({ city, setCity, unit, setUnit }) {
    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(null);
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
    }

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

    const searchWeather = async(city) => {
        if(city === "") {
            alert("Please Enter City Name");
            return;
        }
        setLoading(true);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.cod !== 200) {
                alert("City not found. Please try again.");
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || cloudy;
            const description = data.weather[0].main;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: data.main.temp, // Store original Celsius value
                location: data.name,
                icon: icon, 
                description: description
            });
            setCity(data.name);

        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Error fetching weather data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const toggleUnit = () => {
        setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
    }

    useEffect(() =>{
        searchWeather(city);
    },[city]) // Run when city changes

    const handleSearch = () => {
        if (inputRef.current && inputRef.current.value.trim() !== "") {
            setCity(inputRef.current.value);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="weather">
            <div className="search-bar">
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder="Enter City"
                    onKeyPress={handleKeyPress}
                    defaultValue={city}
                />
                <img 
                    className="search-icon" 
                    src={searchIcon} 
                    alt="Search" 
                    onClick={handleSearch} 
                />
            </div>

            {/* Unit Toggle Button */}
            <div className="unit-toggle">
                <button 
                    className={`toggle-btn ${unit === "celsius" ? "active" : ""}`}
                    onClick={() => setUnit("celsius")}
                >
                    °C
                </button>
                <button 
                    className={`toggle-btn ${unit === "fahrenheit" ? "active" : ""}`}
                    onClick={() => setUnit("fahrenheit")}
                >
                    °F
                </button>
            </div>
            
            {loading ? (
                <p>Loading...</p>
            ) : weatherData ? (
                <>
                    <img className="weather-icon" src={weatherData.icon} alt="weather-icon" />
                    <p className="description">{weatherData.description}</p>
                    <p className="temperature">
                        {formatTemperature(weatherData.temperature)}{getTempSymbol()}
                    </p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col"> 
                            <img className="humidity-icon" src={humidityIcon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col"> 
                            <img className="wind-icon" src={windIcon} alt="Wind" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No weather data available</p>
            )}
        </div>
    )
}