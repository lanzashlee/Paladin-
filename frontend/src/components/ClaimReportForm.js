import React, { useState } from 'react';
import { User, FileText, ShieldCheck, Send } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'your-information', label: 'Your Information', icon: User },
  { id: 'incident-details', label: 'Incident Details', icon: FileText },
  { id: 'other-parties', label: 'Other Parties Involved', icon: ShieldCheck },
  { id: 'damage-prior-reporting', label: 'Damage & Prior Reporting', icon: Send },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'email', 'policyNumber', 'phone'],
  ['incidentDate', 'claimType', 'incidentLocation', 'notes', 'otherClaimType'],
  [],
  [],
  [],
];

const claimTypeOptions = [
  { value: 'property-fire', label: 'Property - Fire' },
  { value: 'property-water-flood', label: 'Property - Water / Flood' },
  { value: 'property-theft-vandalism', label: 'Property - Theft / Vandalism' },
  { value: 'property-wind-storm', label: 'Property - Wind / Storm' },
  { value: 'auto-accident', label: 'Auto accident' },
  { value: 'bodily-injury-liability', label: 'Bodily injury / Liability claim against me' },
  { value: 'workers-comp-injury', label: 'Workers\' Comp injury' },
  { value: 'general-liability-claim', label: 'General Liability claim' },
  { value: 'other', label: 'Other' },
];

const claimTypeLabelMap = {
  'property-fire': 'Property - Fire',
  'property-water-flood': 'Property - Water / Flood',
  'property-theft-vandalism': 'Property - Theft / Vandalism',
  'property-wind-storm': 'Property - Wind / Storm',
  'auto-accident': 'Auto accident',
  'bodily-injury-liability': 'Bodily injury / Liability claim against me',
  'workers-comp-injury': 'Workers\' Comp injury',
  'general-liability-claim': 'General Liability claim',
  other: 'Other',
};
const EMAIL_REGEX = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const isValidEmailFormat = (emailValue = '') => {
  const email = String(emailValue).trim();
  if (!email || !EMAIL_REGEX.test(email)) {
    return false;
  }

  const [localPart = '', domainPart = ''] = email.split('@');
  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    domainPart.includes('..')
  ) {
    return false;
  }

  return true;
};

const normalizeUsPhoneDigits = (value = '') => String(value).replace(/\D/g, '').slice(0, 10);
const formatUsPhoneDisplay = (digitsValue = '') => {
  const digits = normalizeUsPhoneDigits(digitsValue);

  if (!digits) {
    return '';
  }

  if (digits.length <= 3) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
};
const formatCurrencyInput = (rawValue = '') => {
  const sanitized = String(rawValue ?? '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '');

  if (!sanitized) {
    return '';
  }

  const hasDecimalPoint = sanitized.includes('.');
  const [integerRaw = '', ...decimalParts] = sanitized.split('.');
  const decimalRaw = decimalParts.join('').slice(0, 2);
  const normalizedInteger = integerRaw.replace(/^0+(?=\d)/, '');
  const integerPart = normalizedInteger || (hasDecimalPoint ? '0' : '');
  const formattedInteger = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';

  if (!hasDecimalPoint) {
    return formattedInteger;
  }

  return `${formattedInteger || '0'}.${decimalRaw}`;
};
const getTodayIsoDate = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};
const getNowTime24h = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

function ClaimReportForm({ onClose }) {
  const todayIsoDate = getTodayIsoDate();
  const nowTime24h = getNowTime24h();
  const [formData, setFormData] = useState({
    formType: 'claim-report',
    fullName: '',
    email: '',
    policyNumber: '',
    phone: '',
    incidentDate: '',
    incidentTime: '',
    claimType: 'property-fire',
    otherClaimType: '',
    incidentLocation: '',
    notes: '',
    otherPartyName: '',
    otherPartyCarrier: '',
    policeReportFiled: '',
    policeReportNumber: '',
    estimatedLoss: '',
    propertyRiskStatus: '',
    carrierContactStatus: '',
    carrierClaimNumber: '',
    additionalNotes: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const validateFields = (fields) => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field === 'otherClaimType' && formData.claimType !== 'other') {
        return;
      }

      if (field === 'incidentTime') {
        return;
      }

      if (!String(formData[field] ?? '').trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    if (fields.includes('email') && formData.email.trim() && !isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (fields.includes('phone') && formData.phone.trim()) {
      const digits = normalizeUsPhoneDigits(formData.phone);
      if (digits.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits (US format).';
      }
    }

    if (fields.includes('incidentDate') && formData.incidentDate.trim() && formData.incidentDate > todayIsoDate) {
      newErrors.incidentDate = 'Date of loss / incident cannot be in the future.';
    }

    if (
      fields.includes('incidentTime') &&
      formData.incidentDate === todayIsoDate &&
      formData.incidentTime &&
      formData.incidentTime > nowTime24h
    ) {
      newErrors.incidentTime = 'Time of incident cannot be in the future for today.';
    }

    return newErrors;
  };

  const validateForm = () => validateFields(['fullName', 'email', 'policyNumber', 'phone', 'incidentDate', 'claimType', 'otherClaimType', 'incidentLocation', 'notes']);

  const getFieldClass = (field) =>
    errors[field]
      ? `${inputClassName} border-red-500 focus:ring-red-300 focus:border-red-500`
      : inputClassName;

  const handleChange = (event) => {
    const { name, value } = event.target;
    let normalizedValue = value;

    if (name === 'phone') {
      normalizedValue = formatUsPhoneDisplay(value);
    } else if (name === 'estimatedLoss') {
      normalizedValue = formatCurrencyInput(value);
    }

    setSaved(false);
    setSubmitError(null);
    setFormData((current) => {
      const nextForm = {
        ...current,
        [name]: normalizedValue,
      };

      if (name === 'carrierContactStatus' && normalizedValue !== 'yes') {
        nextForm.carrierClaimNumber = '';
      }

      return nextForm;
    });

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSaved(true);
      setStepIndex(wizardSteps.length - 1);
      setFormData({
        formType: 'claim-report',
        fullName: '',
        email: '',
        policyNumber: '',
        phone: '',
        incidentDate: '',
        incidentTime: '',
        claimType: 'property-fire',
        otherClaimType: '',
        incidentLocation: '',
        notes: '',
        otherPartyName: '',
        otherPartyCarrier: '',
        policeReportFiled: '',
        policeReportNumber: '',
        estimatedLoss: '',
        propertyRiskStatus: '',
        carrierContactStatus: '',
        carrierClaimNumber: '',
        additionalNotes: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentFields = [...(stepFields[stepIndex] || [])];

    if (stepIndex === 1 && formData.claimType !== 'other') {
      const otherFieldIndex = currentFields.indexOf('otherClaimType');
      if (otherFieldIndex >= 0) {
        currentFields.splice(otherFieldIndex, 1);
      }
    }

    if (stepIndex === 1) {
      currentFields.push('incidentTime');
    }

    const validationErrors = validateFields(currentFields);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <RequestModal
      badge="Claim report"
      title="Report a Claim"
      description="Use this form to outline the incident, date, location, and any immediate concerns."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()} noValidate>
        <RequestFormWizard
          steps={wizardSteps}
          activeStep={stepIndex}
          onStepChange={(nextIndex) => {
            if (nextIndex <= stepIndex) {
              setStepIndex(nextIndex);
            }
          }}
        >
          {stepIndex === 0 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <strong>Note:</strong> For urgent matters, call us directly at (805) 692-6900 or contact your carrier's 24/7 claims hotline. We will follow up with the carrier on your behalf after receiving this form.
              </div>

              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section A - Your Information</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Name of insured" htmlFor="claim-fullName" required error={errors.fullName}>
                  <input
                    id="claim-fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name on policy"
                    className={getFieldClass('fullName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Policy number" htmlFor="claim-policyNumber" required error={errors.policyNumber}>
                  <input
                    id="claim-policyNumber"
                    name="policyNumber"
                    type="text"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    placeholder="e.g. NPI1632005"
                    className={getFieldClass('policyNumber')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Email address" htmlFor="claim-email" required error={errors.email}>
                  <input
                    id="claim-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}"
                    className={getFieldClass('email')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Best phone to reach you" htmlFor="claim-phone" required error={errors.phone}>
                  <input
                    id="claim-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(805) 000 0000"
                    inputMode="numeric"
                    maxLength={14}
                    pattern="\d{10}"
                    className={getFieldClass('phone')}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section B - Incident Details</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Date of loss / incident" htmlFor="claim-incidentDate" required error={errors.incidentDate}>
                  <input
                    id="claim-incidentDate"
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    max={todayIsoDate}
                    className={getFieldClass('incidentDate')}
                    disabled={loading}
                  />
                </FieldGroup>

              <FieldGroup label="Approximate time of incident" htmlFor="claim-incidentTime" error={errors.incidentTime}>
                  <input
                    id="claim-incidentTime"
                    name="incidentTime"
                    type="time"
                    step="60"
                    value={formData.incidentTime}
                    onChange={handleChange}
                  max={formData.incidentDate === todayIsoDate ? nowTime24h : undefined}
                    className={getFieldClass('incidentTime')}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Type of claim" htmlFor="claim-claimType" required error={errors.claimType}>
                <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {claimTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm text-[#010407] transition-colors hover:bg-[#F7F4EF]"
                    >
                      <input
                        type="radio"
                        name="claimType"
                        value={option.value}
                        checked={formData.claimType === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {formData.claimType === 'other' && (
                <FieldGroup label='If you selected "Other", please describe:' htmlFor="claim-otherClaimType" required error={errors.otherClaimType}>
                  <input
                    id="claim-otherClaimType"
                    name="otherClaimType"
                    type="text"
                    value={formData.otherClaimType}
                    onChange={handleChange}
                    placeholder="Describe the claim type"
                    className={getFieldClass('otherClaimType')}
                    disabled={loading}
                  />
                </FieldGroup>
              )}

              <FieldGroup label="Location where incident occurred" htmlFor="claim-incidentLocation" required error={errors.incidentLocation}>
                <input
                  id="claim-incidentLocation"
                  name="incidentLocation"
                  type="text"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  placeholder="Street address or description of location"
                  className={getFieldClass('incidentLocation')}
                  disabled={loading}
                />
              </FieldGroup>

              <FieldGroup label="What happened?" htmlFor="claim-notes" required error={errors.notes}>
                <textarea
                  id="claim-notes"
                  name="notes"
                  rows="6"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Please describe the incident in as much detail as possible - what happened, how it occurred, what was damaged or injured, and any other relevant facts."
                  className={`${getFieldClass('notes')} resize-none`}
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section C - Other Parties Involved</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Other party name (if any)" htmlFor="claim-otherPartyName">
                  <input
                    id="claim-otherPartyName"
                    name="otherPartyName"
                    type="text"
                    value={formData.otherPartyName}
                    onChange={handleChange}
                    placeholder="Name of person / business"
                    className={getFieldClass('otherPartyName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Their insurance carrier (if known)" htmlFor="claim-otherPartyCarrier">
                  <input
                    id="claim-otherPartyCarrier"
                    name="otherPartyCarrier"
                    type="text"
                    value={formData.otherPartyCarrier}
                    onChange={handleChange}
                    placeholder="e.g. State Farm"
                    className={getFieldClass('otherPartyCarrier')}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Was a police report filed?" htmlFor="claim-policeReportFiled">
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'not-sure-yet', label: 'Not sure yet' },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="policeReportFiled"
                        value={option.value}
                        checked={formData.policeReportFiled === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {formData.policeReportFiled === 'yes' && (
                <FieldGroup label="Police report / case number (if yes)" htmlFor="claim-policeReportNumber">
                  <input
                    id="claim-policeReportNumber"
                    name="policeReportNumber"
                    type="text"
                    value={formData.policeReportNumber}
                    onChange={handleChange}
                    placeholder="Report or case number"
                    className={getFieldClass('policeReportNumber')}
                    disabled={loading}
                  />
                </FieldGroup>
              )}
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section D - Damage & Prior Reporting</h4>
              </div>

              <FieldGroup label="Estimated dollar amount of loss" htmlFor="claim-estimatedLoss">
                <input
                  id="claim-estimatedLoss"
                  name="estimatedLoss"
                  type="text"
                  value={formData.estimatedLoss}
                  onChange={handleChange}
                  placeholder="e.g. $5,000 (rough estimate is fine)"
                  inputMode="numeric"
                  pattern="^\d{1,3}(,\d{3})*(\.\d{0,2})?$|^\d+(\.\d{0,2})?$"
                  className={getFieldClass('estimatedLoss')}
                  disabled={loading}
                />
              </FieldGroup>

              <FieldGroup label="Is the property still at risk of further damage?" htmlFor="claim-propertyRiskStatus">
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {['yes', 'no', 'unsure'].map((value) => (
                    <label key={value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="propertyRiskStatus"
                        value={value}
                        checked={formData.propertyRiskStatus === value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label="Have you already contacted the carrier directly?" htmlFor="claim-carrierContactStatus">
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no-report-on-my-behalf', label: 'No - I would like you to report it on my behalf' },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="carrierContactStatus"
                        value={option.value}
                        checked={formData.carrierContactStatus === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {formData.carrierContactStatus === 'yes' && (
                <FieldGroup label="Carrier claim number (if already reported)" htmlFor="claim-carrierClaimNumber">
                  <input
                    id="claim-carrierClaimNumber"
                    name="carrierClaimNumber"
                    type="text"
                    value={formData.carrierClaimNumber}
                    onChange={handleChange}
                    placeholder="Carrier-assigned claim number"
                    className={getFieldClass('carrierClaimNumber')}
                    disabled={loading}
                  />
                </FieldGroup>
              )}

              <FieldGroup label="Additional notes" htmlFor="claim-additionalNotes">
                <textarea
                  id="claim-additionalNotes"
                  name="additionalNotes"
                  rows="3"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Anything else we should know before we contact you?"
                  className={`${getFieldClass('additionalNotes')} resize-none`}
                  disabled={loading}
                />
              </FieldGroup>

              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-serif text-sm text-amber-900">
                <strong>Note:</strong> We will review your submission and contact you within 1 business day. If you have not heard from us and the matter is urgent, please call (805) 692-6900.
              </div>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="font-constantia text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="font-serif grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Name of insured:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Email address:</span> {formData.email || '-'}
                </p>
                <p>
                  <span className="font-semibold">Policy number:</span> {formData.policyNumber || '-'}
                </p>
                <p>
                  <span className="font-semibold">Best phone to reach you:</span> {formData.phone || '-'}
                </p>
                <p>
                  <span className="font-semibold">Date of loss / incident:</span> {formData.incidentDate || '-'}
                </p>
                <p>
                  <span className="font-semibold">Approximate time of incident:</span> {formData.incidentTime || '-'}
                </p>
              </div>

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Type of claim:</span> {claimTypeLabelMap[formData.claimType] || '-'}
              </p>

              {formData.claimType === 'other' && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other claim type:</span> {formData.otherClaimType || '-'}
                </p>
              )}

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Location where incident occurred:</span> {formData.incidentLocation || '-'}
              </p>

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Incident details:</span> {formData.notes || '-'}
              </p>

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Other party name:</span> {formData.otherPartyName || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Other party carrier:</span> {formData.otherPartyCarrier || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Police report filed:</span>{' '}
                {formData.policeReportFiled === 'yes'
                  ? 'Yes'
                  : formData.policeReportFiled === 'no'
                  ? 'No'
                  : formData.policeReportFiled === 'not-sure-yet'
                  ? 'Not sure yet'
                  : '-'}
              </p>
              {formData.policeReportFiled === 'yes' && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Police report / case number:</span> {formData.policeReportNumber || '-'}
                </p>
              )}
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Estimated loss:</span> {formData.estimatedLoss || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Property still at risk:</span> {formData.propertyRiskStatus || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Carrier contacted directly:</span> {formData.carrierContactStatus || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Carrier claim number:</span> {formData.carrierClaimNumber || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Additional notes:</span> {formData.additionalNotes || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 font-serif text-sm text-green-700">
            Your claim report has been submitted successfully! We will follow up soon.
          </div>
        )}

        {submitError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 font-serif text-sm text-red-700">
            Error: {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={loading || stepIndex === 0}
              className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] bg-white px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {stepIndex < wizardSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/15 transition-colors hover:bg-[#002DB5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/15 transition-colors hover:bg-[#002DB5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </form>
    </RequestModal>
  );
}

export default ClaimReportForm;
