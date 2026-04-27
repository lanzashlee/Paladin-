const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
// Allow larger JSON bodies for payloads that include base64 file attachments.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const isContactPersistenceEnabled = () =>
  String(process.env.CONTACT_PERSISTENCE_ENABLED || 'true').toLowerCase() !== 'false';


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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paladin';

let mongoConnectionPromise = null;

function connectToMongo() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('MongoDB connected');
      })
      .catch((err) => {
        mongoConnectionPromise = null;
        console.error('MongoDB connection failed. Contact form persistence may be unavailable.', err.message);
      });
  }

  return mongoConnectionPromise;
}

if (isContactPersistenceEnabled()) {
  connectToMongo();
} else {
  console.log('MongoDB connection skipped (CONTACT_PERSISTENCE_ENABLED=false).');
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
