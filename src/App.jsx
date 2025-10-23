import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('Atlanta'); // default city

  return (
    <div className="app">
      <CurrentWeather city={city} setCity={setCity} />
      {city && <Forecast city={city} />}
    </div>
  );
}

export default App;
