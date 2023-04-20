import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage"
import { DataStore } from '@aws-amplify/datastore';
import { Session } from '../models';

//THIS CODE IS NOT USED ANYMORE

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
        if (id) {
            // Use Amplify Storage to upload the file with the given ID as filename
            await Storage.put(`${id}.mp4`, file, {
                level: "private",
                contentType: file.type,
            });

            // Create a clips object with the necessary information
            const clips = {
                "Clips": [
                    {
                        "start": "start time",
                        "end": "end time",
                        "IncidentList": [
                            "type, petType, time",
                            "type, petType, time"
                        ],
                        "fileName": `${id}.mp4`
                    }
                ]
            };

            // Create a session object with the clips object
            const session = new Session({
                "start": "1970-01-01T12:30:23.999Z",
                "end": "1970-01-01T12:30:23.999Z",
                "clip": clips
            });

            // Save the session object to the Datastore
            await DataStore.save(session);

            console.log("Video File uploaded successfully");
        } else {
            console.log("ID is not defined, cannot upload file or save session");
        }
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
