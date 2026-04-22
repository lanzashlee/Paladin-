const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Contact = require('../models/Contact');

const toBoolean = (value) => String(value || '').toLowerCase() === 'true';
const normalizeSmtpPassword = (password, username) => {
  const raw = String(password || '').trim();
  const user = String(username || '').toLowerCase();

  // Gmail app passwords are often pasted with spaces (xxxx xxxx xxxx xxxx).
  if (user.endsWith('@gmail.com')) {
    return raw.replace(/\s+/g, '');
  }

  return raw;
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatLabel = (value = '') =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const PRODUCT_LABEL_ALIASES = {
  ho3: 'Homeowners Insurance (HO3)',
  ho4: 'Renters Insurance (HO4)',
  ho6: 'Condo Owners Insurance (HO6)',
  commercialauto: 'Commercial Auto Insurance',
  generalliability: 'General Liability Insurance (GL / CGL)',
  workerscomp: 'Workers Compensation Insurance',
  earthquake: 'Earthquake Insurance',
  flood: 'Flood Insurance',
  umbrella: 'Umbrella / Excess Liability Insurance',
  specialty: 'Specialty Products',
};

const formatSubjectDate = (date = new Date()) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const compactValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => compactValue(item))
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    return '';
  }

  return String(value).trim();
};

const flattenForPdf = (value, prefix = '', output = []) => {
  if (value === null || value === undefined || value === '') {
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      flattenForPdf(entry, `${prefix}${prefix ? ' ' : ''}${index + 1}`, output);
    });
    return output;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => {
      const nextPrefix = prefix ? `${prefix} > ${formatLabel(key)}` : formatLabel(key);
      flattenForPdf(entry, nextPrefix, output);
    });
    return output;
  }

  output.push({
    label: prefix || 'Value',
    value: String(value),
  });
  return output;
};

const PDF_BRAND = {
  navy: '#012E72',
  royal: '#0B3F8F',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#D7E3F3',
  sectionBg: '#F5F8FE',
};

const ensurePdfSpace = (doc, requiredHeight = 30) => {
  const maxY = doc.page.height - doc.page.margins.bottom;
  if (doc.y + requiredHeight <= maxY) {
    return;
  }
  doc.addPage();
};

const drawPdfHeader = (doc, title) => {
  const logoAsset = getLogoAsset();
  const startX = doc.page.margins.left;
  const startY = doc.y;

  if (logoAsset?.path) {
    try {
      doc.image(logoAsset.path, startX, startY, { fit: [52, 52], align: 'left' });
    } catch (_error) {
      // If image fails to render, keep PDF generation resilient.
    }
  }

  const textX = startX + 66;
  doc.fillColor(PDF_BRAND.royal).fontSize(10).text('PALADIN PROFESSIONAL INSURANCE SOLUTIONS', textX, startY + 2, {
    align: 'left',
  });
  doc.fillColor(PDF_BRAND.navy).fontSize(21).text(title, textX, startY + 16, { align: 'left' });
  doc
    .fillColor(PDF_BRAND.muted)
    .fontSize(9)
    .text(`Generated ${new Date().toLocaleString('en-US')}`, textX, startY + 42, { align: 'left' });

  doc.y = startY + 68;
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(1)
    .strokeColor(PDF_BRAND.border)
    .stroke();
  doc.moveDown(1);
};

const drawPdfPageFrame = (doc) => {
  const inset = 18;
  const x = inset;
  const y = inset;
  const width = doc.page.width - inset * 2;
  const height = doc.page.height - inset * 2;

  doc
    .roundedRect(x, y, width, height, 8)
    .lineWidth(1)
    .strokeColor(PDF_BRAND.border)
    .stroke();
};

const drawPdfSection = (doc, section) => {
  ensurePdfSpace(doc, 38);

  const sectionX = doc.page.margins.left;
  const sectionWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const sectionHeaderY = doc.y;
  const sectionHeaderHeight = 22;

  doc
    .roundedRect(sectionX, sectionHeaderY, sectionWidth, sectionHeaderHeight, 6)
    .fillColor(PDF_BRAND.sectionBg)
    .fill();
  doc
    .roundedRect(sectionX, sectionHeaderY, sectionWidth, sectionHeaderHeight, 6)
    .lineWidth(0.8)
    .strokeColor(PDF_BRAND.border)
    .stroke();
  doc.fillColor(PDF_BRAND.navy).fontSize(12).text(section.title, sectionX + 10, sectionHeaderY + 6, { width: sectionWidth - 20 });

  doc.y = sectionHeaderY + sectionHeaderHeight + 8;

  section.rows.forEach((row) => {
    ensurePdfSpace(doc, 24);

    const labelWidth = 220;
    const valueX = sectionX + labelWidth + 10;
    const valueWidth = sectionWidth - labelWidth - 10;
    const rowStartY = doc.y;

    doc.fillColor(PDF_BRAND.royal).fontSize(10).text(`${row.label}:`, sectionX, rowStartY, {
      width: labelWidth,
      align: 'left',
    });
    doc.fillColor(PDF_BRAND.text).fontSize(10).text(row.value, valueX, rowStartY, {
      width: valueWidth,
      align: 'left',
    });

    const rowHeight = Math.max(
      doc.heightOfString(`${row.label}:`, { width: labelWidth }),
      doc.heightOfString(row.value, { width: valueWidth })
    );

    doc.y = rowStartY + rowHeight + 6;
    doc
      .moveTo(sectionX, doc.y)
      .lineTo(sectionX + sectionWidth, doc.y)
      .lineWidth(0.5)
      .strokeColor(PDF_BRAND.border)
      .stroke();
    doc.y += 4;
  });

  doc.moveDown(0.5);
};

const buildPdfBufferFromSections = ({ title, sections }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.on('pageAdded', () => {
      drawPdfPageFrame(doc);
    });

    drawPdfPageFrame(doc);
    drawPdfHeader(doc, title);

    sections.forEach((section) => {
      drawPdfSection(doc, section);
    });

    doc.end();
  });

const normalizeSectionedDataForPdf = (sections = []) =>
  (Array.isArray(sections) ? sections : [])
    .map((section) => ({
      title: String(section?.title || '').trim(),
      rows: (Array.isArray(section?.fields) ? section.fields : [])
        .map((field) => ({
          label: String(field?.label || '').trim(),
          value: String(field?.value ?? '').trim() || '-',
        }))
        .filter((field) => field.label),
    }))
    .filter((section) => section.title && section.rows.length > 0);

const buildPdfBuffer = ({ title, sections }) =>
  buildPdfBufferFromSections({
    title,
    sections: (sections || []).map((section) => ({
      title: section.title,
      rows: flattenForPdf(section.data).map((row) => ({
        label: row.label,
        value: String(row.value ?? '').trim() || '-',
      })),
    })),
  });

const FIELD_LABELS = {
  fullName: 'Full Name',
  email: 'Email',
  address: 'Address',
  phone: 'Phone',
  policyNumber: 'Policy Number',
  effectiveDate: 'Requested Effective Date of Change',
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
  preferredTime: 'Preferred Time Window',
  alternateDateTime: 'Alternate Date / Time',
  topic: 'What Is This Regarding',
  otherTopic: 'Other Reason',
  incidentDate: 'Date of Incident',
  incidentTime: 'Approximate Time of Incident',
  claimType: 'Claim Type',
  incidentLocation: 'Location of Incident',
  otherClaimType: 'Other Claim Type',
  otherPartyName: 'Other Party Name',
  otherPartyCarrier: 'Other Party Carrier',
  policeReportFiled: 'Police Report Filed',
  policeReportNumber: 'Police Report / Case Number',
  estimatedLoss: 'Estimated Dollar Amount of Loss',
  propertyRiskStatus: 'Property Still at Risk of Further Damage',
  carrierContactStatus: 'Carrier Contact Status',
  carrierClaimNumber: 'Carrier Claim Number',
  additionalNotes: 'Additional Notes',
  otherDocumentTypeDescription: 'Other Document Description',
  coveragesToShow: 'Coverages to Show',
  operationsDescription: 'Operations / Locations / Vehicles',
  additionalInsuredStatus: 'Additional Insured Status',
  additionalEndorsements: 'Additional Endorsements',
  certificateHolderName: 'Certificate Holder Name',
  certificateHolderEmail: 'Certificate Holder Email',
  certificateHolderAddress: 'Certificate Holder Address',
  deadlineInstructions: 'Deadline / Special Instructions',
  requestedUpdateTypes: 'Updates Requested',
  otherUpdateDescription: 'Other Update Description',
  otherUpdateLabel: 'Other Update Label',
  otherUpdateValue: 'Other Update Value',
  newEmailAddress: 'New Email Address',
  newPhoneNumber: 'New Phone Number',
  newMailingAddress: 'New Mailing Address',
  newLegalName: 'New Legal Name',
  applyChangesTo: 'Apply Changes To',
  policyType: 'Policy Type',
  otherPolicyType: 'Other Policy Type',
  requestedChangeTypes: 'Requested Change Type(s)',
  requestedChangeOther: 'Other Requested Change',
  mortgageeName: 'Mortgagee / Lienholder Name',
  loanNumber: 'Loan Number',
  mailingAddress: 'Mailing Address',
};

const canonicalizeKey = (value = '') => String(value).replace(/[^a-z0-9]/gi, '').toLowerCase();

const FIELD_KEY_ALIASES = {
  fullName: 'fullName',
  email: 'email',
  address: 'address',
  phone: 'phone',
  policyNumber: 'policyNumber',
  effectiveDate: 'effectiveDate',
  coverageType: 'coverageType',
  preferredContact: 'preferredContact',
  deliveryMethod: 'deliveryMethod',
  documentType: 'documentType',
  changeType: 'changeType',
  timeline: 'timeline',
  notes: 'notes',
  updateType: 'updateType',
  updatedValue: 'updatedValue',
  preferredDay: 'preferredDay',
  preferredTime: 'preferredTime',
  alternateDateTime: 'alternateDateTime',
  topic: 'topic',
  otherTopic: 'otherTopic',
  incidentDate: 'incidentDate',
  incidentTime: 'incidentTime',
  claimType: 'claimType',
  incidentLocation: 'incidentLocation',
  otherClaimType: 'otherClaimType',
  otherPartyName: 'otherPartyName',
  otherPartyCarrier: 'otherPartyCarrier',
  policeReportFiled: 'policeReportFiled',
  policeReportNumber: 'policeReportNumber',
  estimatedLoss: 'estimatedLoss',
  propertyRiskStatus: 'propertyRiskStatus',
  carrierContactStatus: 'carrierContactStatus',
  carrierClaimNumber: 'carrierClaimNumber',
  additionalNotes: 'additionalNotes',
  otherDocumentTypeDescription: 'otherDocumentTypeDescription',
  coveragesToShow: 'coveragesToShow',
  operationsDescription: 'operationsDescription',
  additionalInsuredStatus: 'additionalInsuredStatus',
  additionalEndorsements: 'additionalEndorsements',
  certificateHolderName: 'certificateHolderName',
  certificateHolderEmail: 'certificateHolderEmail',
  certificateHolderAddress: 'certificateHolderAddress',
  deadlineInstructions: 'deadlineInstructions',
  requestedUpdateTypes: 'requestedUpdateTypes',
  otherUpdateDescription: 'otherUpdateDescription',
  otherUpdateLabel: 'otherUpdateLabel',
  otherUpdateValue: 'otherUpdateValue',
  newEmailAddress: 'newEmailAddress',
  newPhoneNumber: 'newPhoneNumber',
  newMailingAddress: 'newMailingAddress',
  newLegalName: 'newLegalName',
  applyChangesTo: 'applyChangesTo',
  policyType: 'policyType',
  otherPolicyType: 'otherPolicyType',
  requestedChangeTypes: 'requestedChangeTypes',
  requestedChangeOther: 'requestedChangeOther',
  mortgageeName: 'mortgageeName',
  loanNumber: 'loanNumber',
  mailingAddress: 'mailingAddress',
};

const CANONICAL_FIELD_KEY_MAP = Object.entries(FIELD_KEY_ALIASES).reduce((acc, [alias, canonicalKey]) => {
  acc[canonicalizeKey(alias)] = canonicalKey;
  return acc;
}, {});

const resolveFieldKey = (key = '') => {
  const canonical = canonicalizeKey(key);
  return CANONICAL_FIELD_KEY_MAP[canonical] || key;
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
  'consultation-request': {
    title: 'Personalized Consultation',
    label: 'consultation request',
  },
};

const FORM_FIELD_ORDER = {
  consultation: ['fullName', 'email', 'phone', 'coverageType', 'preferredContact', 'timeline', 'notes'],
  'consultation-request': ['fullName', 'email', 'address', 'phone'],
  'document-request': [
    'fullName',
    'email',
    'documentType',
    'otherDocumentTypeDescription',
    'coveragesToShow',
    'operationsDescription',
    'additionalInsuredStatus',
    'additionalEndorsements',
    'certificateHolderName',
    'certificateHolderEmail',
    'certificateHolderAddress',
    'deadlineInstructions',
  ],
  'policy-change': [
    'fullName',
    'email',
    'policyType',
    'otherPolicyType',
    'effectiveDate',
    'requestedChangeTypes',
    'requestedChangeOther',
    'notes',
    'mortgageeName',
    'loanNumber',
    'mailingAddress',
  ],
  'update-contact-info': [
    'fullName',
    'email',
    'requestedUpdateTypes',
    'otherUpdateDescription',
    'otherUpdateLabel',
    'otherUpdateValue',
    'updatedValue',
    'newEmailAddress',
    'newPhoneNumber',
    'newMailingAddress',
    'newLegalName',
    'notes',
    'applyChangesTo',
    'policyNumber',
  ],
  'call-request': [
    'fullName',
    'phone',
    'email',
    'policyNumber',
    'preferredDay',
    'preferredTime',
    'alternateDateTime',
    'topic',
    'otherTopic',
    'notes',
  ],
  'claim-report': [
    'fullName',
    'email',
    'policyNumber',
    'phone',
    'incidentDate',
    'incidentTime',
    'claimType',
    'otherClaimType',
    'incidentLocation',
    'notes',
    'otherPartyName',
    'otherPartyCarrier',
    'policeReportFiled',
    'policeReportNumber',
    'estimatedLoss',
    'propertyRiskStatus',
    'carrierContactStatus',
    'carrierClaimNumber',
    'additionalNotes',
  ],
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

const formatDisplayDate = (value) => {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return raw;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const localDate = new Date(year, month - 1, day);

  if (
    Number.isNaN(localDate.getTime()) ||
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day
  ) {
    return raw;
  }

  return localDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDisplayTime = (value) => {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);

  if (!match) {
    return raw;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return raw;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
};

const formatDisplayDateTimeLocal = (value) => {
  const raw = String(value || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/);

  if (!match) {
    return raw;
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hours = Number(hourText);
  const minutes = Number(minuteText);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return raw;
  }

  const localDateTime = new Date(year, month - 1, day, hours, minutes);

  if (
    Number.isNaN(localDateTime.getTime()) ||
    localDateTime.getFullYear() !== year ||
    localDateTime.getMonth() !== month - 1 ||
    localDateTime.getDate() !== day ||
    localDateTime.getHours() !== hours ||
    localDateTime.getMinutes() !== minutes
  ) {
    return raw;
  }

  const displayDate = localDateTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const displayTime = localDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${displayDate} at ${displayTime}`;
};

const VALUE_LABELS = {
  coverageType: {
    'personal-auto': 'Personal auto',
    homeowners: 'Homeowners',
    renters: 'Renters',
    business: 'Business',
    life: 'Life',
    other: 'Other',
  },
  preferredContact: {
    email: 'Email',
    phone: 'Phone',
    text: 'Text message',
  },
  changeType: {
    coverage: 'Coverage change',
    billing: 'Billing update',
    vehicle: 'Vehicle update',
    property: 'Property update',
    'named-insured': 'Named insured update',
    other: 'Other',
  },
  updateType: {
    'contact-info': 'Contact info',
    'mailing-address': 'Mailing address',
    'insured-item': 'Insured item',
    vehicle: 'Vehicle details',
    property: 'Property details',
    other: 'Other',
  },
  requestedUpdateTypes: {
    email: 'Email address',
    phone: 'Phone number',
    'mailing-address': 'Mailing address',
    'legal-name': 'Legal name (e.g. name change or correction)',
    other: 'Other',
  },
  applyChangesTo: {
    'all-policies': 'All active policies on my account',
    'specific-policy': 'One specific policy only',
  },
  topic: {
    'new-insurance-quote': 'Get a new insurance quote',
    'existing-policy-question': 'Question about my existing policy',
    'policy-renewal-question': 'Policy renewal question',
    'document-or-certificate-request': 'Request a document or certificate',
    'policy-change-request': 'Make a policy change',
    'claim-question-follow-up': 'Claim question or follow-up',
    'billing-or-payment-question': 'Billing or payment question',
    other: 'Other',
  },
  claimType: {
    'property-fire': 'Property - Fire',
    'property-water-flood': 'Property - Water / Flood',
    'property-theft-vandalism': 'Property - Theft / Vandalism',
    'property-wind-storm': 'Property - Wind / Storm',
    'auto-accident': 'Auto accident',
    'bodily-injury-liability': 'Bodily injury / Liability claim against me',
    'workers-comp-injury': "Workers' Comp injury",
    'general-liability-claim': 'General Liability claim',
    other: 'Other',
  },
  policeReportFiled: {
    yes: 'Yes',
    no: 'No',
    'not-sure-yet': 'Not sure yet',
  },
  propertyRiskStatus: {
    yes: 'Yes',
    no: 'No',
    unsure: 'Unsure',
  },
  carrierContactStatus: {
    yes: 'Yes',
    'no-report-on-my-behalf': 'No - I would like you to report it on my behalf',
  },
  documentType: {
    'coi-acord25': 'COI / ACORD 25 (General Liability / Auto / Workers\' Comp)',
    'evidence-property-insurance-acord28': 'Evidence of Property Insurance / ACORD 28 (Mortgagee / Lender)',
    'evidence-homeowners-acord27': 'Evidence of Homeowners Insurance / ACORD 27',
    'declarations-page-copy': 'Declarations page copy',
    'endorsement-copy': 'Endorsement copy',
    other: 'Other (describe in the box below)',
  },
  additionalInsuredStatus: {
    yes: 'Yes - they need to be added as an Additional Insured on my GL / Auto policy',
    no: 'No - standard proof of insurance is sufficient',
    'not-sure': 'I am not sure',
  },
  coveragesToShow: {
    'general-liability': 'General Liability (GL)',
    'commercial-auto': 'Commercial Auto',
    umbrella: 'Umbrella / Excess Liability',
    'workers-compensation': 'Workers\' Compensation (WC)',
    'professional-liability': 'Professional Liability / E&O',
  },
  additionalEndorsements: {
    'waiver-subrogation': 'Waiver of Subrogation',
    pnc: 'Primary & Non-Contributory (P&NC)',
    hnoa: 'Hired & Non-Owned Auto (HNOA)',
  },
  policyType: {
    'homeowners-ho3': 'Homeowners (HO3)',
    'condo-ho6': 'Condo (HO6)',
    'renters-ho4': 'Renters (HO4)',
    'dwelling-rental-property': 'Dwelling / Rental Property',
    'commercial-gl': 'Commercial GL',
    'commercial-auto': 'Commercial Auto',
    'workers-comp': "Workers' Comp",
    'umbrella-excess': 'Umbrella / Excess',
    other: 'Other',
  },
  requestedChangeTypes: {
    driver: 'Add or remove a driver',
    vehicle: 'Add, replace, or remove a vehicle',
    'property-location': 'Add or remove a property / location',
    'property-details': 'Update property details (roof, renovations, square footage, etc.)',
    endorsement: 'Add or remove an endorsement',
    'coverage-limits-deductibles': 'Change coverage limits or deductibles',
    'mortgagee-lienholder-loss-payee': 'Add or update a mortgagee / lienholder / loss payee',
    'cancel-policy': 'Cancel this policy',
    other: 'Other (describe below)',
  },
};

const ARRAY_VALUE_FIELDS = new Set(['coveragesToShow', 'additionalEndorsements', 'requestedChangeTypes', 'requestedUpdateTypes']);

const normalizeContactFieldValue = (key, value) => {
  const resolvedKey = resolveFieldKey(key);

  if (value === null || value === undefined) {
    return '';
  }

  // Keep these two fields label-driven even if payload shape varies.
  if (resolvedKey === 'requestedUpdateTypes') {
    const values = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);

    if (!values.length) {
      return '';
    }

    const valueLabels = VALUE_LABELS.requestedUpdateTypes || {};
    return values.map((entry) => valueLabels[entry] || formatLabel(entry)).join(', ');
  }

  if (resolvedKey === 'applyChangesTo') {
    const rawApplyChangesTo = String(value ?? '').trim();
    if (!rawApplyChangesTo) {
      return '';
    }

    const valueLabels = VALUE_LABELS.applyChangesTo || {};
    return valueLabels[rawApplyChangesTo] || formatLabel(rawApplyChangesTo);
  }

  if (ARRAY_VALUE_FIELDS.has(resolvedKey)) {
    const values = Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);

    if (!values.length) {
      return '';
    }

    const valueLabels = VALUE_LABELS[resolvedKey] || {};
    return values.map((entry) => valueLabels[entry] || formatLabel(entry)).join(', ');
  }

  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  if (resolvedKey === 'effectiveDate' || resolvedKey === 'incidentDate' || resolvedKey === 'preferredDay') {
    return formatDisplayDate(raw);
  }

  if (resolvedKey === 'incidentTime') {
    return formatDisplayTime(raw);
  }

  if (resolvedKey === 'alternateDateTime') {
    return formatDisplayDateTimeLocal(raw);
  }

  const valueLabels = VALUE_LABELS[resolvedKey];
  if (valueLabels && valueLabels[raw]) {
    return valueLabels[raw];
  }

  if (FORMAT_LABEL_FIELDS.has(resolvedKey)) {
    return formatLabel(raw);
  }

  return raw;
};

const getFieldLabel = (key) => {
  const resolvedKey = resolveFieldKey(key);
  return FIELD_LABELS[resolvedKey] || formatLabel(resolvedKey);
};

const formatUpdateContactInfoRows = (contactData) => {
  const requestedTypeLabels = {
    email: 'Email address',
    phone: 'Phone number',
    'mailing-address': 'Mailing address',
    'legal-name': 'Legal name (e.g. name change or correction)',
    other: 'Other',
  };
  const applyChangesLabels = {
    'all-policies': 'All active policies on my account',
    'specific-policy': 'One specific policy only - provide policy number below',
  };
  const requestedTypeValues = Array.isArray(contactData.requestedUpdateTypes)
    ? contactData.requestedUpdateTypes
    : String(contactData.requestedUpdateTypes || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);

  const requestedUpdateLabelText = requestedTypeValues.length
    ? requestedTypeValues.map((value) => requestedTypeLabels[value] || formatLabel(value)).join(', ')
    : '-';
  const applyChangesToLabelText = applyChangesLabels[contactData.applyChangesTo] || normalizeContactFieldValue('applyChangesTo', contactData.applyChangesTo) || '-';
  const otherUpdateLabelText = String(contactData.otherUpdateLabel || '').trim();

  const rows = [
    { label: 'Name of insured', value: normalizeContactFieldValue('fullName', contactData.fullName) || '-' },
    { label: 'Current email on file', value: normalizeContactFieldValue('email', contactData.email) || '-' },
    { label: 'Updates requested', value: requestedUpdateLabelText },
    { label: 'Apply changes to', value: applyChangesToLabelText },
  ];

  if (requestedTypeValues.includes('other')) {
    rows.push({ label: 'Other update label', value: otherUpdateLabelText || '-' });
  }

  const updateFieldRows = [
    { key: 'email', label: 'New email address', valueKey: 'newEmailAddress' },
    { key: 'phone', label: 'New phone number', valueKey: 'newPhoneNumber' },
    { key: 'mailing-address', label: 'New mailing address', valueKey: 'newMailingAddress' },
    { key: 'legal-name', label: 'New legal name (if changing)', valueKey: 'newLegalName' },
    { key: 'other', label: otherUpdateLabelText || 'Other update', valueKey: 'otherUpdateValue' },
  ];

  updateFieldRows.forEach((field) => {
    if (!requestedTypeValues.includes(field.key)) {
      return;
    }

    rows.push({
      label: field.label,
      value: normalizeContactFieldValue(field.valueKey, contactData[field.valueKey]) || '-',
    });
  });

  const notesText = normalizeContactFieldValue('notes', contactData.notes);
  if (notesText) {
    rows.push({ label: 'Additional notes', value: notesText });
  }

  rows.push({
    label: 'Policy number',
    value: normalizeContactFieldValue('policyNumber', contactData.policyNumber) || '-',
  });

  return rows;
};

const createTransporter = () => {
  const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
  const SMTP_PORT = (process.env.SMTP_PORT || '').trim();
  const SMTP_USER = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const SMTP_PASS = normalizeSmtpPassword((
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.EMAIL_PASSWORD ||
    ''
  ), SMTP_USER);
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

const isGmailAuthError = (error) => {
  if (!error) {
    return false;
  }

  const message = String(error.message || '').toLowerCase();
  const response = String(error.response || '').toLowerCase();
  const command = String(error.command || '').toLowerCase();

  return (
    error.code === 'EAUTH' ||
    error.responseCode === 535 ||
    message.includes('badcredentials') ||
    message.includes('username and password not accepted') ||
    response.includes('badcredentials') ||
    response.includes('username and password not accepted') ||
    command.includes('auth')
  );
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
          ${detailsHtml ? `
          <div style="font-size:12px;color:#667085;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;margin-bottom:8px;">${detailsLabel}</div>
          <div style="background:#f7faff;border:1px solid #dbe8ff;border-radius:12px;padding:14px 15px;font-size:14px;line-height:1.65;color:#1f2937;">
            ${detailsHtml}
          </div>
          ` : ''}
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

  const fieldRows =
    formType === 'update-contact-info'
      ? formatUpdateContactInfoRows(contactData).map((field) => ({
          label: field.label,
          textValue: field.value,
          htmlValue: escapeHtml(field.value).replace(/\n/g, '<br>'),
        }))
      : fieldKeys
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

  const notesText = formType === 'update-contact-info' ? '' : normalizeContactFieldValue('notes', contactData.notes);
  const notesHtml = notesText ? escapeHtml(notesText).replace(/\n/g, '<br>') : '';

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
      detailsHtml: notesHtml,
      logoHtml,
      submittedAt,
    }),
    text: [
      metadata.title,
      '',
      ...fieldRows.map((field) => `${field.label}: ${field.textValue}`),
      ...(notesText ? ['', 'Notes:', notesText] : []),
    ].join('\n'),
  });
};

const sendQuoteRequestEmail = async (quoteData) => {
  const { transporter, recipient } = getEmailDeliveryReadiness();

  if (!recipient || !transporter) {
    throw new Error('Email settings are incomplete.');
  }

  const selectedProduct = String(quoteData.selectedProduct || '').trim();
  const selectedProductKey = selectedProduct.toLowerCase();
  const selectedProductLabel =
    String(quoteData.selectedProductLabel || '').trim() ||
    PRODUCT_LABEL_ALIASES[selectedProductKey] ||
    formatLabel(selectedProduct) ||
    'Insurance';
  const universalApplicant = quoteData.universalApplicant || {};
  const quotationDetails = quoteData.insuranceQuotation || {};
  const additionalQuoteAttachment = quotationDetails.suretyBusinessFinancialStatementAttachment;
  const universalApplicantSections = normalizeSectionedDataForPdf(quoteData.universalApplicantSections);
  const insuranceQuotationSections = normalizeSectionedDataForPdf(quoteData.insuranceQuotationSections);

  const applicantName =
    compactValue(universalApplicant.fullLegalName) ||
    compactValue(quoteData.fullName) ||
    'Applicant';
  const email = compactValue(universalApplicant.emailAddress) || compactValue(quoteData.email);
  const phone = compactValue(universalApplicant.contactPhone) || compactValue(quoteData.phone);
  const address = [
    compactValue(universalApplicant.mailingStreet),
    [compactValue(universalApplicant.mailingCity), compactValue(universalApplicant.mailingState), compactValue(universalApplicant.mailingZip)]
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join(', ');

  const subject = `${selectedProductLabel} Quotation - ${applicantName} - ${formatSubjectDate(new Date())}`;
  const logoAsset = getLogoAsset();
  const logoHtml = getLogoHtml(logoAsset);

  const summaryRows = [
    { label: 'Applicant', value: applicantName || '-' },
    { label: 'Email', value: email || '-' },
    { label: 'Phone', value: phone || '-' },
    { label: 'Address', value: address || '-' },
  ];

  const summaryRowsHtml = summaryRows
    .map(
      (field) => `
                <tr>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;width:38%;font-size:12px;color:#6b7280;font-weight:700;vertical-align:top;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(field.label)}</td>
                  <td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.6;color:#111827;font-weight:600;">${escapeHtml(field.value)}</td>
                </tr>
      `
    )
    .join('');

  const universalApplicantPdf = universalApplicantSections.length
    ? await buildPdfBufferFromSections({
        title: 'Universal Applicant Form',
        sections: universalApplicantSections,
      })
    : await buildPdfBuffer({
        title: 'Universal Applicant Form',
        sections: [
          {
            title: 'Full Details',
            data: universalApplicant,
          },
        ],
      });

  const homeownersQuotePdf = insuranceQuotationSections.length
    ? await buildPdfBufferFromSections({
        title: selectedProductLabel,
        sections: insuranceQuotationSections,
      })
    : await buildPdfBuffer({
        title: selectedProductLabel,
        sections: [
          {
            title: 'Full Details',
            data: quotationDetails,
          },
        ],
      });

  const quoteFileAttachment =
    additionalQuoteAttachment &&
    typeof additionalQuoteAttachment === 'object' &&
    additionalQuoteAttachment.filename &&
    additionalQuoteAttachment.dataBase64
      ? {
          filename: String(additionalQuoteAttachment.filename),
          content: Buffer.from(String(additionalQuoteAttachment.dataBase64), 'base64'),
          contentType: String(additionalQuoteAttachment.contentType || 'application/octet-stream'),
        }
      : null;

  await transporter.sendMail({
    from: (process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || '').trim(),
    to: recipient,
    replyTo: email || undefined,
    subject,
    attachments: [
      ...getLogoAttachment(logoAsset),
      {
        filename: 'universal-applicant-form.pdf',
        content: universalApplicantPdf,
      },
      {
        filename: 'insurance-quotation-form.pdf',
        content: homeownersQuotePdf,
      },
      ...(quoteFileAttachment ? [quoteFileAttachment] : []),
    ],
    html: renderEmailLayout({
      title: `${selectedProductLabel} Quotation`,
      intro: 'A new quotation request was submitted.',
      rowsHtml: summaryRowsHtml,
      detailsLabel: 'Attachments',
      detailsHtml: 'Universal Applicant Form (Full) and Insurance/Quotation Form (Full) are attached as PDF.',
      logoHtml,
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }),
    text: [
      `${selectedProductLabel} Quotation`,
      '',
      ...summaryRows.map((row) => `${row.label}: ${row.value}`),
      '',
      'Attachment: Universal Applicant Form (Full) and Insurance/Quotation Form (Full)',
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

    const tryPersist = async (payload) => {
      if (!canPersist) {
        return { ok: false, value: null, error: null };
      }

      try {
        const savedContact = await saveContactIfAvailable(payload);
        return { ok: true, value: savedContact, error: null };
      } catch (error) {
        console.error('Failed to persist contact submission:', error);
        return { ok: false, value: null, error };
      }
    };

    const tryEmail = async (sendFn) => {
      if (!emailReadiness.ready) {
        return { ok: false, error: null };
      }

      try {
        await sendFn();
        return { ok: true, error: null };
      } catch (error) {
        console.error('Failed to send contact email notification:', error);
        return { ok: false, error };
      }
    };

    if (isSimpleContact) {
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim();
      const subject = String(body.subject || '').trim();
      const message = String(body.message || '').trim();

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
      }

      const persistResult = await tryPersist({
        name,
        fullName: name,
        email,
        subject,
        message,
        formType: 'consultation',
      });

      const emailResult = await tryEmail(() => sendSimpleContactEmail({ name, email, subject, message }));

      if (!emailReadiness.ready) {
        console.warn('Email settings are incomplete. Contact saved without sending email notification.');
      }

      if (!persistResult.ok && !emailResult.ok) {
        return res.status(503).json({
          error:
            'Contact service is temporarily unavailable. Please verify database and email configuration on the server.',
        });
      }

      const warnings = [];
      if (!persistResult.ok && canPersist) {
        warnings.push('Contact details could not be saved to the database.');
      }
      if (emailReadiness.ready && !emailResult.ok) {
        warnings.push('Email notification could not be delivered.');
      }

      return res.status(201).json({
        success: true,
        message:
          persistResult.ok && emailResult.ok
            ? 'Contact request submitted and emailed successfully.'
            : 'Contact request submitted successfully.',
        id: persistResult.value?._id,
        warnings,
      });
    }

    if (body.formType === 'quote-request' || body.formType === 'quote-homeowners') {
      const selectedProduct = String(body.selectedProduct || '').trim();
      if (!selectedProduct) {
        return res.status(400).json({ error: 'A selected insurance product is required.' });
      }

      const universalApplicant = body.universalApplicant || {};
      const insuranceQuotation = body.insuranceQuotation || {};
      const insuranceQuotationForStorage = {
        ...insuranceQuotation,
        suretyBusinessFinancialStatementAttachment: insuranceQuotation?.suretyBusinessFinancialStatementAttachment
          ? {
              filename: insuranceQuotation.suretyBusinessFinancialStatementAttachment.filename || '',
              contentType: insuranceQuotation.suretyBusinessFinancialStatementAttachment.contentType || '',
            }
          : undefined,
      };
      const fullName = String(
        body.fullName ||
          universalApplicant.fullLegalName ||
          [universalApplicant.firstName, universalApplicant.middleName, universalApplicant.lastName]
            .filter(Boolean)
            .join(' ')
      ).trim();
      const email = String(body.email || universalApplicant.emailAddress || '').trim();
      const phone = String(body.phone || universalApplicant.contactPhone || '').trim();

      if (!fullName || !email || !phone) {
        return res.status(400).json({ error: 'Applicant name, email, and phone are required for Homeowners quotations.' });
      }

      const persistPayload = {
        formType: 'quote-request',
        fullName,
        email,
        phone,
        coverageType: selectedProduct,
        notes: JSON.stringify({
          selectedProductLabel: body.selectedProductLabel,
          universalApplicant,
          insuranceQuotation: insuranceQuotationForStorage,
          universalApplicantSections: body.universalApplicantSections,
          insuranceQuotationSections: body.insuranceQuotationSections,
        }),
      };

      const persistResult = await tryPersist(persistPayload);
      const emailResult = await tryEmail(() => sendQuoteRequestEmail({
        selectedProduct,
        selectedProductLabel: body.selectedProductLabel,
        universalApplicant,
        insuranceQuotation,
        universalApplicantSections: body.universalApplicantSections,
        insuranceQuotationSections: body.insuranceQuotationSections,
        fullName,
        email,
        phone,
      }));

      if (!persistResult.ok && !emailResult.ok) {
        return res.status(503).json({
          error:
            'Quotation request is temporarily unavailable. Please verify database and email configuration on the server.',
        });
      }

      const warnings = [];
      if (!persistResult.ok && canPersist) {
        warnings.push('Quotation request could not be saved to the database.');
      }
      if (emailReadiness.ready && !emailResult.ok) {
        warnings.push('Email notification could not be delivered.');
      }

      return res.status(201).json({
        success: true,
        message:
          persistResult.ok && emailResult.ok
            ? 'Your quotation request has been submitted.'
            : 'Your quotation request has been submitted and is being processed.',
        contact: persistResult.value,
        warnings,
      });
    }

    const fullName = String(body.fullName || '').trim();
    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const persistResult = await tryPersist(body);
    const emailResult = await tryEmail(() => sendServiceRequestEmail(body));

    if (!emailReadiness.ready) {
      console.warn('Email settings are incomplete. Service request saved without sending email notification.');
    }

    if (!persistResult.ok && !emailResult.ok) {
      return res.status(503).json({
        error:
          'Service request is temporarily unavailable. Please verify database and email configuration on the server.',
      });
    }

    const warnings = [];
    if (!persistResult.ok && canPersist) {
      warnings.push('Service request could not be saved to the database.');
    }
    if (emailReadiness.ready && !emailResult.ok) {
      warnings.push('Email notification could not be delivered.');
    }

    return res.status(201).json({
      success: true,
      message:
        persistResult.ok && emailResult.ok
          ? 'Your consultation request has been submitted.'
          : 'Your consultation request has been submitted and is being processed.',
      contact: persistResult.value,
      warnings,
    });
  } catch (err) {
    console.error('Error creating contact:', err);

    if (isGmailAuthError(err)) {
      return res.status(502).json({
        error:
          'Email authentication failed for SMTP. If using Gmail, set SMTP_USER to your full Gmail address and SMTP_PASS to a Google App Password (not your regular account password).',
      });
    }

    return res.status(500).json({ error: err.message || 'Unable to submit your request right now.' });
  }
};
