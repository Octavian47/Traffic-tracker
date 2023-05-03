document.getElementById('date-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Get the start and end dates from the form inputs
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    // Fetch the visit data from the /stats endpoint using the start and end dates
    const response = await fetch(`/stats?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`);
    const data = await response.json();
    
    // Get the table body element and clear its contents
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    // Create and append table rows for each visit data entry
    data.forEach((entry) => {
      const row = document.createElement('tr');
      
      // Add table cells for each data field
      const idCell = document.createElement('td');
      idCell.textContent = entry.id;
      row.appendChild(idCell);
      
      const urlCell = document.createElement('td');
      urlCell.textContent = entry.url;
      row.appendChild(urlCell);
      
      const ipCell = document.createElement('td');
      ipCell.textContent = entry.ip;
      row.appendChild(ipCell);
      
      const deviceTypeCell = document.createElement('td');
      deviceTypeCell.textContent = entry.deviceType;
      row.appendChild(deviceTypeCell);
      
      const userAgentCell = document.createElement('td');
      userAgentCell.textContent = entry.userAgent;
      row.appendChild(userAgentCell);
      
      const visitsCell = document.createElement('td');
      visitsCell.textContent = entry.visits;
      row.appendChild(visitsCell);
      
      const dateCell = document.createElement('td');
      dateCell.textContent = entry.date;
      row.appendChild(dateCell);
      
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  });