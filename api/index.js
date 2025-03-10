const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:5175' }));
app.use(express.json());

app.get('/xai', (req, res) => {
  res.send('This endpoint requires a POST request with a JSON body. Use curl or a form to test.');
});

app.post('/xai', async (req, res) => {
  const { prompt } = req.body;
  // Your xAI logic here
  res.json({ message: `Hello there! I'm Grok...` });
});

app.get('/history', (req, res) => {
  // Your history logic here
  res.json([]); // Placeholder
});

module.exports = app;