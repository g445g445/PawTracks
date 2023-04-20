// Import required dependencies
import React, { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Pet as PetModel } from '../../models';
import PhotoUpload from '../../controllers/PhotoUpload';
import PhotoDownload from '../../controllers/PhotoDownload';
import VideoUpload from '../../controllers/VideoUpload';
import VideoDownload from '../../controllers/VideoDownload';
import { PetUpdateForm } from '../../ui-components';

import { useNavigate } from 'react-router-dom';

import './Pet.css';

function Pet(props) {
  
  const {onFormClose, petId} = props;
  console.log('props.petId', props.petId);

  let navigate = useNavigate();

  // Declare state variable to store the pet object
  const [pet, setPet] = useState([]);

  // Fetch the pet data from DataStore using the `id` parameter
  useEffect(() => {
    const getDate = async () => {
      // Use the `query` method to retrieve the pet data from DataStore
      const post = await DataStore.query(PetModel, petId);
      // Update the `pet` state variable with the retrieved data
      setPet(post)
      // Log the retrieved pet data to the console
      console.log(post)
      console.log('petId:', petId);
    }
    getDate();
  }, [petId])
  // Define the handleUpdate function
  const handleUpdate = async (fields) => {
    try {
      const original = await DataStore.query(PetModel, pet.id);
      await DataStore.save(
        PetModel.copyOf(original, updated => {
          updated.name = fields.name;
          updated.weight = fields.weight;
          updated.age = fields.age;
          updated.type = fields.type;
          updated.breed = fields.breed;
          updated.desc = fields.desc;
          updated.img = fields.img;
        })
      );
      // Update the `pet` state variable with the new data
      setPet(fields);

      console.log('Updated successfully');
      navigate('/pets');
    } catch (error) {
      console.log('Error updating pet', error);
    }
  };

  // Define the handleCancel function
  const handleCancel = async (fields) => {
    try {
      navigate('/pets');
    } catch (error) {
      console.log('Cancellation error: ', error);
    }
  }

  // Render the pet information on the page
  return (
    <div className='edit-pet-container'>
      <h1>Edit Pet: {pet.name}</h1>
      <br />
      {console.log("PET ID: " + petId)}
      <PhotoUpload id={petId}/>
      <br />
      <PetUpdateForm pet={pet} onSubmit={handleUpdate} onCancel={onFormClose} onSuccess={onFormClose} padding={'0'} />
    </div>
  )
}
export default Pet
