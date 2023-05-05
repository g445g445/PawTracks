import './Test.css';
import React, { useRef, useEffect, useState } from 'react';

import * as cocossd from "@tensorflow-models/coco-ssd";
import { loadGraphModel } from '@tensorflow/tfjs';
import { Menu, MenuButton, MenuItem, View } from '@aws-amplify/ui-react';
import { AiOutlineDownCircle, AiOutlineHome } from 'react-icons/ai';
import { BiCar } from 'react-icons/bi';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

import VideoUploadExtended from '../../controllers/VideoUploadExtended';
import { SaveSession } from '../../controllers/SaveSession';
import { playAudioOnEvent } from '../../controllers/AudioPlayerV2';

// Global vars for percitent data
var clips = { Clips: [] };
var sessionStartTime = null;
var sessionEndTime = null;

var incidentList = [];
var incidentType = "";

var confidenceMin = 0.4;
var personDetection = true;
var recordClips = true;

function Test() {
    const canvasRef = useRef(null);
    const [records, setRecords] = useState([]);
    const videoElement = useRef(null);
    var width = useRef(640);
    var height = useRef(480);
    const lastDetectionsRef = useRef([]);
    const netRef = useRef(null);
    const detectionsRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState([]);
    const inputRef = useRef(null);

    // When home button is visible recording should not occur
    const homeButtonElement = useRef(null);
    // When away button is visible recording should occur
    const awayButtonElement = useRef(null);
    const shouldRecordRef = useRef(false);
    const recorderRef = useRef(null);
    const recordingRef = useRef(false);
    //stores clip name for setting json data
    const currentClipTitleRef = useRef("");

    function resetClips() {
        //console.log("DateStore"+Object.isFrozen(clips.Clips.length - 1))  //used to find what was freezing data object
        clips = { Clips: [] };
        sessionStartTime = null;
        sessionEndTime = null;
        incidentList = [];
    }


    const settings = useRef({
        "minimumConfidence": 0,
        "personDetectiong": true,
        "restrictedAreas": [
            { "name": "Bed", "id": 0, "restrictedPets": [{ "name": "Dog", "id": 1 }, { "name": "Cat", "id": 2 }, { "name": "Bird", "id": 3 }] },
            { "name": "Couch", "id": 1, "restrictedPets": [{ "name": "Dog", "id": 1 }, { "name": "Cat", "id": 2 }, { "name": "Bird", "id": 3 }] },
            { "name": "Chair", "id": 2, "restrictedPets": [{ "name": "Dog", "id": 1 }, { "name": "Cat", "id": 2 }, { "name": "Bird", "id": 3 }] }
        ]
    });

    console.log(JSON.stringify(settings.current['restrictedAreas'][0]['restrictedPets']));


    /*
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        let videoElement = document.getElementById('video');
        try {
            document.getElementById('video').addEventListener('loadedmetadata', function (e) {
                width = videoElement.videoWidth;
                height = videoElement.videoHeight;
            })
        } catch (error) {
            console.error(error);
        }

        const url = URL.createObjectURL(file);
        setVideoSrc(url);
    };
    */

    async function prepare_video(videoKey) {
        try {
            const net = await cocossd.load();
            netRef.current = net;
            console.log(videoKey);
            const videoUrl = await Storage.get(videoKey, { level: 'public' });
            setVideoSrc(videoUrl);
            console.log(videoUrl);

            // create a video element
            const videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.crossOrigin = 'anonymous';

            // Wait for the video to load and get the video dimensions
            await new Promise(resolve => {
                videoElement.addEventListener('loadedmetadata', () => {
                    width = videoElement.videoWidth;
                    height = videoElement.videoHeight;
                    resolve();
                });
            });
            

            // create a MediaStream object from the video element source
            const mediaStream = videoElement.captureStream();

            // set the MediaStream object to window.stream
            window.stream = mediaStream;


            setInterval(() => {
                liveDetections(net);
            }, 16.7);
        } catch (error) {
            console.error(error);
        }
    }

    async function liveDetections() {
        // Sets the detection canvas properties to that of the videoElements
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        // Detects objects in our videoElement using our model
        try {
            const detections = await netRef.current.detect(document.getElementById('video'));
            detectionsRef.current = detections;
            console.debug(detections);
            const canvas = canvasRef.current.getContext("2d");
            // Calls the bbox drawing function, passing in our detections and canvas obj
            drawBbox(detections, canvas);
        } catch (error) {
            console.error(error);
        }
        //Should have minScore
        /*let filteredDetections = detections.filter(prediction => {
            return categories.includes(prediction.class);
        });
        detectionsRef.current = filteredDetections;*/
        // Draws the canvas
    }

    async function detectFrame() {
        if (!shouldRecordRef.current) {
            stopRecording();
            return;
        }

        let personFound = false;
        if (personDetection) {
            personFound = personInRoom(detectionsRef.current);
        }

        let petOnBedDetection = false;
        petOnBedDetection = petOnBed(detectionsRef.current);

        if (personFound || petOnBedDetection) {
            // Add Alert Types Here
            if (personFound) {
                incidentType = "Person";
                //console.log("Alert Type: Person");
            }
            if (petOnBedDetection) {
                incidentType = "PetOnObject";
                //console.log("Alert Type: Pet on Bed");
            }

            if (recordClips) {
                startRecording();
            }
            lastDetectionsRef.current.push(true);
        } else if (lastDetectionsRef.current.filter(Boolean).length) {
            if (recordClips) {
                startRecording();
                lastDetectionsRef.current.push(false);
            }
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

    function drawBbox(detections, canvas) {
        detections.forEach(prediction => {
            var [x, y, width, height] = prediction['bbox'];
            var text = prediction['class'];
            var confidence = parseFloat(prediction['score'].toFixed(2));

            // Which objects to detect
            if (text === 'person') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#F7F9FB';
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'bed') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#31708E'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'couch') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#31708E'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'chair') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#31708E'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'dog') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#687864'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'cat') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#687864'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
            if (prediction['class'] === 'bird') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#687864'
                setStyle(text, x, y, width, height, color, canvas, confidence);
            }
        })
    };

    function petOnBed(detections) {
        var petBox = null;
        var bedBox = null;
        var typeOfPet = null;
        detections.forEach(prediction => {
            if (prediction['class'] === 'dog' || prediction['class'] === 'cat' || prediction['class'] === 'bird') {
                petBox = prediction['bbox']
                typeOfPet = prediction['class']
            }
            if (prediction['class'] === 'bed') {
                bedBox = prediction['bbox']
            }
        })

        if ((!(petBox === "undefined" || petBox === null)) && (!(bedBox === "undefined" || bedBox === null))) {
            if (bedBox[0] < petBox[0] && bedBox[1] < petBox[1]) {
                if (((petBox[0] + petBox[2]) < (bedBox[0] + bedBox[2]))
                    && ((petBox[1] + petBox[3]) < (bedBox[1] + bedBox[3]))) {
                    //alert("A " + typeOfPet + "IS ON THE BED!!!!");
                    return true;
                }
            }
        }

        //IncidentType.push(["Pet On Bed", prediction['class']]);
        return false;
    };

    function personInRoom(detections) {
        var foundPerson = false;
        detections.forEach(prediction => {
            if (prediction['class'] === 'person') {
                foundPerson = true;
            }
        })
        return foundPerson;
    };

    function startRecording() {
        // Check if a recording is already in progress
        if (recordingRef.current) {
            return; // If so, exit the function
        }
        //Play users STOP audio rrecording recording
        playAudioOnEvent();
        // Set a flag to indicate that a recording is in progress
        recordingRef.current = true;
        // Create a new Date object to mark the start time of the clip
        const clipStartTime = new Date();
        // Log the start time to the console
        console.log("Clip Start: " + clipStartTime);
        // Create a new Array object to store type of alerts
        // Generate a new UUID for the clip title and store it in a ref
        currentClipTitleRef.current = uuidv4();
        // Add a new clip object to the clips array with the start time, placeholder end time, incident list, and filename
        clips.Clips.push({
            "start": clipStartTime,
            "end": "temp",
            "IncidentList": [],
            "fileName": `temp.mp4`
        });

        if (!incidentList.includes(incidentType)) {
            incidentList.push(incidentType);
        }

        recorderRef.current = new MediaRecorder(window.stream)
        recorderRef.current.ondataavailable = async function (e) {
            //saving the title as UID so that datastore and S3 can access the same record 
            const title = currentClipTitleRef.current;
            //currentClipTitleRef.current= title; // update the clip title reference
            console.log( recorderRef.current.size)
            console.log(Object.isFrozen(clips.Clips.length - 1))

            //set clip name
            try {
                clips.Clips[clips.Clips.length - 1].fileName = `${title}.mp4`;
                clips.Clips[clips.Clips.length - 1].end = new Date();

                //TODO: Add IncidentList here and pray that the data doesnt freeze and not update :)

            } catch (error) {
                console.log("Could not update last title, refrence was in use" + error)
            }

            //console.log("Clip End: " + new Date());
            //console.log([clips.Clips.length - 1]);

            const href = URL.createObjectURL(e.data);
            //console.log("Link to clip: " + href);

            setRecords(previousRecords => {
                return [...previousRecords, { href, title }];
            });
        };
        recorderRef.current.start();
    };

    function stopRecording() {
        console.log("INCIDENT LIST: " + incidentList);
        if (!recordingRef.current) {
            return;
        }
        const currentClipTitle = currentClipTitleRef.current;
        //console.log("uid: " + currentClipTitle);
        recordingRef.current = false;
        recorderRef.current.stop();
        if (currentClipTitle != "" && currentClipTitle != null) clips.Clips[clips.Clips.length - 1].fileName = `${currentClipTitle}.mp4`;
        clips.Clips[clips.Clips.length - 1].end = new Date();
        clips.Clips[clips.Clips.length - 1].IncidentList = incidentList;

        // temp code for testing purposes
        //console.log(clips)
        lastDetectionsRef.current = [];
    };

    function setStyle(text, x, y, width, height, color, canvas, confidence) {
        // Draw Rectangles and text
        canvas.lineWidth = 10;
        canvas.font = '30px Arial'
        canvas.fillStyle = color
        canvas.strokeStyle = color
        canvas.beginPath()
        canvas.fillText(text + " " + confidence, x + 15, y + 30)
        canvas.rect(x, y, width, height)
        canvas.stroke()
    };

    //useEffect(() => { prepare_stream(cameraSelect) }, [])

    async function handleSessionEnd() {
        // Save session to datastore
        //console.log(clips)
        //console.log("DateStore" + Object.isFrozen(clips.Clips.length - 1))
        await SaveSession(clips, sessionStartTime, sessionEndTime);
        //console.log("Session saved to datastore");
        resetClips();
    }

    return (
        <>
            <h1>Test Video Page: </h1>
            <div id="test-container">
                <Menu menuAlign="start"
                    trigger={
                        <MenuButton variation="primary" size="small">
                            Select A Testing Video <AiOutlineDownCircle id="dropdownArrow"></AiOutlineDownCircle>
                        </MenuButton>
                    }
                >
                    <MenuItem onClick={() => {
                        console.log('Test Video 1: Person');
                        let videoElement = document.getElementById('video');
                        try {
                            videoElement.addEventListener('loadedmetadata', function (e) {
                                width = videoElement.videoWidth;
                                height = videoElement.videoHeight;
                            })
                        } catch (error) {
                            console.error(error);
                        }
                        setVideoSrc('temp-person.mp4');
                        prepare_video('temp-person.mp4');
                    }}>
                        Video One: Person
                    </MenuItem>
                    <MenuItem onClick={() => {
                        console.log('Dog On Bed');
                        setVideoSrc('koda-test-video.webm');
                        let videoElement = document.getElementById('video');
                        try {
                            videoElement.addEventListener('loadedmetadata', function (e) {
                                width = videoElement.videoWidth;
                                height = videoElement.videoHeight;
                            })
                        } catch (error) {
                            console.error(error);
                        }
                        prepare_video('koda-test-video.webm');
                        //detectFrame();
                    }}>
                        Video Two: Dog On Bed
                    </MenuItem>
                    <MenuItem onClick={() => {
                        console.log('Cat On Chair');
                        setVideoSrc('cat-on-chair.mp4');
                        let videoElement = document.getElementById('video');
                        try {
                            videoElement.addEventListener('loadedmetadata', function (e) {
                                width = videoElement.videoWidth;
                                height = videoElement.videoHeight;
                            })
                        } catch (error) {
                            console.error(error);
                        }
                        prepare_video('cat-on-chair.mp4');
                    }}>
                        Video Three: Cat On Chair
                    </MenuItem>
                </Menu>
                {/*<input ref={inputRef} className="videoInput_input" type="file" onInput={handleFileChange} accept=".mov,.mp4" />*/}
                <div id="videoContainer">
                    <canvas className="video=prop" id="video-canvas" ref={canvasRef} />
                    <video id="video" autoPlay loop muted src={videoSrc} crossOrigin="anonymous"></video>
                </div>
                <button id='home-btn' onClick={() => {
                    sessionStartTime = new Date();
                    console.log("SESSION Start: " + sessionStartTime);
                    shouldRecordRef.current = true;
                    homeButtonElement.current.setAttribute("hidden", true);
                    awayButtonElement.current.removeAttribute("hidden");
                    detectFrame();
                }} ref={homeButtonElement}><AiOutlineHome /> Home</button>
                <button id='away-btn' onClick={() => {
                    sessionEndTime = new Date();
                    console.log("SESSION END: " + sessionEndTime.toLocaleString());
                    shouldRecordRef.current = false;
                    awayButtonElement.current.setAttribute("hidden", true);
                    homeButtonElement.current.removeAttribute("hidden");
                    stopRecording();
                    //console.log("Clips" + clips);
                    handleSessionEnd();
                }} ref={awayButtonElement}><BiCar /> Away</button>
            </div>
            {/* Temporary Clips Storage */}
            <div id="Recording">
                {!records.length
                    ? null
                    : records.map(record => {
                        return (
                            <div key={record.title}>
                                <VideoUploadExtended href={videoSrc} uid={record.title} />
                            </div>
                        );
                    })}
            </div>
        </>
    )
}
export default Test