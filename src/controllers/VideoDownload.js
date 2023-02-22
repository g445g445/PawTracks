import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage";

// Define a functional component named FileDownload
const VideoDownload = () => {

    // Declare the videoData state variable using the useState hook, initially set to null
    const [videoData, setVideoData] = useState(null);

    // Get the ID parameter from the URL using useParams hook
    const { id } = useParams();

    // Define a function to handle the download of the file
    const handleDownload = async () => {


        // Retrieve the download URL for the private video from AWS S3 using the Storage.get method
        const downloadUrl = await Storage.get(`${id}.mp4`, { level: "private" });

        // Fetch the video using the download URL
        const response = await fetch(downloadUrl);

        // Retrieve the binary data of the video as a blob object
        const blob = await response.blob();

        // Convert the blob object into a URL using the createObjectURL method
        setVideoData(URL.createObjectURL(blob));
    };

    // Render a button to trigger the download and a video element to display the downloaded video
    return (
        <div>
            <button onClick={handleDownload}>Download Video</button>
            {videoData && <video src={videoData} controls />}
        </div>
    );
};
// Export the FileDownload component as a default export
export default VideoDownload;