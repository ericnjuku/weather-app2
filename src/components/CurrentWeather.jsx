import React, { useEffect, useRef, useState } from "react"
import "./CurrentWeather.css"
import search from "../assets/search.png"
import cloudy from "../assets/cloudy.png"
import drizzle from "../assets/drizzle.png"
import humidity from "../assets/humidity.png"
import raining from "../assets/raining.png"
import snowflake from "../assets/snowflake.png"
import sun from "../assets/sun.png"
import wind from "../assets/wind.png"

export default function CurrentWeather() {

    const inputRef = useRef()

    const [weatherData, setWeatherData] = useState(false);

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

    const search = async(city) => {
        if(city === "") {
            alert("Please Enter City Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            const icon = allIcons[data.weather[0].icon]
            const description = data.weather[0].main
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon, 
                description: description
            })
            setCity(data.name);

        } catch (error) {
            
        }
    }

    useEffect(() =>{
        search("Atlanta");
    },[])

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref = {inputRef} type="text" placeholder="Enter City"/>
                <img className="search-icon" src={search} alt="" onClick={() => search(inputRef.current.value)} />
            </div>
            <img className = {"weather-icon"} src={weatherData.icon} alt="sunny-icon" />
            <p className = "description" >{weatherData.description}</p>
            <p className = "temperature">{weatherData.temperature}°c</p>
            <p className = "location" >{weatherData.location}</p>
            <div className="weather-data">
                <div className = "col"> 
                    <img className = "humidity-icon" src={humidity} alt = ""/>
                    <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className = "col"> 
                    <img className = "wind-icon" src={wind} alt = ""/>
                    <div>
                        <p>{weatherData.windSpeed} Km/h %</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </div>
    )
}