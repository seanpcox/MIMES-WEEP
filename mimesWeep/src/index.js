import './style/index.css';
import * as highScoreDB from './logic/highScoreDB.js';
import MimesWeep from './components/mimesWeep.js';
import ReactDOM from 'react-dom/client';
import React from 'react';
import reportWebVitals from './reportWebVitals.js';

// Setup and sync the data store
highScoreDB.configure();

// Render parent component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MimesWeep />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();