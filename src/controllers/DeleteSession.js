import React from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Storage } from '@aws-amplify/storage';
import { Button } from '@aws-amplify/ui-react';
import { Session } from '../models';

const DeleteSession = ({ session }) => {
    const handleClick = async () => {
        try {
            // Delete each clip associated with the session from S3
            for (const clip of session.clip.Clips) {
                await Storage.remove(clip.fileName, { level: 'private' });
            }

            // Delete the session from DataStore
            await DataStore.delete(Session, session.id);

            console.log(`Session ${session.id} and associated clips deleted successfully.`);
        } catch (error) {
            console.error('Error deleting session and associated clips:', error);
        }
    };

    // Render a button that calls handleClick when clicked
    return <Button onClick={handleClick}>Delete Session</Button>;
};
export default DeleteSession;