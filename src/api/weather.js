const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

router.get('/weather/:location', async (req, res) => {
  try {
    const location = req.params.location || 'London,uk';
    const apiKey = process.env.API_KEY;

    // Make the API call to OpenWeatherMap
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`
    );

    // Extract relevant weather data from the response
    const weatherData = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      weather: response.data.weather[0].description,
      location: response.data.name,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

module.exports = router;
