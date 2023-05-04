// Select the HTML elements
const form = document.querySelector('#stats-form');
const lineChart = document.querySelector('#line-chart');
const lineChartContainer = document.querySelector('#line-chart-container');

// Add event listener to form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get the start date and end date values from the form
  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;

  try {
    // Fetch data from the API using the start and end date values
    const response = await fetch(`/stats?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    // Extract dates and visits data from the response data
    const dates = data.map((row) => row.date);
    const visits = data.map((row) => row.visits);

    // Create a new chart instance with the extracted data
    const chart = new Chart(lineChart, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Number of Visits',
          data: visits,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Show the chart container if it was previously hidden
    lineChartContainer.classList.remove('hidden');

  } catch (error) {
    console.error('Error fetching visit statistics:', error);
    alert('Failed to fetch visit statistics');
  }
});
