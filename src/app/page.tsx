'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getCurrentLocationString, getCurrentTimeAndDay} from '../utils';
import { faWind, faThermometerHalf, faDroplet, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Loader from './loader';
import { Rain } from 'react-rainfall';

interface WeatherData {
  location: string;
  weather: {
    id: number
    main: string
    description: string
    icon: string
  };
  temperature: number;
  humidity: number;
  windSpeed: number;
}

const App: React.FC = () => {
  const [place, setPlace] = useState('');
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRain, setShowRain] = useState(false);

  useEffect(()=> {
    // Fetching current city
    getCurrentLocationString()
      .then((locationString) => {
        console.log('Current Location:', locationString);
        setPlace(locationString);
        getData(locationString);
      })
      .catch((error) => console.error('Error:', error.message));
  }, []);

  const getData = async (override?: string) => {
    setData(null);
    setLoading(true);
    try {
      const resp = await axios.get<WeatherData>(`http://127.0.0.1:3000/api/weather/${override || place}`);
      setData(resp.data);
      // Assuming that it's raining. Could add better support for visuals
      setShowRain(true);
    } catch (error:any) {
      console.error('Error fetching weather data:', error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setPlace(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getData();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-60 backdrop-blur-md">
      {showRain && <Rain />}
      <div className="bg-white rounded-lg shadow-lg w-fit p-8 backdrop-filter backdrop-blur-sm bg-opacity-70 text-center">
        <h1 className='text-3xl text-neutral-600 font-bold'>Weather Better</h1>
        <p className='mb-6'>Check wheather it&apos;s any better</p>
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
        {data && !error && (
          <>
            <div className='w-full h-1 border-b border-neutral-400 my-4' />
            <div className="flex flex-col items-center">
              <div className='flex flex-col text-left gap-2 mb-4'>
                <div>
                  <FontAwesomeIcon className='mr-2' style={{color: "#2259b9"}} icon={faLocationDot} size="lg" />
                  {data.location}
                </div>
                <div>
                  <FontAwesomeIcon className='mr-1' style={{color: "#2259b9"}} icon={faClock} size="lg" />
                  {getCurrentTimeAndDay()}
                </div>
              </div>
              <div className="bg-white text-neutral-900 rounded p-2 h-fit w-full flex items-center">
                <div className='flex-1 flex justify-center'>
                  <Image src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`} alt={'weather icon'} width={42} height={42} />
                </div>
                <div className='text-left flex-1'>
                  <div className='text-xs text-neutral-600'>Condition</div>
                  {data.weather.main}
                </div>
                <div className='text-left flex-1'>
                  <div className='text-xs text-neutral-600'>Description</div>
                  {data.weather.description}
                </div>
              </div>
              <div className="flex justify-evenly gap-2 w-full mt-2">
                <div className="flex items-center bg-white text-neutral-900 rounded p-2 h-fit flex-1">
                  <div className='pr-3'><FontAwesomeIcon style={{color: "#2259b9"}} icon={faThermometerHalf} size="lg" /></div>
                  <div>
                    <div className='text-xs text-neutral-600'>Temperature</div>
                    {data.temperature}°C
                  </div>
                </div>
                <div className="flex items-center bg-white text-neutral-900 rounded p-2 flex-1 h-fit">
                  <div className='pr-3'><FontAwesomeIcon icon={faWind} style={{color: "#2259b9"}} size="lg" /></div>
                  <div>
                    <div className='text-xs text-neutral-600 text-ellipsis whitespace-nowrap'>Wind Speed</div>
                    {data.windSpeed} m/s
                  </div>
                </div>
                <div className="flex items-center bg-white text-neutral-900 rounded p-2 flex-1 h-fit">
                  <div className='pr-3'><FontAwesomeIcon icon={faDroplet} style={{color: "#2259b9"}} size="lg" /></div>
                  <div>
                    <div className='text-xs text-neutral-600'>Humidity</div>
                    {data.humidity} %
                  </div>
                </div>
              </div>
              <div className='w-full h-1 border-b border-neutral-400 my-4' />
              <div className='bg-neutral-500 rounded p-2 w-full flex items-center'>
                <div className='flex mr-4'>
                  <Image  src="swiggy-1.svg" alt={''} width={18} height={18} />
                  <Image  src="uber-4.svg" alt={''} width={24} height={24} />
                </div>
                <div>
                  Expect delay in road transport services
                </div>
              </div>
            </div>
          </>
        )}
        {/* Display loading state */}
        {loading && !data && (
          <div className='mt-4'>
            <Loader />
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
