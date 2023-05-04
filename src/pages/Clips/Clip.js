import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Storage } from 'aws-amplify';
import './Clip.css'

function Clip() {
    const { id } = useParams();
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        async function fetchVideoUrl() {
            const url = await Storage.get(id, { level: 'private' });
            setVideoUrl(url);
        }
        fetchVideoUrl();
    }, [id]);

    return (
        <>
            <h1>Single Clip Page: {id}</h1>
            <div className="video-container">
                <video controls src={videoUrl}></video>
            </div>
        </>
    )
}
export default Clip