'use client'
import axios from 'axios';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faSun, faWind, faThermometerHalf, faCloudSun, faDroplet } from '@fortawesome/free-solid-svg-icons';

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

  const getWeatherIcon = (weather: string): JSX.Element => {
    switch (weather.toLowerCase()) {
      case 'clouds':
        return <FontAwesomeIcon style={{color: "#2259b9"}} size="lg" icon={faCloud} />;
      case 'clear':
        return <FontAwesomeIcon style={{color: "#2259b9"}} size="lg" icon={faSun} />;
      case 'haze':
        return <FontAwesomeIcon style={{color: "#2259b9"}} size="lg" icon={faCloudSun} />;
      default:
        return <div />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-60 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-lg w-96 p-8 backdrop-filter backdrop-blur-sm bg-opacity-70">
        <form onSubmit={handleSubmit} className='flex items-center justify-center gap-2'>
            <input
              type="text"
              id="place"
              name="place"
              className="h-fit py-2 pl-2 text-sm text-black border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter a place"
              value={place}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="h-fit text-sm whitespace-nowrap bg-blue-500 text-white rounded-md px-4 py-2 transition-colors duration-300 hover:bg-blue-600"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
        </form>
        {/* Display weather data if available */}
        {data && !error && (
          <div className="mt-4 flex flex-col items-center">
            <div className='flex flex-col justify-center'>
                <div>{data.location}</div>
                <div>Monday 12:00pm</div>
            </div>
            <div className="flex justify-evenly gap-2 w-full mt-4 flex-wrap">
              <div className="flex items-center bg-white text-neutral-900 rounded p-2 h-fit w-5/12">
                <div className='pr-3'>{getWeatherIcon(data.weather)}</div>
                <div>
                  <div className='text-xs text-neutral-600'>Weather</div>
                  {data.weather}
                </div>
              </div>
              <div className="flex items-center bg-white text-neutral-900 rounded p-2 h-fit w-5/12">
                <div className='pr-3'><FontAwesomeIcon style={{color: "#2259b9"}} icon={faThermometerHalf} size="lg" /></div>
                <div>
                  <div className='text-xs text-neutral-600'>Temperature</div>
                  {data.temperature}°C
                </div>
              </div>
              <div className="flex items-center bg-white text-neutral-900 rounded p-2 w-5/12 h-fit">
                <div className='pr-3'><FontAwesomeIcon icon={faWind} style={{color: "#2259b9"}} size="lg" /></div>
                <div>
                  <div className='text-xs text-neutral-600'>Wind Speed</div>
                  {data.windSpeed} m/s
                </div>
              </div>
              <div className="flex items-center bg-white text-neutral-900 rounded p-2 w-5/12 h-fit">
                <div className='pr-3'><FontAwesomeIcon icon={faDroplet} style={{color: "#2259b9"}} size="lg" /></div>
                <div>
                  <div className='text-xs text-neutral-600'>Humidity</div>
                  {data.humidity} %
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Display loading state */}
        {loading && !data && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Loading weather data...</p>
          </div>
        )}
        {/* Display error state */}
        {!loading && error && !data && (
          <div className="mt-4">
            <p className="text-red-500">Error fetching weather data. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
