import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


import { Amplify, AuthModeStrategyType } from 'aws-amplify'
import awsconfig from './aws-exports'

import { ThemeProvider, createTheme } from "@aws-amplify/ui-react"
import { studioTheme } from './ui-components';

const updatedTheme = createTheme({
  name: "my-theme-updates",
  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: {
            value: "var(--secondaryColor)"
          },
          color: {
            value: "var(--backgroundColor)"
          },
          _hover : {
            backgroundColor: {
              value: "black"
            }
          }
        }
      }
    }
  }
}, studioTheme)


Amplify.configure({
  ...awsconfig,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={updatedTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,

  document.getElementById('root')
);

