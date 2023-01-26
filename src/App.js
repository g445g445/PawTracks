// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "./App.css";

import Home from "../src/components/Home/Home"

// Import Amplify Package's and Auth
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

// Amplify DataStore
import { DataStore } from '@aws-amplify/datastore';
import { LoginList } from './models';

Amplify.configure(awsconfig);
Amplify.configure(awsExports);

function App({ signOut, user }) {
  // Main function
  async function saveLogin() {

    // Save login to database TODO:Remove, this is a poc of impimentation
    await DataStore.save(
      new LoginList({
        "UID": user.username
      })
    );

    // get login list TODO:Remove, this is a poc of impimentation
    const models = await DataStore.query(LoginList);
    console.log(models.length)
  };

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default withAuthenticator(App);
