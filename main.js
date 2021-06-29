$(document).ready(function () {
  let video = document.querySelector("#videoElement");
  let canvas = document.querySelector("#canvasElement");
  let ctx = canvas.getContext("2d");

  var localMediaStream = null;

  var socket = io.connect(
    location.protocol + "//" + document.domain + ":" + location.port
  );
  canvas.width = 700;
  canvas.height=500;
  function sendSnapshot() {
    if (!localMediaStream) {
      return;
    }
    ctx.drawImage(video, 0, 0,700,400);
    let type = "image/jpeg";
    let data = canvas.toDataURL(type);
    data = data.replace("data:" + type + ";base64,", "");
    socket.emit("newframe", data);
  }

  // socket.on('connect', function() {
  //   console.log('Connected!');
  // });
  var constraints = {
    video: {
      width: { min: 640 },
      height: { min: 480 },
    },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      video.srcObject = stream;
      localMediaStream = stream;

      setInterval(function () {
        sendSnapshot();
      }, 10000);
      // sendSnapshot();
    })
    .catch(function (error) {
      console.log(error);
    });
});
