// Import required dependencies
import './Home.css';
import React, { useRef, useEffect, useState } from 'react';

import * as cocossd from "@tensorflow-models/coco-ssd";

import { AiOutlineHome } from 'react-icons/ai';
import { BiCar } from 'react-icons/bi';
import { IoCameraReverse } from 'react-icons/io5';

import VideoUploadExtended from '../../controllers/VideoUploadExtended';

function Home() {
    // Reference Variable for the Detection Canvas
    const canvasRef = useRef(null);

    //Clip Prototypes
    const [records, setRecords] = useState([]);

    const videoElement = useRef(null);
    // When home button is visible recording should not occur
    const homeButtonElement = useRef(null);
    // When away button is visible recording should occur
    const awayButtonElement = useRef(null);
    const shouldRecordRef = useRef(false);
    const recorderRef = useRef(null);
    const recordingRef = useRef(false);

    // Array Variable for Data Smoothing
    const lastDetectionsRef = useRef([]);

    const netRef = useRef(null);
    const detectionsRef = useRef(null);

    var cameraSelect = "user";

    async function prepare_stream(cameraSelect) {
        // By default the away button is hidden
        awayButtonElement.current.setAttribute("hidden", true);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {

                    // Sets stream constraints given user webcam
                    let stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: {
                            width: { max: 640 },
                            height: { max: 480 },
                            facingMode: cameraSelect // Selects which cam to use for mobile
                        }
                    });

                    window.stream = stream;
                    // Sets the video elements object to the webcam stream.
                    videoElement.current.srcObject = stream;
                
                // Loads the cocossd model & sets the net reference variable to it.
                const net = await cocossd.load();
                netRef.current = net;

                // Runs the liveDetections function using our model in a loop
                setInterval(() => {
                    liveDetections(net);
                }, 16.7);

            } catch (error) {
                console.error(error);
            }
        }
    }

    async function liveDetections() {
        if (videoElement.current !== null) {
        // Sets the detection canvas properties to that of the videoElement
        canvasRef.current.width = videoElement.current.srcObject.getVideoTracks()[0].getSettings().width;
        canvasRef.current.height = videoElement.current.srcObject.getVideoTracks()[0].getSettings().height;

        // Detects objects in our videoElement using our model
        const detections = await netRef.current.detect(videoElement.current);
        detectionsRef.current = detections;
        console.debug(detections);

        // Draws the canvas
        const canvas = canvasRef.current.getContext("2d");

        // Calls the bbox drawing function, passing in our detections and canvas obj
        drawBbox(detections, canvas);
        }
    }

    async function detectFrame() {
        if (!shouldRecordRef.current) {
            stopRecording();
            return;
        }

        let personFound = false;
        personFound = personInRoom(detectionsRef.current);
        let petOnBedDetection = false;
        petOnBedDetection = petOnBed(detectionsRef.current);

        if (personFound || petOnBedDetection) {
            if(personFound) {
                console.log("Alert Type: Person");
            }
            if(petOnBedDetection) {
                console.log("Alert Type: Pet on Bed");
            }
            
            startRecording();
            lastDetectionsRef.current.push(true);
        } else if (lastDetectionsRef.current.filter(Boolean).length) {
            startRecording();
            lastDetectionsRef.current.push(false);
        } else {
            stopRecording();
        }

        lastDetectionsRef.current = lastDetectionsRef.current.slice(
            Math.max(lastDetectionsRef.current.length - 10, 0)
        );

        requestAnimationFrame(() => {
            detectFrame();
        });
    }

    function petOnBed(detections) {
        var dogBox;
        var bedBox;
        detections.forEach(prediction => {
            if (prediction['class'] == 'dog') {
                dogBox = prediction['bbox']
            }
            if (prediction['class'] == 'bed') {
                bedBox = prediction['bbox']
            }
        })

        if ((!(dogBox == "undefined" || dogBox == null)) && (!(bedBox == "undefined" || bedBox == null))) {
            if (bedBox[0] < dogBox[0] && bedBox[1] < dogBox[1]) {
                if (((dogBox[0] + dogBox[2]) < (bedBox[0] + bedBox[2]))
                    && ((dogBox[1] + dogBox[3]) < (bedBox[1] + bedBox[3]))) {
                    //alert("THE DOG IS ON THE BED!!!!")
                    return true;
                }
            }
        }
        return false;
    };

    function personInRoom(detections) {
        var foundPerson = false;
        detections.forEach(prediction => {
            if (prediction['class'] == 'person') {
                foundPerson = true;
            }
        })
        return foundPerson;
    };

    function startRecording() {
        if (recordingRef.current) {
            return;
        }
        recordingRef.current = true;
        console.log("Clip Start: " + new Date());

        recorderRef.current = new MediaRecorder(window.stream)

        recorderRef.current.ondataavailable = async function (e) {
            const title = new Date() + "";
            const href = URL.createObjectURL(e.data);
            console.log("Link to clip: " + href);
            setRecords(previousRecords => {
                return [...previousRecords, { href, title }];
            });
        };
        recorderRef.current.start();
    };

    function stopRecording() {
        if (!recordingRef.current) {
            return;
        }
        recordingRef.current = false;
        recorderRef.current.stop();
        console.log("Clip End: " + new Date());
        lastDetectionsRef.current = [];
    };

    function drawBbox(detections, canvas) {
        detections.forEach(prediction => {
            var [x, y, width, height] = prediction['bbox'];
            var text = prediction['class'];
            var confidence = parseFloat(prediction['score'].toFixed(2));

            // Which objects to detect
            if (confidence > 0.4) {
                if (text == 'person') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#F7F9FB'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] == 'bed') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#31708E'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] == 'dog') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#687864'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] == 'bowl') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = 'green'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
            }
        })
    };

    function setStyle(text, x, y, width, height, color, canvas, confidence) {
        // Draw Rectangles and text
        canvas.lineWidth = 5;
        canvas.font = '18px Arial'
        canvas.fillStyle = color
        canvas.strokeStyle = color
        canvas.beginPath()
        canvas.fillText(text + " " + confidence, x + 15, y + 30)
        canvas.rect(x, y, width, height)
        canvas.stroke()
    };

    useEffect(() => {prepare_stream(cameraSelect)}, [])

    return (
        <>
            {/* Webcam Fotoage */}
            <div id="home-container">
                <canvas className='video-prop' id="video-canvas" ref={canvasRef} />
                <video className='video-prop' id="webcam" autoPlay playsInline muted ref={videoElement} />
                <button id='home-btn' onClick={() => {
                    console.log("Session Start: " + new Date());
                    shouldRecordRef.current = true;
                    homeButtonElement.current.setAttribute("hidden", true);
                    awayButtonElement.current.removeAttribute("hidden");
                    detectFrame();
                }} ref={homeButtonElement}><AiOutlineHome /> Home</button>
                <button id='away-btn' onClick={() => {
                    console.log("Session End: " + new Date());
                    shouldRecordRef.current = false;
                    awayButtonElement.current.setAttribute("hidden", true);
                    homeButtonElement.current.removeAttribute("hidden");
                    stopRecording();
                }} ref={awayButtonElement}><BiCar /> Away</button>
                <button id="swap-cam" onClick={() => {
                    if (cameraSelect == "user") {
                        cameraSelect = "environment";
                    }
                    else if (cameraSelect == "environment") {
                        cameraSelect = "user";
                    }
                    prepare_stream(cameraSelect)
                }}><IoCameraReverse /></button>
            </div>

            {/* Temporary Clips Storage */}
            <div id="Recording">
                <h3>Records: </h3>
                {!records.length
                    ? null
                    : records.map(record => {
                        return (
                            <div key={record.title}>
                                <div>
                                    <h5 className="card-title">{record.title}</h5>
                                    <video controls src={record.href}></video>
                                    <VideoUploadExtended href={record.href}  />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    )
}
export default Home