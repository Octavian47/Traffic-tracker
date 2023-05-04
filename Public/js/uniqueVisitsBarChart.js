// Get DOM elements
const form = document.querySelector('#unique-visits-form');
const chartContainer = document.querySelector('#unique-visits-bar-chart-container');
const chart = document.querySelector('#unique-visits-bar-chart');

// Define a function to fetch data from the server
const fetchData = async (startDate, endDate) => {
  try {
    // Make a GET request to the server with startDate and endDate query parameters
    const response = await fetch(`/uniquevisits?startDate=${startDate}&endDate=${endDate}`);
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    
    // Parse the response body as JSON and return the data
    const data = await response.json();
    return data;
  } catch (error) {
    // Log and re-throw any errors
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Define a function to render the chart with the received data
const renderChart = (labels, data) => {
  // Create a new Chart object with the chart canvas element
  const myChart = new Chart(chart, {
    type: 'bar',
    data: {
      // Set the labels and data for the chart
      labels: labels,
      datasets: [{
        label: 'Unique Visits per Page',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      // Configure the chart options
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Unique Visits per Page Title'
        }
      }
    }
  });
};

// Add a submit event listener to the form
form.addEventListener('submit', async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  
  // Get the start and end date values from the form
  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;
  
  // Fetch the data from the server
  const data = await fetchData(startDate, endDate);
  
  // Extract the labels and data from the response data
  const labels = data.map((item) => item.title);
  const uniqueVisits = data.map((item) => item.uniqueVisits);
  
  // Show the chart container
  chartContainer.style.display = 'block';
  
  // Render the chart with the extracted labels and data
  renderChart(labels, uniqueVisits);
});