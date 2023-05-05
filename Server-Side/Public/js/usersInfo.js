const form = document.querySelector('#stats-form');
const tbody = document.querySelector('tbody');

// Listen to the form submit event
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get the start and end dates from the form elements
  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;

  try {
    // Fetch data from the server using the provided start and end dates
    const response = await fetch(`/stats?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    // Clear the table body
    tbody.innerHTML = '';

    // Iterate over the data and create a table row for each item
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.ip}</td>
        <td>${JSON.stringify(row.deviceInfo)}</td>
        <td>${row.visits}</td>
        <td>${row.date}</td>
        <td>${row.duration}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error fetching visit statistics:', error);
    alert('Failed to fetch visit statistics');
  }
});