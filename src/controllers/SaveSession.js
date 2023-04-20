// Import the Session model from the models file
import { Session } from '../models';

// Import the DataStore from the Amplify library
import { DataStore } from '@aws-amplify/datastore';

// Define an asynchronous function that saves a session object to the DataStore
export async function SaveSession(clips, startTime, endTime) {
  
  // Create a session object with the given clips, start time, and end time
  const session = new Session({
    "start": startTime.toISOString(),
    "end": endTime.toISOString(),
    "clip": clips
  });
  
  // Check if the clips object is empty or undefined
  if (!clips.Clips || clips.Clips.length === 0) {
    console.log('Clip object was empty. Session not saved to DataStore.');
    return; // Exit the function if the clips object is empty
  }
  else {
    try {
      // Save the session object to the DataStore
      await DataStore.save(session);
      console.log('Session saved to DataStore:', session);
    } catch (error) {
      console.error('Error saving session to DataStore:', error);
    }
  }
}
