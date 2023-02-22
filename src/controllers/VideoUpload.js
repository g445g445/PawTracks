import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage"

const VideoUpload = () => {
    // Declare a state variable to store the selected file
    const [file, setFile] = useState(null);
    // Get the ID parameter from the URL using `useParams` hook
    const { id } = useParams();

    // Event handler for file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log(id);
    };

    // Event handler for file upload
    const handleUpload = async () => {
        // Use Amplify Storage to upload the file with the given ID as filename
        await Storage.put(`${id}.mp4`, file, {
            level: "private",
            contentType: file.type,
        });
        console.log("Video File uploaded successfully");
    };

    // Render a file input and a button to upload the selected file
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
        </div>
    );
};
export default VideoUpload;