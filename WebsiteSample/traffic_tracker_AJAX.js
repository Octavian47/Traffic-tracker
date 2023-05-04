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
  
    // Function to send the tracking data to the server using AJAX
    const sendTrackingData = () => {
      // Stop the timer and calculate the time spent on the page
      clearInterval(timer);
      const timeOnPage = Math.round((new Date().getTime() - startTime + timeSpent * 1000) / 1000);
  
      // Use AJAX to send the tracking data to the server
      $.ajax({
        method: 'POST',
        url: serverUrl,
        data: {
          url: pageUrl,
          title: pageTitle,
          ua: userAgent,
          time: timeOnPage
        }
      });
    };
  
    // Attach the sendTrackingData function to the window's unload or beforeunload event
    window.addEventListener('unload', sendTrackingData);
    window.addEventListener('beforeunload', sendTrackingData);
  })();