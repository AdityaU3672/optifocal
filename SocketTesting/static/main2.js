$(document).ready(function () {
  let video = document.querySelector("#videoElement");
  let canvas = document.querySelector("#canvasElement");
  let ctx = canvas.getContext("2d");
  let startpt=[-1,-1]
  let endpt=[-1,-1]
  var localMediaStream = null;

  var socket = io.connect(
    location.protocol + "//" + document.domain + ":" + location.port
  );

  // socket.on("connect",()=>{
  //   socket
  // })

  socket.on("variables",(data)=>{
    console.log(data);
    hor=data.horizontal;
    if (hor==-3){
      vals=document.querySelectorAll(".vals");
      vals.forEach(element => {
        element.textContent="Face not found";
      });
      return;
    }
    if (hor==-2){
      vals=document.querySelectorAll(".vals");
      vals.forEach(element => {
        element.textContent="Calibrating";
      });
      // console.log("calibrating")
      return;
    }
    hor==-1 ? document.querySelector("#horizontal").textContent="right" :
    hor==0 ? document.querySelector("#horizontal").textContent="middle" :
    document.querySelector("#horizontal").textContent="left"

    data.vertical==-1 ? document.querySelector("#vertical").textContent="down" :
    data.vertical==0 ? document.querySelector("#vertical").textContent="center" :
    document.querySelector("#vertical").textContent="up"

    document.querySelector("#pitch").textContent=data.pitch;
    document.querySelector("#yaw").textContent=data.yaw;
    document.querySelector("#roll").textContent=data.roll;
    
    // startpt[0]=data.startpt[0];
    // startpt[1]=data.startpt[1];

    startpt=data.startpt;
    endpt=data.endpt;

    // endpt[0]=data.endpt[0];
    // endpt[1]=data.endpt[1];

  });

  document.querySelector("#reset").addEventListener("click",()=>{
    location.reload();
  })

  
  
  function sendSnapshot() {
    if (!localMediaStream || (video.videoWidth==0 && video.videoHeight==0)) {
      return;
    }
    canvas.width = video.videoWidth
    canvas.height=video.videoHeight;
    console.log(` The width is ${video.videoWidth} and the height is ${video.videoHeight}`);
    ctx.drawImage(video, 0, 0,canvas.width,canvas.height);

    if (startpt[0]!=-1 && endpt[0]!=-1){
      console.log("drawing")
      ctx.beginPath();
      ctx.moveTo(startpt[0],startpt[1]);
      ctx.lineTo(endpt[0],endpt[1]);
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.stroke();
    }
    let type = "image/jpeg";
    let data = canvas.toDataURL(type);
    data = data.replace("data:" + type + ";base64,", "");
    socket.emit("newframe", data);
    //console.log("SenT!");
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
      }, 22);
      // sendSnapshot();
    })
    .catch(function (error) {
      console.log(error);
    });
});
