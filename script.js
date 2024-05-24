let video = document.querySelector('video');

let constraints = {
    video: true,
    audio: false,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
});
