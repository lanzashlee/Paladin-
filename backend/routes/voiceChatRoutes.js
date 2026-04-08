const express = require('express');
const { askVoiceAssistant } = require('../controllers/voiceChatController');

const router = express.Router();

router.post('/voice-chat', askVoiceAssistant);

module.exports = router;
