require('dotenv').config(); // Add this at the top
const express = require('express');
const { initializeApp } = require('firebase/app');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
initializeApp(firebaseConfig);

app.get('/health', (req, res) => res.send('Firebase ready'));

app.get('/xai', async (req, res) => {
  try {
    const mockResponse = { message: 'Hello from xAI! I’m here to help.' };
    res.send(mockResponse);
  } catch (error) {
    res.status(500).send('xAI error');
  }
});

app.listen(3001, () => console.log('Server running on 3001'));