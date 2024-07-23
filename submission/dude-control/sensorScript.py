#author: Anton Amstadt
#sensor script is a loop that collects data from sensors and sends to database

import asyncio

import time
from datetime import datetime
import board
import adafruit_dht
import statistics
import os
import json
import requests
import motor.motor_asyncio

import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

#ultrasonic setup
GPIO_ECHO = 5
GPIO_TRIG = 6
GPIO.setup(GPIO_TRIG, GPIO.OUT, initial=1)
GPIO.output(GPIO_TRIG,1)
time.sleep(0.01)
GPIO.output(GPIO_TRIG,0)
time.sleep(0.01)
GPIO.setup(GPIO_ECHO, GPIO.IN)
SPEED_OF_SOUND_INCHES_PER_SEC = 1125.3 * 12.0

GPIO_ECHO_REAR = 24
GPIO_TRIG_REAR = 23
GPIO.setup(GPIO_TRIG_REAR , GPIO.OUT, initial=1)
GPIO.output(GPIO_TRIG_REAR,1)
time.sleep(0.01)
GPIO.output(GPIO_TRIG_REAR,0)
time.sleep(0.01)
GPIO.setup(GPIO_ECHO_REAR, GPIO.IN)




dhtDevice = adafruit_dht.DHT11(board.D4)

#when another process/the user writes anything to this file, the program terminates
open('runningFile.txt', 'w').close()

# def getTimestamp():
#     curTime = datetime.now()
#     curTimestamp = str(curTime.month)
#     curTimestamp += '/'
#     curTimestamp += str(curTime.day)
#     curTimestamp += '/'
#     curTimestamp += str(curTime.year)
#     curTimestamp += ' '
#     curTimestamp += str(curTime.hour)
#     curTimestamp += ':'
#     curTimestamp += str(curTime.minute)
#     return curTimestamp
    

async def main():
    #connect to db
    cStr = 'mongodb+srv://dudagon:dudagon@dude.0qxouen.mongodb.net/?retryWrites=true&w=majority'
    client = motor.motor_asyncio.AsyncIOMotorClient(cStr, serverSelectionTimeoutMS=10000)
    
    try:
        #print(await client.server_info())
        db = client['production']
        tempCollection = db['temp']
        frontDistCollection = db['frontDist']
        rearDistCollection = db['rearDist']
        humidityCollection = db['humidity']
        #await insertTemp(db)
        
    except Exception:
        print('connection to db failed')
        #traceback.print_exc()
        
      
    #get distance front
    ultrasonicTimeout = 0.5
    running = True
    while running:
        tempDict = {}
        humidityDict = {}
        frontDistDict = {}
        rearDistDict = {}
        
        distances = []
        for i in range(10):
            pulse_start = None
            pulse_end = None
            pulse_width = 0.0

            time.sleep(0.00001)
            GPIO.output(GPIO_TRIG, 1)
            time.sleep(0.00001)
            GPIO.output(GPIO_TRIG, 0)
            
            start = time.time()
            end = start
            while GPIO.input(GPIO_ECHO) == 0 and end - start < ultrasonicTimeout:
                pulse_start = time.time()
                end = time.time()

            if pulse_start:
                while GPIO.input(GPIO_ECHO) == 1 and end - start < ultrasonicTimeout:
                    pulse_end = time.time()
                    end = time.time()
                if pulse_end and end - start < ultrasonicTimeout:
                    pulse_width = pulse_end - pulse_start
                    distance = (pulse_width / 2.0) * SPEED_OF_SOUND_INCHES_PER_SEC
                        
                    print(f"front distance: {distance:0.1f} inches")
                    distances.insert(len(distances), distance)
        
        if len(distances) > 0:
            med = statistics.median(distances)
            #myMed = str(med)
            print(distances)
            print(f"Median distance: {med:0.1f} inches")
            frontDistDict["frontDist"] = round(med, 1)
            frontDistDict["timestamp"] = datetime.utcnow()
            #frontJSON = json.dumps(frontDistDict)
            result = await db.frontDist.insert_one(frontDistDict)
        else:
            #frontDistDict["frontDist"] = -1
            print('frontDist failed')
        
        await asyncio.sleep(0.05)
        
        distancesRear = []
        
        for i in range(10):
            pulse_start = None
            pulse_end = None
            pulse_width = 0.0

            time.sleep(0.00001)
            GPIO.output(GPIO_TRIG_REAR, True)
            time.sleep(0.00001)
            GPIO.output(GPIO_TRIG_REAR, False)

        #infinite loop sometimes, fix this -- condition in 'while' for elapsed time
            start = time.time()
            end = start
            distanceFound = False
            while GPIO.input(GPIO_ECHO_REAR) == 0 and end - start < ultrasonicTimeout:
                pulse_start = time.time()
                end = time.time()

            if pulse_start:
                while GPIO.input(GPIO_ECHO_REAR) == 1 and end - start < ultrasonicTimeout:
                    pulse_end = time.time()
                    end = time.time()
                if pulse_end and end - start < ultrasonicTimeout:
                    pulse_width = pulse_end - pulse_start
                    distance = (pulse_width / 2.0) * SPEED_OF_SOUND_INCHES_PER_SEC
                            
                    print(f"rear distance: {distance:0.1f} inches")
                    distancesRear.insert(len(distancesRear), distance)
                    
            else:
                print("pulse_start is false")
                
            
        if len(distancesRear) > 0:
            med = statistics.median(distancesRear)
            #myMed = str(med)
            print(distancesRear)
            print(f"Median distance: {med:0.1f} inches")
            #jsonDict["rearDist"] = round(med, 1)
            rearDistDict["rearDist"] = round(med, 1)
            rearDistDict["timestamp"] = datetime.utcnow()
            #frontJSON = json.dumps(frontDistDict)
            result = await db.rearDist.insert_one(rearDistDict)
        else:
            #jsonDict["rearDist"] = -1
            print('rear dist fail')
        
        
        await asyncio.sleep(1)
        
        #get temp and humidity
        try:
            temp_c = dhtDevice.temperature
            temp_f = temp_c * (9/5) + 32
            humidity = dhtDevice.humidity
            print("Temp: {:.1f} F / {:.1f} C    Humidity: {}% ".format(temp_f, temp_c, humidity))
            tempDict["temp"] = round(temp_f, 1)
            humidityDict["humidity"] = round(humidity, 1)
            tempDict["timestamp"] = datetime.utcnow()
            humidityDict["timestamp"] = datetime.utcnow()
            #send to db
            await db.temp.insert_one(tempDict)
            await db.humidity.insert_one(humidityDict)
            print('temp,humidity insert')
        except RuntimeError as error:
            print(error.args[0])
            #jsonDict["temp"] = -123456
            #jsonDict["humidity"] = -1
            ##dhtDevice.exit()
            ##raise error
            
        #myJson = json.dumps(jsonDict)
        #response = requests.post('https://antonamstadt.com/postPlace', json=myJson)
        #print(response.status_code)
        await asyncio.sleep(2)
        if os.path.getsize('runningFile.txt') > 0:
            running = False
    print('file contents not empty, loop exit success')
    
asyncio.run(main())