const { RtcTokenBuilder, RtcRole } = require('agora-token');

const DEFAULT_TTL_SECONDS = 3600;

exports.getAgoraRtcToken = (req, res) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return res.status(400).json({
      error: 'Agora is not configured. Add AGORA_APP_ID and AGORA_APP_CERTIFICATE in backend .env.',
    });
  }

  const channel = String(req.query.channel || 'paladin-voice').trim();
  const uid = Number(req.query.uid || 0);

  if (!channel) {
    return res.status(400).json({ error: 'Channel is required.' });
  }

  if (!Number.isInteger(uid) || uid < 0) {
    return res.status(400).json({ error: 'UID must be a positive integer or 0.' });
  }

  const now = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = now + DEFAULT_TTL_SECONDS;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    RtcRole.PUBLISHER,
    privilegeExpireTime
  );

  return res.status(200).json({
    appId,
    channel,
    uid,
    token,
    expiresIn: DEFAULT_TTL_SECONDS,
  });
};
