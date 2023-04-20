import React from 'react';
import { useParams } from 'react-router-dom';
import './AddPet.css';
import { PetCreateForm } from '../../ui-components';


function AddPet(props) {
    const {onFormClose} = props;

    return (
        <>
            <h1>Add Pet</h1>
            <PetCreateForm onCancel={onFormClose} onSuccess={onFormClose} />
        </>
    )
    
}

export default AddPet