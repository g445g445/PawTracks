import './Test.css';
import React, { useRef, useEffect, useState } from 'react';

import * as cocossd from "@tensorflow-models/coco-ssd";
import { loadGraphModel } from '@tensorflow/tfjs';

function Test() {
    const canvasRef = useRef(null);
    const [records, setRecords] = useState([]);
    const videoElement = useRef(null);
    var width = useRef(null);
    var height = useRef(null);
    const lastDetectionsRef = useRef([]);
    const netRef = useRef(null);
    const detectionsRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState([]);
    const inputRef = useRef(null);

    const filteredDetections = null;

    var minConfidence = 0;

    let text = '{"categories": [' + 
        '{"supercategory": "person", "id": 1, "name": "person"},' + 
        '{"supercategory": "animal", "id": 2, "name": "dog"},' + 
        '{"supercategory": "animal", "id": 3, "name": "cat"},' + 
        '{"supercategory": "animal", "id": 4, "name": "bird"},' + 
        '{"supercategory": "furniture", "id": 5, "name": "bed"},' + 
        '{"supercategory": "furniture", "id": 6, "name": "couch"},' + 
        '{"supercategory": "kitchen", "id": 7, "name": "bowl"} ]}';
    const model = JSON.parse(text);

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

        prepare_video();
    };

    async function prepare_video() {
        try {
            const net = await cocossd.load();
            netRef.current = net;
            setInterval(() => {
                liveDetections(net);
            },);
        } catch (error) {
            console.error(error);
        }
    }

    async function liveDetections() {
        // Sets the detection canvas properties to that of the videoElements
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        // Detects objects in our videoElement using our model
        const detections = await netRef.current.detect(document.getElementById('video')); //Should have minScore
        /*let filteredDetections = detections.filter(prediction => {
            return categories.includes(prediction.class);
        });
        detectionsRef.current = filteredDetections;*/
        detectionsRef.current = detections;
        console.debug(detections);

        // Draws the canvas
        const canvas = canvasRef.current.getContext("2d");

        // Calls the bbox drawing function, passing in our detections and canvas obj
        drawBbox(detections, canvas);
    }

    function drawBbox(detections, canvas) {
        detections.forEach(prediction => {
            var [x, y, width, height] = prediction['bbox'];
            var text = prediction['class'];
            var confidence = parseFloat(prediction['score'].toFixed(2));

            // Which objects to detect
                if (text == 'person') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#F7F9FB'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                else if (prediction['class'] == 'bed') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#31708E'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                else if (prediction['class'] == 'dog') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = '#687864'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                }
                else if (prediction['class'] == 'cat') {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = 'pink'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
                } else {
                    text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                    var color = 'black'
                    setStyle(text, x, y, width, height, color, canvas, confidence);
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

    return (
        <>
            <h1>Test Video Page: </h1>
            <div id="test-container">
                <input ref={inputRef} className="videoInput_input" type="file" onInput={handleFileChange} accept=".mov,.mp4" />
                <div id="videoContainer">
                    <canvas className="video=prop" id="video-canvas" ref={canvasRef} />
                    <video id="video" autoPlay loop muted src={videoSrc}></video>
                </div>
            </div>
        </>
    )
}

export default Test