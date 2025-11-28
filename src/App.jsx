import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('Atlanta'); // default city
  const [unit, setUnit] = useState('celsius'); // unit state

  return (
    <div className="app">
      <CurrentWeather 
        city={city} 
        setCity={setCity} 
        unit={unit}
        setUnit={setUnit}
      />
      {city && <Forecast city={city} unit={unit} />}
    </div>
  );
}

export default App;