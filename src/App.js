// Import required dependencies
import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import "./App.css";

import AddPet from "./pages/Pets/AddPet";
import Clip from "./pages/Clips/Clip"
import Clips from "./pages/Clips/Clips";
import Footer from "./pages/Footer/Footer";
import Home from "./pages/Home/Home";
import Navbar from "./pages/Navbar/Navbar";
import NotFound from "./pages/NotFound/NotFound";
import Pet from "./pages/Pets/Pet";
import Pets from "./pages/Pets/Pets";
import Profile from "./pages/Profile/Profile";
import Test from "./pages/Test/Test";
import Trick from "./pages/Tricks/Trick";
import Tricks from "./pages/Tricks/Tricks";
import tricksData from './models/tricks.json';

// Import Amplify Package's and Auth
import { Amplify, API, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
// Amplify DataStore
import { DataStore } from '@aws-amplify/datastore';


// Main function
function App({ user }) {
  // Function to handle the auth state change
  const handleAuthStateChange = (authState) => {
    if (authState === 'signedout') {
      console.log('User is signed out');
      // Clear the DataStore when the user signs out, this prevents data leaking from one user to the next
      DataStore.clear();
      console.log('Data cleared afer signed out');
    }
  }

  // Function to sign out the user
  const signOut = () => {
    Auth.signOut()
      .then(() => {
        // Call handleAuthStateChange when the user signs out
        handleAuthStateChange('signedout');
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  };


  const tricks = tricksData
  //Return app Router Navigation
  return (
    <div className="App">
      <Router>
        <Navbar firstName={user.attributes.name.split(' ')[0]} signOut={signOut}> </Navbar>
        <img src='pawTrack.png' className='bigPawTrack'></img>
        <div className='mainContent'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/clips' element={<Clips />} />
          <Route path='/clips/:id' element={<Clip />} />
          <Route path='/pets' element={<Pets />} />
          <Route path='/pets/addPet' element={<AddPet />} />
          <Route path='/pets/:id' element={<Pet />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/test' element={<Test />} />
          <Route path='/tricks' element={<Tricks tricks={tricks} />} />
          <Route path='/tricks/:trick' element={<Trick tricks={tricks} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}
export default withAuthenticator(App);
