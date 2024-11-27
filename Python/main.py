import machine
import dht
import urequests
import time

# Setup sensor and Wi-Fi
sensor = dht.DHT22(machine.Pin(15))  # Use GPIO15 for DHT data pin
wifi_ssid = 'Your_SSID'
wifi_password = 'Your_PASSWORD'
server_url = 'http://<your-server-ip>:80/data'

def connect_wifi():
    import network
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        pass
    print('Connected to WiFi:', wlan.ifconfig())

def send_data(temp, humidity):
    data = {'temperature': temp, 'humidity': humidity}
    response = urequests.post(server_url, json=data)
    print('Data sent:', response.text)

# Main loop
connect_wifi()
while True:
    try:
        sensor.measure()
        temp = sensor.temperature()
        humidity = sensor.humidity()
        print(f'Temp: {temp}, Humidity: {humidity}')
        send_data(temp, humidity)
        time.sleep(60)  # Send data every minute
    except Exception as e:
        print('Error:', e)
