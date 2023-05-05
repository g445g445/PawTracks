import React, { useState, useEffect } from "react";
import { Storage } from "@aws-amplify/storage";
import { Auth } from "aws-amplify";

// Function to play audio on event detection
export const playAudioOnEvent = async () => {
    // Get the user ID
    const userId = Auth.currentUserInfo().then((info) => {
        return info.id;
    }).catch((error) => {
        console.log('Error getting user ID:', error);
    });

    // Log the user ID and file name to the console
    console.log("getting user ID:", userId, ".mp3");

    // Get the download URL for the audio file
    const downloadUrl = await Storage.get(`${userId}.mp3`, { level: "private" });

    // Create a new Audio object and play the audio
    const audio = new Audio(downloadUrl);
    audio.play();

    // Log a message to the console indicating that the audio should have played
    console.log("Audio should have been played")
};
