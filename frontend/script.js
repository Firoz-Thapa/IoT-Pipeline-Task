// Backend API URL
const API_URL = 'http://<your-server-ip>/data'; // Replace <your-server-ip> with the VPS IP

// HTML Elements
const tempElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');

// Chart.js Initialization
const ctx = document.getElementById('dataChart').getContext('2d');
const dataChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: 'Humidity (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            },
        ],
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                },
            },
        },
    },
});

// Fetch Data from the Backend
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Update text values
        tempElement.textContent = data.temperature;
        humidityElement.textContent = data.humidity;

        // Update Chart
        const timestamp = new Date().toLocaleTimeString();
        dataChart.data.labels.push(timestamp);
        dataChart.data.datasets[0].data.push(data.temperature);
        dataChart.data.datasets[1].data.push(data.humidity);
        dataChart.update();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch data every 10 seconds
setInterval(fetchData, 10000);

// Initial Fetch
fetchData();
