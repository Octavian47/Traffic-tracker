const form = document.querySelector('#unique-visits-form');
const chartContainer = document.querySelector('#unique-visits-bar-chart-container');
const chart = document.querySelector('#unique-visits-bar-chart');

const fetchData = async (startDate, endDate) => {
  try {
    const response = await fetch(`/uniquevisits?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const renderChart = (labels, data) => {
  const myChart = new Chart(chart, {
    type: 'bar',
    data: {
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

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;
  const data = await fetchData(startDate, endDate);
  const labels = data.map((item) => item.title);
  const uniqueVisits = data.map((item) => item.uniqueVisits);
  chartContainer.style.display = 'block';
  renderChart(labels, uniqueVisits);
});

