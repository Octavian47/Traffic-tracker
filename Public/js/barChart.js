// Retrieve data from stats endpoint
async function fetchData(startDate, endDate) {
    try {
      const response = await fetch(`/stats?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching visit statistics:', error);
      alert('Failed to fetch visit statistics');
    }
  }
  
  // Group data by page URL and count visits
  function groupData(data) {
    const grouped = {};
    data.forEach((row) => {
      const url = row.url;
      const visits = row.visits;
      if (url && visits) {
        if (!grouped[url]) {
          grouped[url] = 0;
        }
        grouped[url] += visits;
      }
    });
    return grouped;
  }
  
  // Create bar chart
  function createBarChart(data) {
    const labels = Object.keys(data);
    const values = Object.values(data);
  
    const ctx = document.getElementById('bar-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Visits',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  
  // Fetch data and create chart on form submit
  const form = document.querySelector('#stats-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const startDate = form.elements['start-date'].value;
    const endDate = form.elements['end-date'].value;
    const data = await fetchData(startDate, endDate);
    const groupedData = groupData(data);
    createBarChart(groupedData);
  });
  