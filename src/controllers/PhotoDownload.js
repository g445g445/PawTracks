// Import required dependencies
import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Storage } from "@aws-amplify/storage";

// Define a functional component named FileDownload
const PhotoDownload = () => {

  // Declare the imageData state variable using the useState hook, initially set to null
  const [imageData, setImageData] = useState(null);

  // Get the ID parameter from the URL using `useParams` hook
  const { id } = useParams();

  // Define a function to handle the download of the file
  const handleDownload = async () => {

    // Retrieve the download URL for the private image from AWS S3 using the Storage.get method
    const downloadUrl = await Storage.get(`${id}.png`, { level: "private" });

    // Fetch the image using the download URL
    const response = await fetch(downloadUrl);

    // Retrieve the binary data of the image as a blob object
    const blob = await response.blob();

    // Convert the blob object into a URL using the createObjectURL method
    setImageData(URL.createObjectURL(blob));
  };

  // Render a button to trigger the download and an image element to display the downloaded image
  return (
    <div>
      <button onClick={handleDownload}>Download Image</button>
      {imageData && <img src={imageData} alt="Paw Tracks" />}
    </div>
  );
};
// Export the FileDownload component as a default export
export default PhotoDownload;




