#author: Anton Amstadt
#This is a flask server to serve up the web page for the video/controlling car 

from flask import Flask, render_template, Response, request
import cv2
import RPi.GPIO as GPIO

import time
from smbus2 import SMBus

import asyncio

#I2C car control setup
I2C_BUS = SMBus(1)

I2C_ADDRESS = 0x18
I2C_COMMAND = 0xff

# Motor
I2C_STOP     = 0x210A
I2C_FORWARD  = 0x220A
I2C_BACKWARD = 0x230A
I2C_LEFT     = 0x240A
I2C_RIGHT    = 0x250A

I2C_LEFT_SPEED_SLOW  = 0x2605
I2C_LEFT_SPEED_FAST  = 0x260A
I2C_RIGHT_SPEED_SLOW = 0x2705
I2C_RIGHT_SPEED_FAST = 0x270A


I2C_HEADLIGHT_LEFT_OFF  = 0x3600
I2C_HEADLIGHT_LEFT_ON   = 0x3601
I2C_HEADLIGHT_RIGHT_OFF = 0x3700
I2C_HEADLIGHT_RIGHT_ON  = 0x3701
# I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_LEFT_SPEED_FAST)
# time.sleep(0.01)
# I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_RIGHT_SPEED_FAST)
# time.sleep(0.01)
# I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_FORWARD)
# time.sleep(0.5)
# I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_STOP)
# time.sleep(0.01)

#seconds since epoch for time of most recent http post for each direction
#moveTimes = [1, 0, 0, 0, 0] # [stop, forward, back, left, right]


app = Flask(__name__)

#sometimes needs 0, other times 1
camera = cv2.VideoCapture(0)

def indexOfMax(moveTimes):
    index = 0
    maxVal = -1
    for x in range(len(moveTimes)):
        if moveTimes[x] > maxVal:
            index = x
            maxVal = moveTimes[x]
    return index

#add movement later
# async def movementLoop():
#     while True:
#         print(moveTimes)
#         await asyncio.sleep(0.3)
# asyncio.run(movementLoop())

def gen_frames():  # generate frame by frame from camera
    while True:
        # Capture frame-by-frame
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        print(request.get('direction'))
    else:
        """Video streaming home page."""
        return render_template('buttons.html')

@app.route('/postPlace', methods=['GET', 'POST'])
async def postPlace():
    if request.method == 'POST':
        print(request.json)
        #the return value doesn't matter to us, but there must be a response
        direction = request.json.get('dir')
        print(direction)
        
        #movement here
        if direction == 'stop':
            #moveTimes[0] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_STOP)
        elif direction == 'forward':
            #moveTimes[1] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_FORWARD)
        elif direction == 'back':
            #moveTimes[2] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_BACKWARD)
        elif direction == 'left':
            #moveTimes[3] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_LEFT)
        elif direction == 'right':
            #moveTimes[4] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_RIGHT)
        elif direction == 'lightsOn':
            #moveTimes[4] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_HEADLIGHT_LEFT_ON)
            await asyncio.sleep(0.01)
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_HEADLIGHT_RIGHT_ON)
        elif direction == 'lightsOff':
            #moveTimes[4] = int(time.time())
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_HEADLIGHT_LEFT_OFF)
            await asyncio.sleep(0.01)
            I2C_BUS.write_word_data(I2C_ADDRESS, I2C_COMMAND, I2C_HEADLIGHT_RIGHT_OFF)
        elif direction == 'camDown':
            I2C_BUS.write_word_data(I2C_ADDRESS,I2C_COMMAND,2048)
        elif direction == 'camUp':
            I2C_BUS.write_word_data(I2C_ADDRESS,I2C_COMMAND,2140)

            
            
        
        return request.json
    else:
        """Video streaming home page."""
        return render_template('buttons.html')   
        

#run the app on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)