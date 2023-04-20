// Import required dependencies
import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage";

const PhotoUpload = ({id}) => {
    // Declare a state variable to store the selected file
    const [file, setFile] = useState(null);
    

    // Event handler for file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        console.log(id);
    };

    // Event handler for file upload OLD
    const handleUpload = async () => {
        // Use Amplify Storage to upload the file with the given ID as filename
        await Storage.put(`${id}.png`, file, {
            level: "private",
            contentType: file.type,
        });
        console.log("File uploaded successfully");
    };

    // Render a file input and a button to upload the selected file
    return (
        <div>
            <input type="file" className="amplify-button amplify-field-group__control amplify-button--outline" onChange={handleFileChange} />
            <br />
            <br />
            <button className="amplify-button amplify-field-group__control amplify-button--primary" onClick={handleUpload}>Upload File</button>
        </div>
    );
};
export default PhotoUpload;