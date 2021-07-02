from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from droid_eyes_web import attn_detector
import base64

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

vals = ["horizontal", "vertical", "pitch", "yaw", "roll", "startpt", "endpt"]
cameras = {}


@app.route('/')
def home():
    return render_template("video.html")

@socketio.on('connect')
def gen_key():
    print("CONNECTED TO:", request.sid)
    cameras[request.sid] = attn_detector()

@socketio.on('disconnect')
def del_key():
    print("DISCONNECTED FROM:", request.sid, cameras[request.sid])
    cameras.pop(request.sid, None)


#Updates when there's a new frame
@socketio.on("newframe")
def loadframe(image):
    print("image received from: ", request.sid)
    jdata = cameras[request.sid].update(base64.b64decode(image))
    jdict = {t: v for (t, v) in zip(vals, jdata)}
    jdict["sid"] = request.sid
    print(jdict)
    emit("variables", jdict, to=request.sid)


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1',port='5000',debug=True)
