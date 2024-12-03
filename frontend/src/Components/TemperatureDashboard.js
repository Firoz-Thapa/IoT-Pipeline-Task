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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TemperatureDashboard = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for testing
        const mockData = [
            { time: '2024-12-03T10:00:00Z', temperature: 25.5, humidity: 60 },
            { time: '2024-12-03T10:10:00Z', temperature: 26.0, humidity: 59 },
            { time: '2024-12-03T10:20:00Z', temperature: 24.8, humidity: 62 },
            { time: '2024-12-03T10:30:00Z', temperature: 25.1, humidity: 61 },
            { time: '2024-12-03T10:40:00Z', temperature: 25.8, humidity: 63 },
        ];

        formatChartData(mockData);
        setLoading(false);
    }, []);

    const formatChartData = (data) => {
        const timestamps = data.map((item) => new Date(item.time).toLocaleTimeString());
        const temperatures = data.map((item) => item.temperature);
        const humidities = data.map((item) => item.humidity);

        setChartData({
            labels: timestamps,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 3,
                    pointRadius: 4,
                    tension: 0.4, // Smooth curve
                    fill: true, // Area under curve
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 3,
                    pointRadius: 4,
                    tension: 0.4, // Smooth curve
                    fill: true, // Area under curve
                },
            ],
        });
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>IoT Monitoring Dashboard</h1>
                <p>Accurately track temperature and humidity over time</p>
            </div>
            <div className="chart-card">
                {loading ? (
                    <p className="loading-text">Loading chart data...</p>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default TemperatureDashboard;
