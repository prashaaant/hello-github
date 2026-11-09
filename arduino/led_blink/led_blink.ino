// CODE FOR LED BLINKING ARDUINO 
void setup() {
 
  pinMode(13, OUTPUT);   //13 pin OF ARDUINO is connected to positive pin of led
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
// both write functions will peerform the output operation
