import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// InfluxDB Configuration
const url = 'Your url';
const token = 'your token';
const org = 'your organization';
const bucket = 'your bucket';

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

// Express App and Server Setup
const app = express();
const server = createServer(app);

// WebSocket Server Setup
const wss = new WebSocketServer({ server });

// Data Arrays to Store Recent Readings
const temperatureReadings = [];
const humidityReadings = [];

// Function to Write Dummy Data to InfluxDB
function writeDummyData() {
  const temperature = Math.random() * 40; // Random temperature (0-40°C)
  const humidity = Math.random() * 100; // Random humidity (0-100%)
  const timestamp = new Date();

  // Write temperature to InfluxDB
  const tempPoint = new Point('temperature')
    .floatField('value', temperature)
    .timestamp(timestamp);

  writeApi.writePoint(tempPoint);
  console.log(`[INFO] Wrote temperature data: ${temperature.toFixed(2)}°C`);

  // Write humidity to InfluxDB
  const humidityPoint = new Point('humidity')
    .floatField('value', humidity)
    .timestamp(timestamp);

  writeApi.writePoint(humidityPoint);
  console.log(`[INFO] Wrote humidity data: ${humidity.toFixed(2)}%`);

  // Update Recent Readings Arrays
  temperatureReadings.push({ timestamp, value: temperature });
  humidityReadings.push({ timestamp, value: humidity });

  // Keep Only the Last 10 Readings
  if (temperatureReadings.length > 10) temperatureReadings.shift();
  if (humidityReadings.length > 10) humidityReadings.shift();
}

// Function to Query Sensor Data from InfluxDB
async function getSensorData(sensorType) {
  const fluxQuery = `
    from(bucket:"${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "${sensorType}")
      |> last()
  `;

  try {
    const result = await queryApi.collectRows(fluxQuery);
    return result.map(row => ({
      timestamp: row._time,
      value: row._value,
    }));
  } catch (error) {
    console.error(`[ERROR] Query failed for ${sensorType}:`, error.message);
    return [];
  }
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  console.log('[INFO] New client connected.');

  // Send Initial Data to Connected Client
  ws.send(JSON.stringify({ temperature: temperatureReadings, humidity: humidityReadings }));

  ws.on('close', () => {
    console.log('[INFO] Client disconnected.');
  });

  ws.on('error', (error) => {
    console.error('[ERROR] WebSocket error:', error.message);
  });
});

// Broadcast Updated Data to All Connected Clients
function broadcastData() {
  const payload = JSON.stringify({ temperature: temperatureReadings, humidity: humidityReadings });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Set Interval to Generate and Broadcast Dummy Data
setInterval(() => {
  writeDummyData();
  broadcastData();
}, 5000);

// Express Route for Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Start the Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});
