from flask import Flask, render_template, request, jsonify, Response
import numpy as np
import cv2
from flask_socketio import SocketIO
import droid_eyes as DE
import io
import base64
from io import StringIO
from PIL import Image

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
x = "inpt.jpg"

global_camera = DE.attn_detector()

@app.route('/')
def home():
    return render_template("index.html")

# @socketio.on('testing')
# def lfrm(inpt):
#     print(inpt)

#Updates when there's a new frame
@socketio.on('newframe')
def loadframe(image):
    print("all recieved")
    
    sbuf = StringIO()
    sbuf.write(image)
    b = io.BytesIO(base64.b64decode(image))
    pimg = Image.open(b)

    # img = cv2.cvtColor(np.asarray(pimg),cv2.COLOR_RGB2BGR)  
    # cv2.imshow("OpenCV",img)  


   
    pimg.show()

    
    # global_camera.update(np.array(pimg))
    
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

@socketio.on('input image')
def test_message(input):
    print("\n\nBEGIN", input, "\n\nEND")
    # input = input.split(",")[1]
    # camera.enqueue_input(input)
    # image_data = input # Do your magical Image processing here!!
    # #image_data = image_data.decode("utf-8")
    # image_data = "data:image/jpeg;base64," + image_data
    # print("OUTPUT " + image_data)
    # emit('out-image-event', {'image_data': image_data}, namespace='/test')
    # #camera.enqueue_input(base64_to_pil_image(input))


if __name__ == '__main__':
    socketio.run(app)