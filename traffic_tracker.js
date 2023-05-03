(function() {
  // Replace with the server URL where the tracking data will be sent
  const serverUrl = 'http://localhost:3000/improvedTracking';

  // Get the current page URL
  const pageUrl = window.location.href;

  // Get the user agent string from the browser
  const userAgent = navigator.userAgent;

  // Record the time when the user entered the page
  const startTime = new Date().getTime();

  // Record the page title
  const pageTitle = document.title;

  // Add a timer to track the time spent on each page
  let timeSpent = 0;
  const timer = setInterval(() => {
    timeSpent += 1;
  }, 1000);

  // Function to send the tracking data to the server
  const sendTrackingData = () => {
    // Stop the timer and calculate the time spent on the page
    clearInterval(timer);
    const timeOnPage = Math.round((new Date().getTime() - startTime + timeSpent * 1000) / 1000);

    // Create a new Image object to send a GET request to the server
    const img = new Image();

    // Set the 'src' attribute of the Image object to the server URL with the appropriate query parameters
    // encodeURIComponent is used to properly encode the URL, user agent string, and time spent for safe transmission
    img.src = `${serverUrl}?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&ua=${encodeURIComponent(userAgent)}&time=${encodeURIComponent(timeOnPage)}`;
  };

  // Attach the sendTrackingData function to the window's unload or beforeunload event
  window.addEventListener('unload', sendTrackingData);
  window.addEventListener('beforeunload', sendTrackingData);
})();