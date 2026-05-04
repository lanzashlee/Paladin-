import React, { useState } from 'react';
import { User, Clock3, FileText, Send } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'your-information', label: 'Your Information', icon: User },
  { id: 'call-preference', label: 'Call Preference', icon: Clock3 },
  { id: 'reason-for-call', label: 'Reason for Call', icon: FileText },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'phone'],
  ['preferredDay', 'preferredTime'],
  ['topic', 'otherTopic'],
  [],
];

const topicLabelMap = {
  'new-insurance-quote': 'Get a new insurance quote',
  'existing-policy-question': 'Question about my existing policy',
  'policy-renewal-question': 'Policy renewal question',
  'document-or-certificate-request': 'Request a document or certificate',
  'policy-change-request': 'Make a policy change',
  'claim-question-follow-up': 'Claim question or follow-up',
  'billing-or-payment-question': 'Billing or payment question',
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

const getTodayIsoDate = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

const getNowIsoDateTimeLocal = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

function CallRequestForm({ onClose }) {
  const todayIsoDate = getTodayIsoDate();
  const nowIsoDateTimeLocal = getNowIsoDateTimeLocal();
  const [formData, setFormData] = useState({
    formType: 'call-request',
    fullName: '',
    phone: '',
    email: '',
    policyNumber: '',
    preferredDay: '',
    preferredTime: '',
    alternateDateTime: '',
    topic: '',
    otherTopic: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const validateFields = (fields) => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field === 'email') {
        return;
      }

      if (!String(formData[field] ?? '').trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    if (fields.includes('phone') && formData.phone.trim()) {
      const digits = normalizeUsPhoneDigits(formData.phone);
      if (digits.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits (US format).';
      }
    }

    if (fields.includes('email') && formData.email.trim() && !isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (fields.includes('preferredDay') && formData.preferredDay.trim() && formData.preferredDay < todayIsoDate) {
      newErrors.preferredDay = 'Preferred date cannot be in the past.';
    }

    if (
      fields.includes('alternateDateTime') &&
      formData.alternateDateTime.trim() &&
      formData.alternateDateTime < nowIsoDateTimeLocal
    ) {
      newErrors.alternateDateTime = 'Alternate date / time must be in the future.';
    }

    return newErrors;
  };

  const validateForm = () => {
    const fields = ['fullName', 'phone', 'preferredDay', 'preferredTime', 'topic'];

    if (formData.topic === 'other') {
      fields.push('otherTopic');
    }

    return validateFields(fields);
  };

  const getFieldClass = (field) =>
    errors[field]
      ? `${inputClassName} border-red-500 focus:ring-red-300 focus:border-red-500`
      : inputClassName;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = name === 'phone' ? formatUsPhoneDisplay(value) : value;
    setSaved(false);
    setSubmitError(null);
    setFormData((current) => ({
      ...current,
      [name]: normalizedValue,
    }));

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
        formType: 'call-request',
        fullName: '',
        phone: '',
        email: '',
        policyNumber: '',
        preferredDay: '',
        preferredTime: '',
        alternateDateTime: '',
        topic: '',
        otherTopic: '',
        notes: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentFields = [...(stepFields[stepIndex] || [])];

    if (stepIndex === 0) {
      currentFields.push('email');
    }
    if (stepIndex === 1) {
      currentFields.push('alternateDateTime');
    }

    if (stepIndex === 2 && formData.topic !== 'other') {
      const otherTopicIndex = currentFields.indexOf('otherTopic');
      if (otherTopicIndex >= 0) {
        currentFields.splice(otherTopicIndex, 1);
      }
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
      badge="Call request"
      title="Request a Call"
      description="Need to speak with someone on our team? Fill out this form and we'll call you back at a time that works for you."
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
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section A - Your Information</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Name of insured" htmlFor="call-fullName" required error={errors.fullName}>
                  <input
                    id="call-fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={getFieldClass('fullName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Phone number" htmlFor="call-phone" required error={errors.phone}>
                  <input
                    id="call-phone"
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

                <FieldGroup label="Email address" htmlFor="call-email" error={errors.email}>
                  <input
                    id="call-email"
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

                <FieldGroup label="Policy number (if applicable)" htmlFor="call-policyNumber">
                  <input
                    id="call-policyNumber"
                    name="policyNumber"
                    type="text"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    placeholder="Optional - helps us pull up your account"
                    className={getFieldClass('policyNumber')}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section B - Call Preference</h4>
              </div>

              <FieldGroup label="Preferred date" htmlFor="call-preferredDay" required error={errors.preferredDay}>
                <input
                  id="call-preferredDay"
                  name="preferredDay"
                  type="date"
                  value={formData.preferredDay}
                  onChange={handleChange}
                  min={todayIsoDate}
                  className={getFieldClass('preferredDay')}
                  disabled={loading}
                />
              </FieldGroup>

              <FieldGroup label="Preferred time window" htmlFor="call-preferredTime" required error={errors.preferredTime}>
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {[
                    'Morning (9:00 AM - 12:00 PM)',
                    'Afternoon (12:00 PM - 3:00 PM)',
                    'Late afternoon (3:00 PM - 5:00 PM)',
                    'Anytime during business hours',
                  ].map((timeWindow) => (
                    <label key={timeWindow} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="preferredTime"
                        value={timeWindow}
                        checked={formData.preferredTime === timeWindow}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{timeWindow}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label="Alternate date / time (optional)" htmlFor="call-alternateDateTime" error={errors.alternateDateTime}>
                <input
                  id="call-alternateDateTime"
                  name="alternateDateTime"
                  type="datetime-local"
                  value={formData.alternateDateTime}
                  onChange={handleChange}
                  min={nowIsoDateTimeLocal}
                  className={getFieldClass('alternateDateTime')}
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section C - Reason for Call</h4>
              </div>

              <FieldGroup label="What is this regarding?" htmlFor="call-topic" required error={errors.topic}>
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {Object.entries(topicLabelMap).map(([value, label]) => (
                    <label key={value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="topic"
                        value={value}
                        checked={formData.topic === value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {formData.topic === 'other' && (
                <FieldGroup label='If you selected "Other", please specify:' htmlFor="call-otherTopic" required error={errors.otherTopic}>
                  <input
                    id="call-otherTopic"
                    name="otherTopic"
                    type="text"
                    value={formData.otherTopic}
                    onChange={handleChange}
                    placeholder="Other reason"
                    className={getFieldClass('otherTopic')}
                    disabled={loading}
                  />
                </FieldGroup>
              )}

              <FieldGroup label="Brief description" htmlFor="call-notes">
                <textarea
                  id="call-notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Give us a quick summary of your question or concern so we can come prepared."
                  className={`${getFieldClass('notes')} resize-none`}
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="font-constantia text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="font-serif grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Name of insured:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Phone number:</span> {formData.phone || '-'}
                </p>
                <p>
                  <span className="font-semibold">Email address:</span> {formData.email || '-'}
                </p>
                <p>
                  <span className="font-semibold">Policy number:</span> {formData.policyNumber || '-'}
                </p>
                <p>
                  <span className="font-semibold">Preferred date:</span> {formData.preferredDay || '-'}
                </p>
                <p>
                  <span className="font-semibold">Preferred time window:</span> {formData.preferredTime || '-'}
                </p>
                <p>
                  <span className="font-semibold">Alternate date / time:</span> {formData.alternateDateTime || '-'}
                </p>
                <p>
                  <span className="font-semibold">What is this regarding?:</span> {topicLabelMap[formData.topic] || '-'}
                </p>
              </div>
              {formData.topic === 'other' && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other reason:</span> {formData.otherTopic || '-'}
                </p>
              )}
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Brief description:</span> {formData.notes || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your callback request has been submitted successfully! We will follow up soon.
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

export default CallRequestForm;
