import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import './App.css';

function App() {
  const [city, setCity] = useState('Atlanta');
  const [unit, setUnit] = useState('celsius');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <div className="app">
        <button 
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <CurrentWeather 
          city={city} 
          setCity={setCity} 
          unit={unit}
          setUnit={setUnit}
        />
        {city && <Forecast city={city} unit={unit} />}
      </div>
    </div>
  );
}

export default App;