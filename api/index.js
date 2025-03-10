const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:5175', 'https://syncserv-widget.vercel.app']
}));
app.use(express.json());

app.get('/xai', (req, res) => {
  res.send('This endpoint requires a POST request with a JSON body. Use curl or a form to test.');
});

app.post('/xai', async (req, res) => {
  const { prompt } = req.body;
  res.json({ message: `Hello there! I'm Grok...` });
});

app.get('/history', (req, res) => {
  res.json([]); // Placeholder
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
  res.send('Welcome to SyncServ.ai Backend! Use /xai for the API.');
});