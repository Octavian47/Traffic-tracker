const form = document.querySelector('#stats-form');
const lineChart = document.querySelector('#line-chart');
const lineChartContainer = document.querySelector('#line-chart-container');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;

  try {
    const response = await fetch(`/stats?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    const dates = data.map((row) => row.date);
    const visits = data.map((row) => row.visits);

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

    lineChartContainer.classList.remove('hidden');

  } catch (error) {
    console.error('Error fetching visit statistics:', error);
    alert('Failed to fetch visit statistics');
  }
});
