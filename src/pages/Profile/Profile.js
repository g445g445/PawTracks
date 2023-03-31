import React from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { SliderField } from '@aws-amplify/ui-react';


function Profile() {
    return (
        <>
            <h1>Profile</h1>
            <h1>Settings</h1>
            <SliderField label='Minimum Confidence:' max={1} step={0.1} size='large' filledTrackColor="var(--secondaryColor)" thumbColor="var(--backgroundColor)"/>
        </>
    )
    
}

export default Profile