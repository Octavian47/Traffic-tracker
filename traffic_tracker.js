(function() {
    // Replace with the server URL where the tracking data will be sent
    const serverUrl = 'http://localhost:3000/track';
  
    // Get the current page URL
    const pageUrl = window.location.href;
  
    // Get the user agent string from the browser
    const userAgent = navigator.userAgent;
  
    // Record the time when the user entered the page
    const startTime = new Date().getTime();
  
    // Function to send the tracking data to the server
    const sendTrackingData = () => {
      // Calculate the time spent on the page
      const timeSpent = new Date().getTime() - startTime;
  
      // Create a new Image object to send a GET request to the server
      const img = new Image();
  
      // Set the 'src' attribute of the Image object to the server URL with the appropriate query parameters
      // encodeURIComponent is used to properly encode the URL, user agent string, and time spent for safe transmission
      img.src = `${serverUrl}?u=${encodeURIComponent(pageUrl)}&ua=${encodeURIComponent(userAgent)}&ts=${encodeURIComponent(timeSpent)}`;
    };
  
    // Attach the sendTrackingData function to the window's unload or beforeunload event
    window.addEventListener('unload', sendTrackingData);
    window.addEventListener('beforeunload', sendTrackingData);
  })();