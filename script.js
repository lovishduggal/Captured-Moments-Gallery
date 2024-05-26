const video = document.querySelector('video');
const videoCont = document.querySelector('.video-cont');
const recordBtnCont = document.querySelector('.record-btn-cont');
const captureBtnCont = document.querySelector('.capture-btn-cont');
const recordBtn = document.querySelector('.record-btn');
const captureBtn = document.querySelector('.capture-btn');
let recordFlag = false;

let recorder;
let chunks = []; // Media data in chunks.

let constraints = {
    video: true,
    audio: true,
};

/**
 * Requests access to the user's media devices (e.g., camera and microphone) based on the provided constraints.
 * If access is granted, it sets up a video stream and initializes a MediaRecorder to record the stream.
 *
 * @param {Object} constraints - The constraints object specifying the desired media types and settings.
 */
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    // Set the video element's source to the media stream
    video.srcObject = stream;

    // Initialize the MediaRecorder with the media stream
    recorder = new MediaRecorder(stream);

    // Event listener for when recording starts
    recorder.addEventListener('start', () => {
        chunks = [];
    });

    // Event listener for when data is available during recording
    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data);
    });

    // Event listener for when recording stops
    recorder.addEventListener('stop', () => {
        // Create a Blob from the recorded chunks
        const blob = new Blob(chunks, { type: 'video/mp4' });

        // Create a URL for the Blob
        const videoUrl = URL.createObjectURL(blob);

        // Create an anchor element to download the recorded video
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'stream.mp4';
        a.click();
    });
});

/**
 * Event listener for the record button container.
 * Toggles the recording state and updates the UI accordingly.
 */
recordBtnCont.addEventListener('click', () => {
    if (!recorder) return;
    recordFlag = !recordFlag;

    if (recordFlag) {
        // Start recording
        videoCont.style.height = 'calc(100vh - 114px)';
        recorder.start();
        startTimer();
        recordBtn.classList.add('scale-record');
    } else {
        // Stop recording
        videoCont.style.height = '100vh';
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove('scale-record');
    }
});

let timerID;
let counter = 0;
const timer = document.querySelector('.timer');
const timerCont = document.querySelector('.timer-cont');
/**
 * Starts a timer that updates every second and displays the elapsed time in HH:MM:SS format.
 * The timer is displayed in an element with the ID 'timer'.
 * The timer container is made visible when the timer starts.
 */
function startTimer() {
    timerCont.style.display = 'block';

    /**
     * Updates the timer display with the current elapsed time.
     * The time is formatted as HH:MM:SS.
     */
    function displayTimer() {
        let totalSeconds = counter;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        seconds = seconds < 10 ? `0${seconds}` : seconds;
        /**
         * Stops the timer by hiding the timer container, clearing the interval, and resetting the timer display.
         */
        function stopTimer() {
            timerCont.style.display = 'none';
            clearInterval(timerID);
            timer.innerText = '00:00:00';
        }
        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    timerCont.style.display = 'none';
    clearInterval(timerID);
    timer.innerText = '00:00:00';
}
