import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage"
import { v4 as uuidv4 } from 'uuid';

const VideoUploadExtended = ({ href, uid }) => {
    // Declare a state variable to store the video file
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    // TODO: Will use to save the video
    const { v4: uuidv4 } = require('uuid');

    // Convert the provided href to a video file and store it in the state
    const getVideoFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();
        const videoFile = new File([data], `${uid}.mp4`, { type: "video/mp4" });
        setFile(videoFile);
    };

    // Call getVideoFile when the component mounts to convert the href to a video file
    useEffect(() => {
        getVideoFile(href);
    }, [href]);

    // Event handler for file upload
    const handleUpload = async () => {
        // Use Amplify Storage to upload the video file with the given ID as filename
        await Storage.put(`${uid}.mp4`, file, {
            level: "private",
            contentType: file.type,
            progressCallback: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setProgress(progress);
            }
        });
        console.log("Video file uploaded successfully");
        console.log(uid)
    };

    // Trigger handleUpload when the file state is updated
    useEffect(() => {
        if (file) {
            handleUpload();
        }
    }, [file]);

    // Render a div to display the upload status
    return (
        <div>
            {file ? (
                <div>
                    <p>Uploading video...</p>
                    <progress max="100" value={progress}></progress>
                </div>
            ) : (
                <p>Converting video file...</p>
            )}
        </div>
    );
};
export default VideoUploadExtended;
