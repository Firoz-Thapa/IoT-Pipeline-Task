const express = require('express');
const bodyParser = require('body-parser');
const Influx = require('influx');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// InfluxDB Configuration
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'iot_data',
    schema: [
        {
            measurement: 'temperature_readings',
            fields: {
                temperature: Influx.FieldType.FLOAT,
                humidity: Influx.FieldType.FLOAT,
            },
            tags: ['device'],
        },
    ],
});

// Ensure the database exists
influx.getDatabaseNames().then((names) => {
    if (!names.includes('iot_data')) {
        return influx.createDatabase('iot_data');
    }
});

// API Endpoint to receive data
app.post('/data', (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).send('Invalid data');
    }

    influx
        .writePoints([
            {
                measurement: 'temperature_readings',
                tags: { device: 'raspberry-pi' },
                fields: { temperature, humidity },
            },
        ])
        .then(() => res.status(200).send('Data stored successfully'))
        .catch((err) => res.status(500).send(err.message));
});

// API Endpoint to fetch data
app.get('/data', (req, res) => {
    influx
        .query('SELECT * FROM temperature_readings ORDER BY time DESC LIMIT 20')
        .then((results) => res.status(200).json(results))
        .catch((err) => res.status(500).send(err.message));
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
