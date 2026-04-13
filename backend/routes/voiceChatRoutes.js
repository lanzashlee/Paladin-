const express = require('express');
const { askVoiceAssistant, synthesizeVoice } = require('../controllers/voiceChatController');

const router = express.Router();

router.post('/voice-chat', askVoiceAssistant);
router.post('/voice-chat/synthesize', synthesizeVoice);

module.exports = router;
