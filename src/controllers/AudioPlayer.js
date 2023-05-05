import React, { useState } from "react";
import { Storage } from "@aws-amplify/storage"
import { Auth } from 'aws-amplify';

//Call To Play Sounds
const useAudioPlayer = (filename) => {
    const [audioUrl, setAudioUrl] = useState(null);

    const playAudio = async () => {
        const userId = Auth.currentUserInfo().then((info) => {
            return info.id;
        }).catch((error) => {
            console.log('Error getting user ID:', error);
        });
        const downloadUrl = await Storage.get(filename, { level: "private" });
        setAudioUrl(downloadUrl);
        const audio = new Audio(downloadUrl);
        audio.play();
    };

    return [playAudio, audioUrl];
};

const AudioPlayer = () => {
    const userId = Auth.currentUserInfo().then((info) => {
        return info.id;
    }).catch((error) => {
        console.log('Error getting user ID:', error);
    });
    const [playAudio, audioUrl] = useAudioPlayer(`${userId}.mp3`);

    return (
        <div>
            <button onClick={playAudio}>Play Audio</button>
            {audioUrl && (
                <div>
                    <audio>
                        <source src={audioUrl} type="audio/mpeg" />
                    </audio>
                </div>
            )}
        </div>
    );
};
export default AudioPlayer;