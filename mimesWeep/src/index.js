import './style/index.css';
import * as gameSettings from './logic/gameSettings.js';
import * as highScoreDB from './logic/highScoreDB.js';
import MimesWeep from './components/mimesWeep.js';
import ReactDOM from 'react-dom/client';
import React from 'react';
import reportWebVitals from './reportWebVitals.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Clear local storage if set
if (gameSettings.clearLocalStorageOnStartup) {
  localStorage.clear();
}

// Setup and sync the data store
highScoreDB.init();

// Set a different secondary color on our theme
const theme = createTheme({
  palette: {
    secondary: {
      main: '#ffcf33',
      contrastText: '#fff'
    }
  }
});

// Render parent component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MimesWeep />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();