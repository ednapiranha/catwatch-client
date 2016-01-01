/* eslint-env browser */

'use strict';

(function () {
  var socket = io(); // <-- change this to connect to your server like io('http://myserver.com');
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var img = document.querySelector('img');
  var constraints = {
    audio: false,
    video: {
      width: 400,
      height: 300
    }
  };

  socket.emit('join');

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      video.src = window.URL.createObjectURL(mediaStream);
      video.play();
    })
    .catch(function (error) {
      console.log(error);
    });

  var takeSnapshot = function () {
    var height = video.videoHeight / (video.videoWidth / constraints.video.width);
    var context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = constraints.video.height;
    context.drawImage(video, 0, 0, video.videoWidth, height);
    var data = canvas.toDataURL('image/jpeg');
    socket.emit('save', {
      data: data
    });
  };

  var timer = setInterval(function () {
    takeSnapshot();
  }, 900000); // currently every 15 minutes
})();
