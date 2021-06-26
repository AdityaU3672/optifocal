from flask import Flask, render_template, request, jsonify, Response
from flask_socketio import SocketIO
import droid_eyes as DE

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


global_camera = DE.attn_detector("resc/shape_68.dat", 0)

@app.route('/')
def home():
    return render_template("index.html")


@socketio.on("my event")
def handle_my_custom_event(json):
    print('received json: ' + str(json))

#Updates when there's a new frame
@socketio.on('frame')
def loadframe(image):
    global_camera.update(image)

#Returns the most recently processed frame
def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

#same as before
@up.route('/video_feed')
def video_feed():
    global global_camera
    
    return Response(gen(global_camera),
            mimetype='multipart/x-mixed-replace; boundary=frame')

@socketio.on('input image', namespace='/test')
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