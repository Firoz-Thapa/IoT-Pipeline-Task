import machine
import dht
import time
import urequests

# DHT22 Sensor Setup (GPIO Pin 15)
dht_sensor = dht.DHT22(machine.Pin(15))

# Backend API Configuration
BACKEND_URL = "http://<your_backend_ip>:3001/api/data"

def read_sensors():
    try:
        # Read temperature and humidity from DHT22
        dht_sensor.measure()
        temperature = dht_sensor.temperature()
        humidity = dht_sensor.humidity()

        return {
            "temperature": temperature,
            "humidity": humidity
        }
    except Exception as e:
        print("Error reading sensor:", e)
        return None

def send_data_to_backend(data):
    try:
        response = urequests.post(BACKEND_URL, json=data)
        print("Data sent to backend:", response.text)
    except Exception as e:
        print("Error sending data to backend:", e)

# Main Loop
while True:
    sensor_data = read_sensors()
    if sensor_data:
        print("Sensor Data:", sensor_data)
        send_data_to_backend(sensor_data)
    time.sleep(5)  # Wait 5 seconds before the next reading
