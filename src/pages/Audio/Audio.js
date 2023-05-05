import React from 'react';
import './Audio.css';
import { Storage } from "@aws-amplify/storage";
import { Auth } from 'aws-amplify';

const MicRecorder = require('mic-recorder-to-mp3');
const mp3Recorder = new MicRecorder({bitRate: 128});

function OpenMicSet(props) {
    return(props.trigger) ? (
        <div className="Mic-set-window">
            <div className="Mic-set-content">
                <button className='Close-Mic-set' id='Exit-btn'
                onClick={() => props.setTrigger(false)}>Exit</button>
                { props.children }
            <button id='Mic-Record-btn' onClick={startRecording}>Start Recording</button>
            <button id='Mic-Stop-btn' onClick={stopRecording} hidden>Stop Recording</button>
            </div>
        </div>
    ) : "";
}

export function startRecording() 
  {
    console.log("click");
    mp3Recorder.start().then(() => {
      
    }).catch((error) => {
      console.error(error);
    });
    document.getElementById("Exit-btn").disabled = true;
    document.getElementById("Mic-Record-btn").hidden = true;
    document.getElementById("Mic-Stop-btn").hidden = false;
  }

export function stopRecording()
  {
    mp3Recorder.stop().getMp3().then(([buffer, blob]) => {
      console.log(buffer, blob);
      const file = new File(buffer, 'audio.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });
      const userId = Auth.currentUserInfo().then((info) => {
        return info.id;
    }).catch((error) => {
        console.log('Error getting user ID:', error);
    });
      Storage.put(`${userId}.mp3`, file, {
        level: "private",
        contentType: file.type
    }).then(() => {
        console.log("Audio file uploaded successfully");
    }).catch((error) => {
        console.error("Error uploading audio file: ", error);
    });
    }).catch((error) => {
      console.error(error);
    });

    document.getElementById("Exit-btn").disabled = false;
    document.getElementById("Mic-Stop-btn").hidden = true;
    document.getElementById("Mic-Record-btn").hidden = false;
  }

export default OpenMicSet;