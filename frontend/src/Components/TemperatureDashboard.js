import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import './TemperatureDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TemperatureDashboard = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 3,
                pointRadius: 4,
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Humidity (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 3,
                pointRadius: 4,
                tension: 0.4,
                fill: true,
            },
        ],
    });

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');

        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const temperatureData = data.temperature || [];
            const humidityData = data.humidity || [];

            const newTimestamps = temperatureData.map((item) =>
                new Date(item.timestamp).toLocaleTimeString()
            );
            const newTemperatures = temperatureData.map((item) => item.value);
            const newHumidities = humidityData.map((item) => item.value);

            setChartData((prevState) => ({
                labels: [...prevState.labels, ...newTimestamps].slice(-10), // Keep last 10 timestamps
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: [...prevState.datasets[0].data, ...newTemperatures].slice(-10),
                    },
                    {
                        ...prevState.datasets[1],
                        data: [...prevState.datasets[1].data, ...newHumidities].slice(-10),
                    },
                ],
            }));
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error.message);
        };

        return () => socket.close(); // Clean up WebSocket on component unmount
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>IoT Monitoring Dashboard</h1>
                <p>Accurately track temperature and humidity over time</p>
            </div>
            <div className="chart-card">
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 14,
                                        family: 'Arial, sans-serif',
                                    },
                                    color: '#555',
                                },
                            },
                            title: {
                                display: true,
                                text: 'Temperature and Humidity Over Time',
                                font: {
                                    size: 20,
                                    family: 'Arial, sans-serif',
                                    weight: 'bold',
                                },
                                color: '#333',
                            },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 12 },
                                padding: 10,
                                cornerRadius: 6,
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time (HH:MM:SS)',
                                    font: {
                                        size: 14,
                                        weight: 'bold',
                                        family: 'Arial, sans-serif',
                                    },
                                    color: '#555',
                                },
                                ticks: {
                                    color: '#666',
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.5)', // Light gridlines
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Values',
                                    font: {
                                        size: 14,
                                        weight: 'bold',
                                        family: 'Arial, sans-serif',
                                    },
                                    color: '#555',
                                },
                                ticks: {
                                    color: '#666',
                                    stepSize: 5,
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.5)', // Light gridlines
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TemperatureDashboard;
