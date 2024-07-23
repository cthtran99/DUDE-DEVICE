#author: Anton Amstadt
#digits.py controls the 4 digit output and the traffic light in a loop

import tm1637
import time
import numpy as np
from datetime import datetime
from gpiozero import CPUTemperature
import RPi.GPIO as GPIO
import signal
# import os

tm = tm1637.TM1637(clk=18,dio=17)
clear = [0,0,0,0]

#traffic setup
GREEN = 5
YELLOW = 6
RED = 13

GPIO.setmode(GPIO.BCM)
GPIO.setup(GREEN, GPIO.OUT)
GPIO.setup(YELLOW, GPIO.OUT)
GPIO.setup(RED, GPIO.OUT)

GPIO.output(YELLOW, False)
GPIO.output(RED, False)
GPIO.output(GREEN, False)

try:
    while True:
        GPIO.output(RED, True)
        #display string
        tm.write(clear)
        time.sleep(0.3)
        str = 'TEAM DUDAGON'
        tm.scroll(str,delay=250)

        #display CPU temp
        tm.write(clear)
        GPIO.output(RED, False)
        GPIO.output(YELLOW, True)
        time.sleep(0.5)
        cpu = CPUTemperature()
        tm.temperature(int(np.round(cpu.temperature)))
        time.sleep(0.5)
        GPIO.output(YELLOW, True)

        #display current time
        tm.write(clear)
        time.sleep(0.5)
        GPIO.output(YELLOW, False)
        GPIO.output(GREEN, True)
        now = datetime.now()
        hh = int(datetime.strftime(now, '%H'))
        mm = int(datetime.strftime(now,'%M'))
        tm.numbers(hh, mm, colon=True)
        time.sleep(0.5)
        tm.write(clear)
        GPIO.output(GREEN, False)
        
#turn off lights and clear the digit output when Ctrl+C pressed
except KeyboardInterrupt:
    tm.write(clear)
    GPIO.output(YELLOW, False)
    GPIO.output(RED, False)
    GPIO.output(GREEN, False)

