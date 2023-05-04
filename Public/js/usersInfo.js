const form = document.querySelector('#stats-form');
const tbody = document.querySelector('tbody');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const startDate = form.elements['start-date'].value;
  const endDate = form.elements['end-date'].value;

  try {
    const response = await fetch(`/stats?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    tbody.innerHTML = '';

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