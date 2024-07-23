from imutils.video import VideoStream
from flask import Flask, Response, render_template
import threading #allow threading for multiple clients at the same time
import imutils
import time
#UNNECESSARY THREADING?
#output frame needs to be locked to allow for safe access to the output frames resource through multiple clients
outFrame = None
myLock = threading.Lock()

app = Flask(__name__)
stream = VideoStream(src=1).start()
time.sleep(1)

@app.route("/")
def streamPage():
    return render_template("streamPage.html")

def generate():
    global outFrame, myLock
    
    while True:
        with myLock:
            if outFrame is None:
                continue
            
            #encode the video frame-by-frame as jpeg
            (successFlag, encodedPic) = cv2.imencode(".jpg", outFrame)
            if not successFlag:
                continue
        #yield the output frame
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedPic) + b'\r\n')
                  
#route with only the video feed
@app.route("/video")
def video():
    return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")
                  
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

#release the stream
stream.stop()