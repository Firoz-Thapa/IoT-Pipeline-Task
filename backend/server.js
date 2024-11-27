const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const influx = new InfluxDB({ url: 'http://localhost:8086', token: 'your-token' });
const writeApi = influx.getWriteApi('org', 'iot_data');

app.post('/data', (req, res) => {
    const { temperature, humidity } = req.body;
    console.log(`Received: Temp=${temperature}, Humidity=${humidity}`);

    const point = new Point('environment')
        .floatField('temperature', temperature)
        .floatField('humidity', humidity);
    writeApi.writePoint(point);

    res.status(200).send('Data stored');
});
