import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeatherByCity = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      setWeather(data);
    } catch {
      setError("Location access denied. Search manually.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        fetchWeatherByLocation(
          pos.coords.latitude,
          pos.coords.longitude
        );
      },
      () => setError("Enable location or search manually")
    );
  }, []);

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <h1>Weather</h1>
          <p>Real-time weather updates</p>
        </header>

        <div className="search">
          <input
            type="text"
            placeholder="Search city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeatherByCity(city)}>
            Search
          </button>
        </div>

        {loading && <p className="status">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather">
            <h2>{weather.name}</h2>
            <div className="temp">
              {Math.round(weather.main.temp)}°C
            </div>

            <div className="details">
              <div>
                <span>Condition</span>
                <p>{weather.weather[0].description}</p>
              </div>
              <div>
                <span>Humidity</span>
                <p>{weather.main.humidity}%</p>
              </div>
              <div>
                <span>Wind</span>
                <p>{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
