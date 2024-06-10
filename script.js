const body = document.querySelector('body');
const video = document.querySelector('video');
const videoCont = document.querySelector('.video-cont');
const recordBtnCont = document.querySelector('.record-btn-cont');
const captureBtnCont = document.querySelector('.capture-btn-cont');
const recordBtn = document.querySelector('.record-btn');
const captureBtn = document.querySelector('.capture-btn');
const filterCont = document.querySelector('.actions-cont-left');
const filterLayerCont = document.querySelector('.filter-layer');
let filterColor = 'transparent';
let recordFlag = false;
let recorder;
let chunks = []; // Media data in chunks.

let constraints = {
    video: true,
    audio: true,
};

/**
 * Requests access to the user's media devices and handles the media stream.
 *
 * @param {MediaStreamConstraints} constraints - The constraints for the media stream.
 */
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    // Set the source object of the video element to the media stream
    video.srcObject = stream;

    // Create a new MediaRecorder instance to record the media stream
    recorder = new MediaRecorder(stream);

    // Event listener for when the recording starts
    recorder.addEventListener('start', () => {
        chunks = [];
    });

    // Event listener for when data is available during recording
    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data);
    });

    // Event listener for when the recording stops
    recorder.addEventListener('stop', () => {
        // Create a Blob from the recorded chunks
        const blob = new Blob(chunks, { type: 'video/mp4' });
        if (db) {
            db.transaction('video', 'readwrite')
                .objectStore('video')
                .add({
                    id: `vid-${shortid()}`,
                    blob,
                });
        }
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
        recorder.start();
        startTimer();
        recordBtn.classList.add('scale-record');
        videoCont.style.height = 'calc(100vh - 114px - 92px)';
    } else {
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove('scale-record');
        videoCont.style.height = 'calc(100vh - 92px)';
    }
});

captureBtnCont.addEventListener('click', (e) => {
    captureBtn.classList.add('scale-capture');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = `brightness(${rangeInput.value}%)`;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    ctx.fillStyle = filterColor;
    ctx.fillRect(0, 0, video.videoWidth, video.videoHeight);
    const imageURL = canvas.toDataURL();
    if (db) {
        db.transaction('image', 'readwrite')
            .objectStore('image')
            .add({
                id: `img-${shortid()}`,
                url: imageURL,
            });
    }
    setTimeout(() => captureBtn.classList.remove('capture-record'), 10);
});

let timerID;
let counter = 0;
const timer = document.querySelector('.timer');
const timerCont = document.querySelector('.timer-cont');
/**
 * Starts a timer that updates every second and displays the elapsed time in HH:MM:SS format.
 * The timer is displayed in an HTML element with the id 'timer'.
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
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        hours = hours < 10 ? `0${hours}` : hours;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}

/**
 * Stops the timer by clearing the interval, resetting the timer display,
 * hiding the timer container, and resetting the counter.
 */
function stopTimer() {
    clearInterval(timerID);
    timer.innerText = '00:00:00';
    timerCont.style.display = 'none';
    counter = 0;
}

/**
 * Adds a click event listener to the filter container element.
 * When the filter container is clicked, it retrieves the background color
 * of the clicked target element, applies it to the filter layer container,
 * and sets the body's background color accordingly.
 */
filterCont.addEventListener('click', (e) => {
    // Get the background color of the clicked target element
    filterColor = getComputedStyle(e.target).getPropertyValue(
        'background-color'
    );

    // Apply the retrieved color to the filter layer container
    filterLayerCont.style.backgroundColor = filterColor;

    // Set the body's background color based on the retrieved color
    body.style.backgroundColor =
        filterColor === 'rgba(0, 0, 0, 0)' ? 'wheat' : filterColor;
});
