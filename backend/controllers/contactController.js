const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const toBoolean = (value) => String(value).toLowerCase() === 'true';

const createTransporter = () => {
  const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
  const SMTP_PORT = (process.env.SMTP_PORT || '').trim();
  const SMTP_USER = (process.env.SMTP_USER || '').trim();
  const SMTP_PASS = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  const SMTP_SECURE = (process.env.SMTP_SECURE || '').trim();

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: toBoolean(SMTP_SECURE),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  const recipient = process.env.PALADIN_CONTACT_EMAIL;

  if (!recipient) {
    throw new Error('PALADIN_CONTACT_EMAIL is not configured.');
  }

  if (!transporter) {
    throw new Error('SMTP email settings are incomplete.');
  }

  const fromAddress = (process.env.EMAIL_FROM || process.env.SMTP_USER || '').trim();
  const senderAddress = (process.env.SMTP_USER || '').trim();
  const safeName = String(name || '').replace(/[<>\r\n"]/g, '').trim() || 'Website Visitor';
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSubject = escapeHtml(subject);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br/>');
  const submittedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  await transporter.sendMail({
    from: `"${safeName}" <${email}>`,
    sender: senderAddress || fromAddress,
    to: recipient,
    replyTo: email,
    subject: `[Paladin Contact] ${subject}`,
    text: [
      'New contact form submission',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Submitted: ${submittedAt}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="margin:0;padding:24px;background:#f2f5fb;font-family:Arial,Helvetica,sans-serif;color:#0a1526;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3f2;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px -22px rgba(1,46,114,0.45);">
          <div style="padding:20px 24px;background:linear-gradient(135deg,#012E72,#002DB5);color:#ffffff;">
            <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:1.1px;text-transform:uppercase;opacity:0.9;">Paladin Contact Center</p>
            <h2 style="margin:0;font-size:24px;line-height:1.25;">New Contact Form Submission</h2>
          </div>

          <div style="padding:22px 24px 12px 24px;">
            <div style="display:inline-block;padding:6px 10px;border-radius:999px;background:#eef4ff;border:1px solid #c8d8ff;color:#012E72;font-size:12px;font-weight:700;">
              Submitted ${submittedAt}
            </div>
          </div>

          <div style="padding:8px 24px 0 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
              <tr>
                <td style="width:140px;font-size:13px;color:#5a6473;font-weight:700;vertical-align:top;">Name</td>
                <td style="font-size:15px;color:#111827;font-weight:600;">${escapedName}</td>
              </tr>
              <tr>
                <td style="width:140px;font-size:13px;color:#5a6473;font-weight:700;vertical-align:top;">Email</td>
                <td style="font-size:15px;color:#111827;font-weight:600;">
                  <a href="mailto:${escapedEmail}" style="color:#002DB5;text-decoration:none;">${escapedEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="width:140px;font-size:13px;color:#5a6473;font-weight:700;vertical-align:top;">Subject</td>
                <td style="font-size:15px;color:#111827;font-weight:600;">${escapedSubject}</td>
              </tr>
            </table>
          </div>

          <div style="padding:18px 24px 24px 24px;">
            <div style="border:1px solid #e6ecf8;background:#f9fbff;border-radius:12px;padding:16px;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#5a6473;font-weight:700;">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#0f172a;">${escapedMessage}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  });
};

exports.createContact = async (req, res) => {
  try {
    const { name = '', email = '', subject = '', message = '' } = req.body;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    await contact.save();

    await sendContactEmail(contact);

    return res.status(201).json({
      message: 'Contact request submitted and emailed successfully.',
      id: contact._id,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Unable to submit your request right now.',
    });
  }
};
