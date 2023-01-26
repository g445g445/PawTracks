import './Hero.css';
import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";

import * as cocossd from "@tensorflow-models/coco-ssd";

function Hero() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Main function
    async function runCoco() {
        // Load network
        const net = await cocossd.load();

        // Loop & detect
        setInterval(() => {
            detect(net);
        }, 16.7);
    };

    async function detect(net) {
        // Check if data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get video properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video properties
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const detections = await net.detect(video);
            console.log(detections);

            // Draw mesh
            const canvas = canvasRef.current.getContext("2d");

            // Update drawing utilitiy
            drawRectangle(detections, canvas)

            // Check for dog on bed
            petOnBed(detections)
        }
    };

    function drawRectangle (detections, canvas) {
        detections.forEach(prediction => {
            var [x, y, width, height] = prediction['bbox'];
            var text = prediction['class'];

            if (text == 'person') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#F7F9FB'
                setStyle(text, x, y, width, height, color, canvas);
            }
            if (prediction['class'] == 'bed') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#31708E'
                setStyle(text, x, y, width, height, color, canvas);
            }
            if (prediction['class'] == 'dog') {
                text = text[0].toUpperCase() + text.slice(1).toLowerCase()
                var color = '#687864'
                setStyle(text, x, y, width, height, color, canvas);
            }
        })
    };

    function petOnBed (detections) {
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

        if ((!(dogBox == "undefined" || dogBox == null)) && (!(bedBox == "undefined" || bedBox == null)))  {
            alert("THERE IS A DOG: " + dogBox + " AND THERE IS A BED: " + bedBox)
            
            if (bedBox[0] < dogBox[0] && bedBox[1] < dogBox[1]) {
                if (((dogBox[0] + dogBox[2]) < (bedBox[0] + bedBox[2]))
                && ((dogBox[1] + dogBox[3]) < (bedBox[1] + bedBox[3]))) {
                    alert("THE DOG IS ON THE BED!!!!")
                }
            }
        }
    };

    function setStyle(text, x, y, width, height, color, canvas) {
        // Draw Rectangles and text
        canvas.lineWidth = 5;
        canvas.font = '18px Arial'
        canvas.fillStyle = color
        canvas.strokeStyle = color
        canvas.beginPath()
        canvas.fillText(text, x + 15, y + 30)
        canvas.rect(x, y, width, height)
        canvas.stroke()
    };

    useEffect(() => { runCoco() }, []);

    return (
        <>
            <div id="hero-container">
                <canvas id="video-canvas" ref={canvasRef}/>
                <Webcam id="webcam" ref={webcamRef} muted={true}/>
            </div>
        </>
    )
}

export default Hero