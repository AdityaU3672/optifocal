$(document).ready(function(){
    //let namespace = "/test";
    let video = document.querySelector("#videoElement");
    let canvas = document.querySelector("#canvasElement");
    let ctx = canvas.getContext('2d');
    // photo = document.getElementById('photo');
    var localMediaStream = null;
    
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    //socket.emit("testing", "working");
  
    function sendSnapshot() {
      if (!localMediaStream) {
        return;
      }

      // console.log("hello");
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 300, 150);
      let image=new Image()
      image.src = canvas.toDataURL('image/jpeg');
      socket.emit('newframe', image);
  
    //   socket.emit('output image')
      
      // var img = new Image();
      // socket.on('out-image-event',function(data){
  
  
      // img.src = dataURL//data.image_data
      // photo.setAttribute('src', data.image_data);
  
      // });
  
  
    }
  
    // socket.on('connect', function() {
    //   console.log('Connected!');
    // });
  
    var constraints = {
      video: {
        width: { min: 640 },
        height: { min: 480 }
      }
    };
  
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      localMediaStream = stream;
  
      setInterval(function () {
        sendSnapshot();
      }, 42);
    }).catch(function(error) {
      console.log(error);
    });
  });