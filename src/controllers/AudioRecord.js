import OpenMicSet from '../pages/Audio/Audio.js'
import React, { useState } from "react";
import { useParams } from 'react-router-dom';

const AudioRecord = () => {

    const[buttonMic, setButtonMic] = useState(false);

    return (
        <div>
            <button onClick={() => setButtonMic(true)}>Set Audio</button>
        <OpenMicSet trigger={buttonMic} setTrigger={setButtonMic}>
            <h3>Edit Audio</h3>
          </OpenMicSet>
        </div>
    );
};
export default AudioRecord;