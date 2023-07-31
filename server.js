const express = require('express');
const next = require('next');
const apiRoutes = require('./src/api/weather');
const cors = require('cors');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

nextApp.prepare().then(() => {
  const server = express();

   // Enable CORS for all routes
   server.use(cors());

  // Use the API routes
  server.use('/api', apiRoutes);

  // Handle all other requests using Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
