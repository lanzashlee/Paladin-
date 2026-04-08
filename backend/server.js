const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Example route
app.get('/', (req, res) => {
  res.send('Paladin Insurance API');
});

// Modular routes
const contactRoutes = require('./routes/contactRoutes');
const voiceChatRoutes = require('./routes/voiceChatRoutes');
const agoraRoutes = require('./routes/agoraRoutes');
app.use('/api', contactRoutes);
app.use('/api', voiceChatRoutes);
app.use('/api', agoraRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paladin';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection failed. Contact form persistence may be unavailable.', err.message);
  });
