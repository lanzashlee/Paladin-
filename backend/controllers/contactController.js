const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Contact = require('../models/Contact');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatLabel = (value = '') =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

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
    return {
      path: backendPng,
      filename: 'paladin.png',
    };
  }

  if (fs.existsSync(frontendPng) && isRealPng(frontendPng)) {
    return {
      path: frontendPng,
      filename: 'paladin.png',
    };
  }

  if (fs.existsSync(backendPng) || fs.existsSync(frontendPng)) {
    console.warn('Logo file found but it is not a real PNG. Skipping logo embed.');
  }

  return null;
};

const sendEmail = async (contactData) => {
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
  const emailTextLine = hasEmail ? `Email: ${email}\n` : '';

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

  if (formType === 'update-contact-info') {
    emailTitle = 'Update Contact Info or Other Insured Items';
    subjectPrefix = 'Update Contact Info or Other Insured Items';
    submittedFormLabel = 'account update';
    detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Policy Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePolicyNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Update Type</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(formatLabel(contactData.updateType || ''))}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Updated Value</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(contactData.updatedValue || '')}</td>
                </tr>
    `;
  }

  if (formType === 'call-request') {
    emailTitle = 'Request a Call';
    subjectPrefix = 'Request a Call';
    submittedFormLabel = 'call request';
    detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Phone</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePhone}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Preferred Day</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(contactData.preferredDay || '')}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Preferred Time</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(contactData.preferredTime || '')}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Topic</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(formatLabel(contactData.topic || ''))}</td>
                </tr>
    `;
  }

  if (formType === 'claim-report') {
    emailTitle = 'Report a Claim';
    subjectPrefix = 'Report a Claim';
    submittedFormLabel = 'claim report';
    detailRows = `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Policy Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safePolicyNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Incident Date</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(contactData.incidentDate || '')}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Claim Type</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(formatLabel(contactData.claimType || ''))}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:38%;font-size:13px;color:#6b7280;">Incident Location</td>
                  <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${escapeHtml(contactData.incidentLocation || '')}</td>
                </tr>
    `;
  }

  const logoAsset = getLogoAsset();
  const logoHtml = logoAsset
    ? '<img src="cid:paladin-logo" alt="Paladin logo" style="display:block;width:84px;height:auto;object-fit:contain;" />'
    : '<div style="display:inline-flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:18px;background:#eef4fb;color:#012e72;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Paladin</div>';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'tonimerabueno.rels@gmail.com',
    subject: `${subjectPrefix} • ${safeFullName}`,
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
                  <td style="width:100px;vertical-align:middle;">
                    ${logoHtml}
                  </td>
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
          <tr>
            <td style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
              Submitted from the website ${submittedFormLabel} form.
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `
  ${emailTitle}

Full Name: ${fullName}
${emailTextLine}
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
${notes}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't fail the request if email fails, just log it
    return false;
  }
};

exports.createContact = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    let contact = null;

    // If MongoDB is offline, still allow email delivery without failing the request.
    if (mongoose.connection.readyState === 1) {
      contact = new Contact(req.body);
      await contact.save();
    } else {
      console.warn('MongoDB unavailable. Skipping contact persistence and sending email only.');
    }

    // Send email (don't fail if email fails)
    sendEmail(req.body).catch(err => console.error('Background email error:', err));

    res.status(201).json({
      success: true,
      message: 'Your consultation request has been submitted.',
      contact,
    });
  } catch (err) {
    console.error('Error creating contact:', err);
    res.status(400).json({ error: err.message });
  }
};
