'use client'
import axios from 'axios';
import React, { useState } from 'react';

interface WeatherData {
  location: string;
  weather: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const App: React.FC = () => {
  const [place, setPlace] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setPlace(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData(null);
    setLoading(true);
    try {
      const resp = await axios.get<WeatherData>(`http://127.0.0.1:3000/api/weather/${place}`);
      setData(resp.data);
    } catch (error:any) {
      console.error('Error fetching weather data:', error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-60 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-lg w-96 p-8 backdrop-filter backdrop-blur-sm bg-opacity-70">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="place" className="block text-sm font-medium text-gray-700">
              Place
            </label>
            <input
              type="text"
              id="place"
              name="place"
              className="mt-1 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter a place"
              value={place}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md px-4 py-2 transition-colors duration-300 hover:bg-blue-600"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
        </form>
        {/* Display weather data if available */}
        {data && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Weather Data:</h3>
            <p>
              Location: {data.location}
              <br />
              Weather: {data.weather}
              <br />
              Temperature: {data.temperature}°C
              <br />
              Humidity: {data.humidity}%
              <br />
              Wind Speed: {data.windSpeed} m/s
            </p>
          </div>
        )}
        {/* Display loading state */}
        {loading && !data && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Loading weather data...</p>
          </div>
        )}
        {/* Display error state */}
        {!loading && !data && error && (
          <div className="mt-4">
            <p className="text-red-500">Error fetching weather data. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
