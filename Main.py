import flask
from flask import Flask, request, jsonify, render_template, Response
import utils.droid_eyes as DE
#from camera import Camera
#from refactored import *

up = Flask(__name__)

global_camera = DE.attn_detector("resc/shape_68.dat", 0)

@up.route('/')
def home():
    #add render for home page
    return render_template("home.html")

@up.route('/video')
def index():
    global global_camera
    global_camera.cam_release()
    #global_camera  = DE.attn_detector("resc/shape_68.dat", 0)
    global_camera.cam_capture()

    ## Place While Loops Here
    return render_template("video.html")

def gen(camera):
    while True:
        _, _, _ = camera.update()
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@up.route('/video_feed')
def video_feed():
    global global_camera
    
    return Response(gen(global_camera),
            mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__=='__main__':
    up.run(host='127.0.0.1',port='3000',debug=True)
