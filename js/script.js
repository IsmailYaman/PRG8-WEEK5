const log = document.querySelector("#array");
const video = document.querySelector("#video");
const startBtn = document.querySelector("button");

let initialized = false;

function initApplication() {
    Notification.requestPermission();
    new Notification("Starting the app");

    startWebcam();
    video.addEventListener("play", () => generateLandmarks());
}

//
// function to read the webcam
//
function startWebcam() {
    if (!initialized) {
        navigator.getUserMedia(
            { video: {} },
            (stream) => {
                initialized = true;
                video.srcObject = stream;
            },
            (err) => console.error(err)
        );
    }
}

//
// start face api
//
function generateLandmarks() {
    const canvas = faceapi.createCanvasFromMedia(video);
    const videoElement = document.querySelector("#video");
    videoElement.parentElement.appendChild(canvas); // Append the canvas as a sibling to the video element
    const displaySize = { width: video.width, height: video.height };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        if (detections[0]?.landmarks) {
            logData(detections);
        } else {
            console.log("No face found");
        }

        // Clear the canvas and draw the detections and landmarks
        canvas
            .getContext("2d")
            .clearRect(0, 0, displaySize.width, displaySize.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceLandmarks(canvas, detections);
    }, 1000);
}

function logData(detections) {
    let str = "";
    for (let i = 0; i < 20; i++) {
        str +=
            detections[0].landmarks.positions[i]._x +
            ", " +
            detections[0].landmarks.positions[i]._y +
            ", ";
    }
    log.innerText = str;
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
]).then(initApplication);
