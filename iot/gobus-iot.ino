#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SoftwareSerial.h>
#include <TinyGPS++.h>

const char* ssid = "Ini hospot"; //Wifi SSID
const char* password = "gaadapassword"; //Wifi Password

const unsigned int writeInterval = 5000; // write interval (in ms)
// static const int RXPin = D2, TXPin = D1;
static const int RXPin = 4, TXPin = 5; 
// GPS-Module baud setting
static const uint32_t GPSBaud = 9600;
//MQTT server config
const char* mqttServer = "135.181.26.148";
const int mqttPort = 1885;
const char* mqttUser = "MQTTUSERNAME";
const char* mqttPassword = "MQTTPassword?";
const char* pubTopic = "publish/gps";

// objects
WiFiClient espClient;
PubSubClient client(espClient);
TinyGPSPlus gps; // The TinyGPS++ object
SoftwareSerial ss(4,5); // The serial connection to the GPS device

// setup 
void setup() {
  Serial.begin(115200);
  Serial.println("*****************************************************");
  Serial.println("Program Start : ESP8266 publishes GPS position over MQTT");
  Serial.print("Connected to the WiFi network");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("Connecting to WiFi.");
  }
  Serial.println("");
  Serial.println("->WiFi connected");
  Serial.println("->IP address: ");
  Serial.println(WiFi.localIP());
  
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  // GPS baud rate
  ss.begin(GPSBaud);
}

// loop
void loop() {
  if (!client.connected())
    reconnect();
    client.loop();
  // This sketch displays information every time a new sentence is correctly encoded.
  while (ss.available() > 0)
    if (gps.encode(ss.read()))
      displayInfo();
  
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(F("No GPS detected: check wiring."));
    while(true);
  }
}

// GPS displayInfo
void displayInfo() {
  if (gps.location.isValid()) {
    double latitude = (gps.location.lat());
    double longitude = (gps.location.lng());
    Serial.print("LAT:  ");
    Serial.println(latitude, 6);  // float to x decimal places
    Serial.print("LONG: ");
    Serial.println(longitude, 6);
    Serial.println("********** Publish MQTT data");
    char mqtt_payload[55] = "";
    snprintf (mqtt_payload, 55, "{\"latitude\": %lf,\"longitude\": %lf}", latitude, longitude);
    Serial.print("Publish message: ");
    Serial.println(mqtt_payload);
    client.publish(pubTopic, mqtt_payload);
    Serial.println("> MQTT data published");
    Serial.println("********** End ");
    Serial.println("*****************************************************");
    delay(writeInterval);// delay
  } else {
    Serial.println(F("INVALID"));
  }
}

//MQTT callback
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

//MQTT reconnect
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("********** Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client", mqttUser, mqttPassword )) {
      Serial.println("-> MQTT client connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("-> try again in 5 seconds");
    // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}