#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

    #define FACTORYRESET_ENABLE         1
    #define MINIMUM_FIRMWARE_VERSION    "0.6.6"
    #define MODE_LED_BEHAVIOUR          "MODE"
/*=========================================================================*/

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

Adafruit_BNO055 bno = Adafruit_BNO055(55);

/* ...hardware SPI, using SCK/MOSI/MISO hardware SPI pins and then user selected CS/IRQ/RST */
Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

// Pulsador
int pulState = 1;
int pulLastVal = 0;

void setup(void){

  Serial.begin(115200);
  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) ){
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  if ( FACTORYRESET_ENABLE ){
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ){
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();
 /* Print Bluefruit information */
  ble.info();
  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Initialise the sensor GYROS */
  while(!bno.begin()){
    /* There was a problem detecting the BNO055 ... check your connections */
    Serial.println("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    delay(200);
  }
  bno.setExtCrystalUse(true);

  // Wait for calibration
  uint8_t system, gyro, accel, mag;
  system = gyro = accel = mag = 0;
  bno.getCalibration(&system, &gyro, &accel, &mag);
  while (gyro != 3) {
    bno.getCalibration(&system, &gyro, &accel, &mag);
    Serial.println(F("Wait for calibration "));
    delay(500);
  }

  /* Wait for connection */
  while (! ble.isConnected()) {
      Serial.println(F("Wait for device "));
      delay(500);
  }

  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) ){
    // Change LED Activity to BLEUART_LED_BEHAVIOUR
    Serial.println(F("******************************"));
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
    Serial.println(F("******************************"));
  }
}

void fillStrToSend(float value, char* str) {
  char spaceX10[] = ":123456789";
  char spaceX9[] = ":12345678";
  char spaceX8[] = ":1234567";
  char spaceX7[] = ":123456";
  char spaceX6[] = ":12345";
  char spaceX5[] = ":1234";
  // si es negativo y 5 cifras
  if (value < -100.00) {
    sprintf(str+14, spaceX6);
  }// si tiene 3 cifras
  else if (value < -10.00) {
    sprintf(str+13, spaceX7);
  } // si tiene 3 cifras
  else if (value < 0.00) {
    sprintf(str+12, spaceX8);
  }// si tiene 3 cifras
  else if (value < 10.00) {
    sprintf(str+11, spaceX9);
  } // si tiene 4 cifras
  else if (value < 100.00) {
    sprintf(str+12, spaceX8);
  } // si tiene 5 cifras
  else{
    sprintf(str+13, spaceX7);
  }
}

void loop(void){

   // char inputs[BUFSIZE+1];
   char inputs[20+1];
   // char inputs[BUFSIZE+1];
   char spaceX10[] = ":123456789";
   char spaceX9[] = ":12345678";
   char spaceX8[] = ":1234567";
   char spaceX5[] = ":1234";
   int num = 12;

   if(ble.isConnected()) {

    // Serial.println("CONNECTED");

    // Sensor Gyros
    sensors_event_t event;
    bno.getEvent(&event);
    // imu::Vector<3> vector = bno.getVector(Adafruit_BNO055::VECTOR_EULER);

    // Sensor Slider
    int valueSlider = analogRead(A0);

    // Sensor Pulsador
    int pulVal = digitalRead(9);
    // Serial.println(pulVal);
    if (pulVal&&!pulLastVal) pulState =! pulState;
    pulLastVal = pulVal;

    // envío de datos
    ble.setMode(BLUEFRUIT_MODE_DATA);

    // tienen que ser de 20caracteres
    sprintf(inputs,"slider:%4d%s", valueSlider, spaceX9);
    // sprintf(inputs,"slider:%3d%s", 10, spaceX10);
    ble.print(inputs);
    // Serial.println(inputs);

    sprintf(inputs,"button:  %1d%s", pulState, spaceX10);
    // sprintf(inputs,"button:  %1d%s", 0, spaceX10);
    ble.print(inputs);
    // Serial.println(inputs);

    sprintf(inputs,"gyrosX:");
    float posX = event.orientation.x; // event.orientation.x;
    dtostrf(posX, 4, 2, inputs+7);
    fillStrToSend(posX, inputs);
    // sprintf(inputs,"gyrosX:%4d%s", 10, spaceX9);
    ble.print(inputs);
    // Serial.println(inputs);
    // Serial.println(posX);

    sprintf(inputs,"gyrosY:");
    float posY = event.orientation.y; // event.orientation.x;
    dtostrf(posY, 4, 2, inputs+7);
    fillStrToSend(posY, inputs);
    // sprintf(inputs,"gyrosY:%4d%s", 10, spaceX9);
    ble.print(inputs);
    // Serial.println(inputs);
    // Serial.println(posY);

    sprintf(inputs,"gyrosZ:");
    float posZ = event.orientation.z; // event.orientation.x;
    dtostrf(posZ, 4, 2, inputs+7);
    fillStrToSend(posZ, inputs);
    // sprintf(inputs,"gyrosZ:%4d%s", 10, spaceX9);
    ble.print(inputs);
    // Serial.println(inputs);
    // Serial.println(posZ);

  }

  delay(50);

}
