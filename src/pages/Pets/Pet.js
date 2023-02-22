// Import required dependencies
import React, { useEffect, useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { useParams } from 'react-router-dom';
import { Pet as PetModel } from '../../models';
import PhotoUpload from '../../controllers/PhotoUpload';
import PhotoDownload from '../../controllers/PhotoDownload';
import VideoUpload from '../../controllers/VideoUpload';
import VideoDownload from '../../controllers/VideoDownload';
import { PetUpdateForm } from '../../ui-components';

import './Pet.css';


function Pet() {
  // Get the ID parameter from the URL using `useParams` hook
  const { id } = useParams();

  // Declare state variable to store the pet object
  const [pet, setPet] = useState([]);

  // Fetch the pet data from DataStore using the `id` parameter
  useEffect(() => {
    const getDate = async () => {
      // Use the `query` method to retrieve the pet data from DataStore
      const post = await DataStore.query(PetModel, id);
      // Update the `pet` state variable with the retrieved data
      setPet(post)
      // Log the retrieved pet data to the console
      console.log(post)
    }
    getDate();
  }, [])
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
    } catch (error) {
      console.log('Error updating pet', error);
    }
  };

  // Render the pet information on the page
  return (
    <>
      <h1>Single Pet Page: {pet.name} </h1>
      <p>Weight: {pet.weight}</p>
      <p>Age: {pet.age}</p>
      <p>Type: {pet.type}</p>
      <p>Breed: {pet.breed}</p>
      <p>Description: {pet.desc}</p>
      <br />
      <hr />
      <PetUpdateForm pet={pet} onSubmit={handleUpdate} />
      <br />
      <hr />
      <PhotoUpload />
      <PhotoDownload />
      <br />
      <hr />
      <VideoUpload />
      <VideoDownload />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}
export default Pet
