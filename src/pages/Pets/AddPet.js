import React from 'react';
import { useParams } from 'react-router-dom';
import './AddPet.css';
import { PetCreateForm } from '../../ui-components';


function AddPet() {
    return (
        <>
            <h1>Add Pet</h1>
            <PetCreateForm />
        </>
    )
    
}

export default AddPet