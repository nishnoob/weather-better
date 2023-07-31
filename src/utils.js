export function getCurrentLocationString() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
  
            // Use a reverse geocoding service to get the location string
            const geocodingApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            fetch(geocodingApiUrl)
              .then((response) => response.json())
              .then((data) => {
                console.log("LOC", data)
                const locationString = data?.address?.city;
                resolve(locationString);
              })
              .catch((error) => reject(error));
          },
          (error) => {
            reject(new Error('Unable to retrieve your location.'));
          }
        );
      }
    });
  }

export  function getCurrentTimeAndDay() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayOfWeek = daysOfWeek[now.getDay()];
  
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // Convert 0 to 12
  
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    const currentTimeAndDay = `${dayOfWeek} ${hours}:${minutes}${ampm}`;
  
    return currentTimeAndDay;
  }
  
  
  