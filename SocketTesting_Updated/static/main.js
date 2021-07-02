$(document).ready(function () {
  let video = document.querySelector("#videoElement");
  let canvas = document.querySelector("#canvasElement");
  let ctx = canvas.getContext("2d");
  let startpt = [-1, -1];
  let endpt = [-1, -1];
  var localMediaStream = null;

  var socket = io.connect(
    location.protocol + "//" + document.domain + ":" + location.port
  );

  //RECIEVING DATA FROM BACKEND
  socket.on("variables", (data) => {
    hor = data.horizontal;
    if (hor == -3) {
      document.getElementById("happening").classList.remove("calibrating");
      document.getElementById("happening").classList.remove("allGood");
      document.getElementById("happening").classList.add("notFound");
      document.getElementById("happening").textContent = "Face not Found";

      document.getElementById("data").classList.add("hidden");

      // TRYING TO CLEAR THE LINE FROM THE CANVAS BY JUST DISPLAYING VIDEO FEED
      startpt = [-1, -1];
      endpt = [-1, -1];

      return;
    }

    if (hor == -2) {
      document.getElementById("happening").classList.remove("notFound");
      document.getElementById("happening").classList.remove("allGood");
      document.getElementById("happening").classList.add("calibrating");
      document.getElementById("happening").textContent = "Calibrating";
      document.getElementById("data").classList.add("hidden");
      return;
    }

    document.getElementById("data").classList.remove("hidden");
    document.getElementById("happening").classList.remove("notFound");
    document.getElementById("happening").classList.remove("calibrating");
    document.getElementById("happening").classList.add("allGood");
    document.getElementById("happening").textContent = "All good";

    hor == -1
      ? (document.querySelector("#horizontal").textContent = "right")
      : hor == 0
      ? (document.querySelector("#horizontal").textContent = "middle")
      : (document.querySelector("#horizontal").textContent = "left");

    data.vertical == -1
      ? (document.querySelector("#vertical").textContent = "down")
      : data.vertical == 0
      ? (document.querySelector("#vertical").textContent = "center")
      : (document.querySelector("#vertical").textContent = "up");

    document.querySelector("#pitch").textContent = data.pitch;
    document.querySelector("#yaw").textContent = data.yaw;
    document.querySelector("#roll").textContent = data.roll;

    startpt[0] = data.startpt[0];
    startpt[1] = data.startpt[1];

    endpt[0] = data.endpt[0];
    endpt[1] = data.endpt[1];
  });

  //RESET BUTTON
  document.querySelector("#reset").addEventListener("click", () => {
    location.reload();
  });

  // FUNCTION TO SEND IMAGE TO BACKEND
  function sendSnapshot() {
    if (
      !localMediaStream ||
      (video.videoWidth == 0 && video.videoHeight == 0)
    ) {
      return;
    }
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;

    // CHANGING CANVAS WIDTH TO 740
    canvas.width = 740;
    canvas.height = video.videoHeight / (video.videoWidth / 740);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // DRAWING THE LINE
    if (startpt[0] != -1 && endpt[0] != -1) {
      ctx.beginPath();
      ctx.moveTo(startpt[0], startpt[1]);
      ctx.lineTo(endpt[0], endpt[1]);
      ctx.lineWidth = "5";
      ctx.lineCap = "round";
      ctx.strokeStyle = "blue";
      ctx.stroke();
    }
    let type = "image/jpeg";
    let data = canvas.toDataURL(type);
    data = data.replace("data:" + type + ";base64,", "");
    socket.emit("newframe", data);
  }

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
      }, 22);
    })
    .catch(function (error) {
      console.log(error);
    });
});