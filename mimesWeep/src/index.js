import './style/index.css';
import * as datastore from './resources/config/datastore.js';
import MimesWeep from './components/mimesWeep.js';
import ReactDOM from 'react-dom/client';
import React from 'react';
import reportWebVitals from './reportWebVitals.js';
import { Amplify } from 'aws-amplify';

// Setup datastore
Amplify.configure(datastore.settings);

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