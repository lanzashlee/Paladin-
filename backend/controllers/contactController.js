const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Contact = require('../models/Contact');

const toBoolean = (value) => String(value || '').toLowerCase() === 'true';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatLabel = (value = '') =>
  String(value)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const createTransporter = () => {
  const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
  const SMTP_PORT = (process.env.SMTP_PORT || '').trim();
  const SMTP_USER = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const SMTP_PASS = (
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.EMAIL_PASSWORD ||
    ''
  ).trim();
  const SMTP_SECURE = (process.env.SMTP_SECURE || '').trim();

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: toBoolean(SMTP_SECURE),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  if (SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return null;
};

const isRealPng = (filePath) => {
  try {
    const signature = fs.readFileSync(filePath).subarray(0, 8);
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    return signature.equals(pngSignature);
  } catch (_error) {
    return false;
  }
};

const getLogoAsset = () => {
  const backendPng = path.join(__dirname, '../assets/paladin.png');
  const frontendPng = path.join(__dirname, '../../frontend/src/assets/paladin.png');

  if (fs.existsSync(backendPng) && isRealPng(backendPng)) {
    return { path: backendPng, filename: 'paladin.png' };
  }

  if (fs.existsSync(frontendPng) && isRealPng(frontendPng)) {
    return { path: frontendPng, filename: 'paladin.png' };
  }

  return null;
};

const sendSimpleContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  const recipient = (process.env.PALADIN_CONTACT_EMAIL || '').trim();

  if (!recipient || !transporter) {
    throw new Error('Email settings are incomplete.');
  }

  const senderAddress = (
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    ''
  ).trim();
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
    from: senderAddress ? `"${safeName}" <${senderAddress}>` : `"${safeName}" <${email}>`,
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

const sendServiceRequestEmail = async (contactData) => {
  const transporter = createTransporter();
  const recipient = (process.env.PALADIN_CONTACT_EMAIL || '').trim();

  if (!recipient || !transporter) {
    throw new Error('Email settings are incomplete.');
  }

  const {
    formType = 'consultation',
    fullName,
    email,
    phone,
    policyNumber,
    effectiveDate,
    coverageType,
    preferredContact,
    deliveryMethod,
    documentType,
    changeType,
    timeline,
    notes,
  } = contactData;

  const safeNotes = escapeHtml(notes).replace(/\n/g, '<br>');
  const safeFullName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safePolicyNumber = escapeHtml(policyNumber);
  const safeEffectiveDate = escapeHtml(effectiveDate);
  const safeCoverageType = escapeHtml(formatLabel(coverageType));
  const safePreferredContact = escapeHtml(formatLabel(preferredContact));
  const safeDeliveryMethod = escapeHtml(formatLabel(deliveryMethod));
  const safeDocumentType = escapeHtml(formatLabel(documentType));
  const safeChangeType = escapeHtml(formatLabel(changeType));
  const safeTimeline = escapeHtml(timeline);
  const hasEmail = Boolean(email && String(email).trim());
  const emailRowHtml = hasEmail
    ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeEmail}</td>
                </tr>
      `
    : '';

  let emailTitle = 'Personalized Consultation';
  let subjectPrefix = 'Personalized Consultation';
  let submittedFormLabel = 'consultation';
  let detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Phone</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePhone}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Coverage Focus</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeCoverageType}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Preferred Contact</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePreferredContact}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Timeline</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeTimeline}</td>
                </tr>
  `;

  if (formType === 'document-request') {
    emailTitle = 'Request Proof of Insurance or Other Documents';
    subjectPrefix = 'Request Proof of Insurance or Other Documents';
    submittedFormLabel = 'document request';
    detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Policy Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePolicyNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Document Type</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeDocumentType}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Delivery Method</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeDeliveryMethod}</td>
                </tr>
  `;
  }

  if (formType === 'policy-change') {
    emailTitle = 'Policy Change';
    subjectPrefix = 'Policy Change';
    submittedFormLabel = 'policy change';
    detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Policy Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePolicyNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Change Type</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeChangeType}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Effective Date</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeEffectiveDate}</td>
                </tr>
  `;
  }

  const logoAsset = getLogoAsset();
  const logoHtml = logoAsset
    ? '<img src="cid:paladin-logo" alt="Paladin logo" style="display:block;width:84px;height:auto;object-fit:contain;" />'
    : '<div style="display:inline-flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:18px;background:#eef4fb;color:#012e72;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Paladin</div>';

  await transporter.sendMail({
    from: (process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || '').trim(),
    to: recipient,
    subject: `${subjectPrefix} • ${safeFullName}`,
    replyTo: email || undefined,
    attachments: logoAsset
      ? [
          {
            filename: logoAsset.filename,
            path: logoAsset.path,
            cid: 'paladin-logo',
          },
        ]
      : [],
    html: `
      <div style="margin:0;padding:24px;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:18px 22px;background:#ffffff;border-bottom:1px solid #dbe4f0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="width:100px;vertical-align:middle;">${logoHtml}</td>
                  <td style="vertical-align:middle;padding-left:16px;">
                    <div style="font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:#012e72;font-weight:700;line-height:1.1;">Paladin Professional Insurance Solutions</div>
                    <h1 style="margin:6px 0 0;font-size:22px;line-height:1.2;color:#012e72;">${emailTitle}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px 14px;">
              <p style="margin:0 0 12px;font-size:14px;color:#4b5563;">A new lead has submitted the ${submittedFormLabel} form.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Full Name</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:600;">${safeFullName}</td>
                </tr>
                ${emailRowHtml}
                ${detailRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;">
              <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Coverage Details</div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;color:#1f2937;">
                ${safeNotes || '<em style="color:#6b7280;">No additional details provided.</em>'}
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `
${emailTitle}

Full Name: ${fullName || 'N/A'}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}
Policy Number: ${policyNumber || 'N/A'}
Coverage Focus: ${formatLabel(coverageType || '') || 'N/A'}
Preferred Contact: ${formatLabel(preferredContact || '') || 'N/A'}
Delivery Method: ${formatLabel(deliveryMethod || '') || 'N/A'}
Document Type: ${formatLabel(documentType || '') || 'N/A'}
Change Type: ${formatLabel(changeType || '') || 'N/A'}
Effective Date: ${effectiveDate || 'N/A'}
Timeline: ${timeline || 'N/A'}

Coverage Details:
${notes || 'No additional details provided.'}
    `,
  });
};

const saveContactIfAvailable = async (data) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB unavailable. Skipping contact persistence and sending email only.');
    return null;
  }

  const contact = new Contact(data);
  await contact.save();
  return contact;
};

exports.createContact = async (req, res) => {
  try {
    const body = req.body || {};

    const isSimpleContact =
      'name' in body ||
      'subject' in body ||
      'message' in body;

    if (isSimpleContact) {
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim();
      const subject = String(body.subject || '').trim();
      const message = String(body.message || '').trim();

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
      }

      const contact = await saveContactIfAvailable({
        name,
        fullName: name,
        email,
        subject,
        message,
        formType: 'consultation',
      });

      await sendSimpleContactEmail({ name, email, subject, message });

      return res.status(201).json({
        success: true,
        message: 'Contact request submitted and emailed successfully.',
        id: contact?._id,
      });
    }

    const fullName = String(body.fullName || '').trim();
    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const contact = await saveContactIfAvailable(body);
    await sendServiceRequestEmail(body);

    return res.status(201).json({
      success: true,
      message: 'Your consultation request has been submitted.',
      contact,
    });
  } catch (err) {
    console.error('Error creating contact:', err);
    return res.status(500).json({ error: err.message || 'Unable to submit your request right now.' });
  }
};
