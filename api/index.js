require('dotenv').config();
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('@firebase/firestore');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.get('/health', (req, res) => res.send('Firebase ready'));

app.post('/xai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Prompt required' });

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        model: 'grok-2-latest',
        stream: false,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const message = response.data.choices[0].message.content;

    // Save to Firestore
    await addDoc(collection(db, 'chatHistory'), {
      prompt,
      response: message,
      timestamp: new Date().toISOString()
    });

    res.send({ message });
  } catch (error) {
    res.status(500).send({ error: 'xAI error', details: error.response?.data || error.message });
  }
});

// New endpoint for history
app.get('/history', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'chatHistory'));
    const history = snapshot.docs.map(doc => doc.data());
    res.send(history);
  } catch (error) {
    res.status(500).send({ error: 'Firestore error', details: error.message });
  }
});

app.listen(3001, () => console.log('Server running on 3001'));
app.get('/xai', (req, res) => {
  res.send('This endpoint requires a POST request with a JSON body. Use curl or a form to test.');
});