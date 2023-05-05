// Import required dependencies
import './Home.css';
import React, { useRef, useEffect, useState } from 'react';

import * as cocossd from "@tensorflow-models/coco-ssd";
import ReactDOM from "react-dom";
import { AiOutlineHome } from 'react-icons/ai';
import { BiCar } from 'react-icons/bi';
import { IoCameraReverse } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

import VideoUploadExtended from '../../controllers/VideoUploadExtended';
import { SaveSession } from '../../controllers/SaveSession';
import { playAudioOnEvent } from '../../controllers/AudioPlayerV2';
//import useAudioPlayer from '../../controllers/AudioPlayer';
import { DataStore } from '@aws-amplify/datastore';
import { UserSettings } from '../../models';


// Global vars for percitent data
var clips = { Clips: [] };
var sessionStartTime = null;
var sessionEndTime = null;

var incidentList = [];
var incidentType = "";

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

    //stores clip name for setting json data
    const currentClipTitleRef = useRef("");

    var cameraSelect = "user";

    const [confidenceMin, setConfidenceMin] = useState(0.4);
    const [personDetection, setPersonDetection] = useState(true);
    const [recordClips, setRecordClips] = useState(true);
   // const [isLoading, setLoading] = useState(true);
    const [selectedCamera, setSelectedCamera] = useState('user');

    useEffect(() => {
        async function fetchUserSettings() {
            console.log("Fetching user settings");
            try {
                const existingUserSettings = await DataStore.query(UserSettings);
                console.log(existingUserSettings.settings);
                if (existingUserSettings.length > 0) {
                    const jsonData = existingUserSettings[0].settings;
                    // Update global vars with fetched data
                    setConfidenceMin(jsonData.minimumConfidence);
                    setPersonDetection(jsonData.personDetection);
                    setRecordClips(jsonData.recordClips);
                    console.log(`user settings updated Conf: ${jsonData.minimumConfidence} person: ${jsonData.personDetection} record: ${jsonData.recordClips}`);
                    //console.log(`user settings are Conf: ${confidenceMin} person: ${personDetection} record: ${recordClips}`  );
                }
                else {
                    setConfidenceMin(0.4);
                    setPersonDetection(true);
                    setRecordClips(true);
                    console.log("no user settings");
                }
            } catch (error) {
                console.error('Failed to fetch user settings:', error);
            }
        }
        async function getReady() {
            await fetchUserSettings();
            prepare_stream(selectedCamera)
        }
        
        getReady();
        console.log(`user settings are Conf: ${confidenceMin} person: ${personDetection} record: ${recordClips}`);
    }, []);

    function resetClips() {
        //console.log("DateStore"+Object.isFrozen(clips.Clips.length - 1))  //used to find what was freezing data object
        clips = { Clips: [] };
        sessionStartTime = null;
        sessionEndTime = null;
        incidentList = [];
    }

    async function prepare_stream(cameraSelect) {
        console.log("user settings fetched");
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
            //console.debug(detections);

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
                    alert("A " + typeOfPet + "IS ON THE BED!!!!");
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

    // Define a function that starts recording a video clip
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

    function drawBbox(detections, canvas) {
        detections.forEach(prediction => {
            var [x, y, width, height] = prediction['bbox'];
            var text = prediction['class'];
            var confidence = parseFloat(prediction['score'].toFixed(2));

            // Which objects to detect
            if (confidence > confidenceMin) {
                if (text === 'person' & personDetection) {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#F7F9FB';
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] === 'bed') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#31708E'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] === 'dog') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#687864'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                if (prediction['class'] === 'bowl') {
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


    async function handleSessionEnd() {
        // Save session to datastore
        //console.log(clips)
        //console.log("DateStore" + Object.isFrozen(clips.Clips.length - 1))
        await SaveSession(clips, sessionStartTime, sessionEndTime);
        //console.log("Session saved to datastore");
        resetClips();
    }

    // if (loading) {
    //     return <div>Loading user settings...</div>;
    //   }

    return (
        <>
                <div id="home-container">
                    {/* Webcam Fotoage */}
                    <div id="home-container">
                        <canvas className='video-prop' id="video-canvas" ref={canvasRef} />
                        <video className='video-prop' id="webcam" autoPlay playsInline muted ref={videoElement} />
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
                        <button id="swap-cam" onClick={() => {
                            if (cameraSelect === "user") {
                                cameraSelect = "environment";
                            }
                            else if (cameraSelect === "environment") {
                                cameraSelect = "user";
                            }
                           prepare_stream(cameraSelect)  //TODO: DONT FORGET ME
                        }}><IoCameraReverse /></button>
                    </div>
                    {/* Temporary Clips Storage */}
                    <div id="Recording">
                        {!records.length
                            ? null
                            : records.map(record => {
                                return (
                                    <div key={record.title}>
                                        <VideoUploadExtended href={record.href} uid={record.title} />
                                    </div>
                                );
                            })}
                    </div>
                </div>
        </>
    );
};
export default Home