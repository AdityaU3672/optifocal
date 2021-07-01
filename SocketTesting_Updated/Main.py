from flask import Flask, render_template, request, jsonify, Response
import numpy as np
import cv2
from flask_socketio import SocketIO, emit
import droid_eyes as DE
import io
import base64
from io import StringIO
#from PIL import Image

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
x = "inpt.jpg"
vals = ["horizontal", "vertical", "pitch", "yaw", "roll", "startpt", "endpt"]

global_camera = DE.attn_detector()

@app.route('/')
def home():
    global_camera.reset()
    return render_template("video.html")

# @socketio.on('testing')
# def lfrm(inpt):
#     print(inpt)


# @socketio.on("reset")
# def resetcam():
#     global_camera.reset()

#Updates when there's a new frame
@socketio.on("newframe")
def loadframe(image):
    #print("image received")
    jdata = global_camera.update(base64.b64decode(image))
    print(jdata)
    jdict = {t: v for (t, v) in zip(vals, jdata)}
    print(jdict)
    emit("variables", jdict)

    #global x
    
    #f = open(x, "wb")
    #f.write(base64.b64decode(image))
    #f.close()

    #x = "wow.jpg"

    # img_str = fd.read()
    # fd.close()

    # fd = open('timg.jpg', 'rb')
    # img_str = fd.read()
    # fd.close()

    # nparr = np.frombuffer(image.decode(), np.uint8)
    # img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # cv2.imshow('RGB',img_np)
    # cv2.waitKey(0)

    #print(image)

#Returns the most recently processed frame
def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

#same as before
@app.route('/video_feed')
def video_feed():
    #global global_camera
    
    return Response(gen(global_camera),
            mimetype='multipart/x-mixed-replace; boundary=frame')

# @socketio.on('input image')
# def test_message(input):
#     print("\n\nBEGIN", input, "\n\nEND")


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1',port='5000',debug=True)