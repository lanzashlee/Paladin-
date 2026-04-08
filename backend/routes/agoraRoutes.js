const express = require('express');
const { getAgoraRtcToken } = require('../controllers/agoraController');

const router = express.Router();

router.get('/agora/token', getAgoraRtcToken);

module.exports = router;
