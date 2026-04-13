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

const FIELD_LABELS = {
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  policyNumber: 'Policy Number',
  effectiveDate: 'Effective Date',
  coverageType: 'Coverage Focus',
  preferredContact: 'Preferred Contact',
  deliveryMethod: 'Delivery Method',
  documentType: 'Document Type',
  changeType: 'Change Type',
  timeline: 'Timeline',
  notes: 'Notes',
  updateType: 'Update Type',
  updatedValue: 'Updated Information',
  preferredDay: 'Preferred Day',
  preferredTime: 'Preferred Time',
  topic: 'Topic',
  incidentDate: 'Date of Incident',
  claimType: 'Claim Type',
  incidentLocation: 'Location of Incident',
};

const FORM_METADATA = {
  consultation: {
    title: 'Personalized Consultation',
    label: 'consultation',
  },
  'document-request': {
    title: 'Request Proof of Insurance or Other Documents',
    label: 'document request',
  },
  'policy-change': {
    title: 'Policy Change',
    label: 'policy change',
  },
  'update-contact-info': {
    title: 'Update Contact Info or Other Insured Items',
    label: 'update contact info',
  },
  'call-request': {
    title: 'Request a Call',
    label: 'call request',
  },
  'claim-report': {
    title: 'Report a Claim',
    label: 'claim report',
  },
};

const FORM_FIELD_ORDER = {
  consultation: ['fullName', 'email', 'phone', 'coverageType', 'preferredContact', 'timeline', 'notes'],
  'document-request': ['fullName', 'email', 'policyNumber', 'deliveryMethod', 'documentType', 'notes'],
  'policy-change': ['fullName', 'email', 'policyNumber', 'effectiveDate', 'changeType', 'notes'],
  'update-contact-info': ['fullName', 'email', 'policyNumber', 'updateType', 'updatedValue', 'notes'],
  'call-request': ['fullName', 'phone', 'preferredDay', 'preferredTime', 'topic', 'notes'],
  'claim-report': ['fullName', 'email', 'policyNumber', 'incidentDate', 'claimType', 'incidentLocation', 'notes'],
};

const FORMAT_LABEL_FIELDS = new Set([
  'coverageType',
  'preferredContact',
  'deliveryMethod',
  'documentType',
  'changeType',
  'updateType',
  'topic',
  'claimType',
]);

const normalizeContactFieldValue = (key, value) => {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  if (FORMAT_LABEL_FIELDS.has(key)) {
    return formatLabel(raw);
  }

  return raw;
};

const getFieldLabel = (key) => FIELD_LABELS[key] || formatLabel(key);

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

const getEmailDeliveryReadiness = () => {
  const recipient = (
    process.env.PALADIN_CONTACT_EMAIL ||
    process.env.EMAIL_USER ||
    ''
  ).trim();
  const transporter = createTransporter();

  return {
    ready: Boolean(recipient && transporter),
    recipient,
    transporter,
  };
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

const getLogoHtml = (logoAsset) =>
  logoAsset
    ? '<img src="cid:paladin-logo" alt="Paladin logo" style="display:block;width:84px;height:auto;object-fit:contain;" />'
    : '<div style="display:inline-flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:18px;background:#eef4fb;color:#012e72;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Paladin</div>';

const getLogoAttachment = (logoAsset) =>
  logoAsset
    ? [
        {
          filename: logoAsset.filename,
          path: logoAsset.path,
          cid: 'paladin-logo',
        },
      ]
    : [];

const renderEmailLayout = ({ title, intro, rowsHtml, detailsLabel, detailsHtml, logoHtml, submittedAt }) => `
  <div style="margin:0;padding:24px;background:radial-gradient(circle at top,#eaf1ff 0%,#f3f6fb 42%,#edf2f8 100%);font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:18px;overflow:hidden;box-shadow:0 16px 40px -28px rgba(1,46,114,0.55);">
      <tr>
        <td style="padding:20px 22px 18px;background:linear-gradient(135deg,#ffffff 0%,#f8fbff 100%);">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr>
              <td style="width:100px;vertical-align:middle;">${logoHtml}</td>
              <td style="vertical-align:middle;padding-left:16px;">
                <div style="font-size:12px;letter-spacing:1.3px;text-transform:uppercase;color:#0b3f8f;font-weight:700;line-height:1.1;">Paladin Professional Insurance Solutions</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;color:#012e72;">${title}</h1>
                <div style="margin-top:8px;font-size:12px;line-height:1.4;color:#64748b;font-weight:600;">
                  Submitted ${submittedAt}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:22px 24px 10px;">
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#4b5563;">${intro}</p>
          <div style="border:1px solid #e4ebf7;border-radius:12px;overflow:hidden;background:#fcfdff;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              ${rowsHtml}
            </table>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 24px 24px;">
          <div style="font-size:12px;color:#667085;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;margin-bottom:8px;">${detailsLabel}</div>
          <div style="background:#f7faff;border:1px solid #dbe8ff;border-radius:12px;padding:14px 15px;font-size:14px;line-height:1.65;color:#1f2937;">
            ${detailsHtml}
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

const sendSimpleContactEmail = async ({ name, email, subject, message }) => {
  const { transporter, recipient } = getEmailDeliveryReadiness();

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
  const contactName = String(name || '').trim();
  const contactEmail = String(email || '').trim();
  const contactSubject = String(subject || '').trim();
  const contactMessage = String(message || '').trim();
  const submittedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fieldRows = [
    { label: 'Full Name', value: contactName },
    { label: 'Email', value: contactEmail },
    { label: 'Subject', value: contactSubject },
  ].map((field) => ({
    ...field,
    htmlValue: escapeHtml(field.value).replace(/\n/g, '<br>'),
  }));

  const detailRowsHtml = fieldRows
    .map(
      (field) => `
                <tr>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;width:38%;font-size:12px;color:#6b7280;font-weight:700;vertical-align:top;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(field.label)}</td>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.6;color:#111827;font-weight:600;">${field.htmlValue}</td>
                </tr>
      `
    )
    .join('');

  const messageHtml = escapeHtml(contactMessage).replace(/\n/g, '<br>');
  const logoAsset = getLogoAsset();
  const logoHtml = getLogoHtml(logoAsset);

  await transporter.sendMail({
    from: senderAddress ? `"${safeName}" <${senderAddress}>` : `"${safeName}" <${email}>`,
    to: recipient,
    replyTo: email,
    subject: `[Paladin Contact] ${subject}`,
    attachments: getLogoAttachment(logoAsset),
    text: [
      'New Contact Form Submission',
      '',
      ...fieldRows.map((field) => `${field.label}: ${field.value}`),
      '',
      'Message:',
      contactMessage,
    ].join('\n'),
    html: renderEmailLayout({
      title: 'New Contact Form Submission',
      intro: 'A new lead has submitted the contact form.',
      rowsHtml: detailRowsHtml,
      detailsLabel: 'Message',
      detailsHtml: messageHtml || '<em style="color:#6b7280;">No message provided.</em>',
      logoHtml,
      submittedAt,
    }),
  });
};

const sendServiceRequestEmail = async (contactData) => {
  const { transporter, recipient } = getEmailDeliveryReadiness();

  if (!recipient || !transporter) {
    throw new Error('Email settings are incomplete.');
  }

  const formType = String(contactData.formType || 'consultation').trim() || 'consultation';
  const submittedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  const metadata = FORM_METADATA[formType] || {
    title: formatLabel(formType),
    label: formatLabel(formType).toLowerCase(),
  };

  const preferredFields = FORM_FIELD_ORDER[formType] || [];
  const appendedFields = Object.keys(contactData).filter(
    (key) => key !== 'formType' && !preferredFields.includes(key)
  );
  const fieldKeys = [...preferredFields, ...appendedFields];

  const notesText = normalizeContactFieldValue('notes', contactData.notes);
  const notesHtml = escapeHtml(notesText).replace(/\n/g, '<br>');

  const fieldRows = fieldKeys
    .map((key) => {
      if (key === 'notes') {
        return null;
      }

      const rawValue = normalizeContactFieldValue(key, contactData[key]);
      if (!rawValue) {
        return null;
      }

      const htmlValue = escapeHtml(rawValue).replace(/\n/g, '<br>');
      return {
        label: getFieldLabel(key),
        textValue: rawValue,
        htmlValue,
      };
    })
    .filter(Boolean);

  const detailRowsHtml = fieldRows
    .map(
      (field) => `
                <tr>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;width:38%;font-size:12px;color:#6b7280;font-weight:700;vertical-align:top;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(field.label)}</td>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.6;color:#111827;font-weight:600;">${field.htmlValue}</td>
                </tr>
      `
    )
    .join('');

  const logoAsset = getLogoAsset();
  const logoHtml = getLogoHtml(logoAsset);

  await transporter.sendMail({
    from: (process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || '').trim(),
    to: recipient,
    subject: `${metadata.title} • ${normalizeContactFieldValue('fullName', contactData.fullName) || 'New Request'}`,
    replyTo: normalizeContactFieldValue('email', contactData.email) || undefined,
    attachments: getLogoAttachment(logoAsset),
    html: renderEmailLayout({
      title: metadata.title,
      intro: `A new lead has submitted the ${metadata.label} form.`,
      rowsHtml:
        detailRowsHtml ||
        `
                <tr>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;width:38%;font-size:12px;color:#6b7280;font-weight:700;vertical-align:top;text-transform:uppercase;letter-spacing:0.5px;">Submission</td>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.6;color:#111827;font-weight:600;">No form fields were provided.</td>
                </tr>
                `,
      detailsLabel: 'Notes',
      detailsHtml: notesHtml || '<em style="color:#6b7280;">No additional notes provided.</em>',
      logoHtml,
      submittedAt,
    }),
    text: [
      metadata.title,
      '',
      ...fieldRows.map((field) => `${field.label}: ${field.textValue}`),
      '',
      'Notes:',
      notesText || 'No additional notes provided.',
    ].join('\n'),
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
    const canPersist = mongoose.connection.readyState === 1;
    const emailReadiness = getEmailDeliveryReadiness();

    if (!canPersist && !emailReadiness.ready) {
      return res.status(503).json({
        error:
          'Contact service is temporarily unavailable. Configure MongoDB or email settings (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS and PALADIN_CONTACT_EMAIL or EMAIL_USER).',
      });
    }

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

      if (emailReadiness.ready) {
        await sendSimpleContactEmail({ name, email, subject, message });
      } else {
        console.warn('Email settings are incomplete. Contact saved without sending email notification.');
      }

      return res.status(201).json({
        success: true,
        message: emailReadiness.ready
          ? 'Contact request submitted and emailed successfully.'
          : 'Contact request submitted successfully.',
        id: contact?._id,
      });
    }

    const fullName = String(body.fullName || '').trim();
    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const contact = await saveContactIfAvailable(body);
    if (emailReadiness.ready) {
      await sendServiceRequestEmail(body);
    } else {
      console.warn('Email settings are incomplete. Service request saved without sending email notification.');
    }

    return res.status(201).json({
      success: true,
      message: emailReadiness.ready
        ? 'Your consultation request has been submitted.'
        : 'Your consultation request has been submitted and saved.',
      contact,
    });
  } catch (err) {
    console.error('Error creating contact:', err);
    return res.status(500).json({ error: err.message || 'Unable to submit your request right now.' });
  }
};
