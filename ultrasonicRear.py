# import RPi.GPIO as GPIO
# import time
# 
# GPIO.setmode(GPIO.BCM)
# 
# GPIO_ECHO = 24
# GPIO_TRIG = 23
# GPIO.setup(GPIO_TRIG, GPIO.OUT, initial=1)
# GPIO.output(GPIO_TRIG,1)
# time.sleep(0.01)
# GPIO.output(GPIO_TRIG,0)
# time.sleep(0.01)
# GPIO.setup(GPIO_ECHO, GPIO.IN)
# SPEED_OF_SOUND_INCHES_PER_SEC = 1125.3 * 12.0
# 
# try:
#     for i in range(10):
#         pulse_start = None
#         pulse_end = None
#         pulse_width = 0.0
# 
#         time.sleep(0.00001)
#         GPIO.output(GPIO_TRIG, True)
#         time.sleep(0.00001)
#         GPIO.output(GPIO_TRIG, False)
# 
#         while GPIO.input(GPIO_ECHO) == 0:
#             pulse_start = time.time()
# 
#         if pulse_start:
#             while GPIO.input(GPIO_ECHO) == 1:
#                 pulse_end = time.time()
# 
#             pulse_width = pulse_end - pulse_start
#             distance = (pulse_width / 2.0) * SPEED_OF_SOUND_INCHES_PER_SEC
#                     
#             print(f"Object distance: {distance:0.1f} inches")
#         else:
#             print("pulse_start is false")
# except KeyboardInterrupt:
#     print("ctrl c pressed")
# except:
#     print("non-ctrl-c error")
# finally:
#     GPIO.cleanup()

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO_ECHO = 24
GPIO_TRIG = 23
GPIO.setup(GPIO_TRIG, GPIO.OUT, initial=1)
GPIO.output(GPIO_TRIG,1)
time.sleep(0.01)
GPIO.output(GPIO_TRIG,0)
time.sleep(0.01)
GPIO.setup(GPIO_ECHO, GPIO.IN)
SPEED_OF_SOUND_INCHES_PER_SEC = 1125.3 * 12.0


for i in range(10):
    pulse_start = None
    pulse_end = None
    pulse_width = 0.0

    time.sleep(0.00001)
    GPIO.output(GPIO_TRIG, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIG, False)

#infinite loop sometimes, fix this
    while GPIO.input(GPIO_ECHO) == 0:
        pulse_start = time.time()

    if pulse_start:
        while GPIO.input(GPIO_ECHO) == 1:
            pulse_end = time.time()

        pulse_width = pulse_end - pulse_start
        distance = (pulse_width / 2.0) * SPEED_OF_SOUND_INCHES_PER_SEC
                
        print(f"Object distance: {distance:0.1f} inches")
    else:
        print("pulse_start is false")