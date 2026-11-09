char bluetooth;
void setup()
{
  pinMode(4,OUTPUT); //declare pin 4 as output pin
  pinMode(3,OUTPUT); //declare pin 3 as output pin
  Serial.begin(9600); 
}
void loop() 
{
   if(Serial.available())
   {
    bluetooth= Serial.read();
    Serial.println(bluetooth);
    if(bluetooth == 'F')
     {
     digitalWrite(4,LOW); // connect a led to pin 4 
     }
     else 
     if(bluetooth == 'B')
     {
      digitalWrite(3,HIGH);
     }
   }
}
