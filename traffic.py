#uses GPIO pins to light up LEDs on the traffic light
import RPi.GPIO as GPIO
import time

GREEN = 5
YELLOW = 6
RED = 13

#setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(GREEN, GPIO.OUT)
GPIO.setup(YELLOW, GPIO.OUT)
GPIO.setup(RED, GPIO.OUT)

#cycle through colors on the lights
GPIO.output(GREEN, True)
time.sleep(0.1)
GPIO.output(GREEN, False)
GPIO.output(YELLOW, True)
time.sleep(0.1)
GPIO.output(YELLOW, False)
GPIO.output(RED, True)
time.sleep(0.1)
GPIO.output(RED,False)
GPIO.output(GREEN, True)
time.sleep(0.1)
GPIO.output(GREEN, False)
GPIO.output(YELLOW, True)
time.sleep(0.1)
GPIO.output(YELLOW, False)
GPIO.output(RED, True)
time.sleep(0.1)
GPIO.output(RED,False)
GPIO.output(GREEN, True)
time.sleep(0.1)
GPIO.output(GREEN, False)
GPIO.output(YELLOW, True)
time.sleep(0.1)
GPIO.output(YELLOW, False)
GPIO.output(RED, True)
time.sleep(0.1)
GPIO.output(RED,False)
