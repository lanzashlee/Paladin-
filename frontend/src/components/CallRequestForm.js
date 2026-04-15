import React, { useState } from 'react';
import { User, FileText, Send } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'contact-details', label: 'Contact Details', icon: User },
  { id: 'call-preferences', label: 'Call Preferences', icon: FileText },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'phone', 'preferredDay'],
  ['preferredTime', 'topic', 'notes'],
  [],
];

const topicLabelMap = {
  general: 'General support',
  'new-policy': 'New policy',
  'existing-policy': 'Existing policy',
  billing: 'Billing',
  claims: 'Claims',
  other: 'Other',
};

function CallRequestForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'call-request',
    fullName: '',
    phone: '',
    preferredDay: '',
    preferredTime: 'Morning',
    topic: 'general',
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
      if (!String(formData[field] ?? '').trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    return newErrors;
  };

  const validateForm = () => validateFields(Object.keys(formData));

  const getFieldClass = (field) =>
    errors[field]
      ? `${inputClassName} border-red-500 focus:ring-red-300 focus:border-red-500`
      : inputClassName;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setSubmitError(null);
    setFormData((current) => ({
      ...current,
      [name]: value,
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
        preferredDay: '',
        preferredTime: 'Morning',
        topic: 'general',
        notes: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationErrors = validateFields(stepFields[stepIndex] || []);

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
      description="Use this form to request a callback and describe what you want to discuss."
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
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup label="Full name" htmlFor="call-fullName" required error={errors.fullName}>
                <input
                  id="call-fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
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
                  placeholder="(555) 555-5555"
                  className={getFieldClass('phone')}
                  disabled={loading}
                />
              </FieldGroup>

              <FieldGroup label="Preferred day" htmlFor="call-preferredDay" required error={errors.preferredDay}>
                <input
                  id="call-preferredDay"
                  name="preferredDay"
                  type="date"
                  value={formData.preferredDay}
                  onChange={handleChange}
                  className={getFieldClass('preferredDay')}
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Preferred time" htmlFor="call-preferredTime" required error={errors.preferredTime}>
                  <select
                    id="call-preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={getFieldClass('preferredTime')}
                    disabled={loading}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </FieldGroup>

                <FieldGroup label="Topic" htmlFor="call-topic" required error={errors.topic}>
                  <select
                    id="call-topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className={getFieldClass('topic')}
                    disabled={loading}
                  >
                    <option value="general">General support</option>
                    <option value="new-policy">New policy</option>
                    <option value="existing-policy">Existing policy</option>
                    <option value="billing">Billing</option>
                    <option value="claims">Claims</option>
                    <option value="other">Other</option>
                  </select>
                </FieldGroup>
              </div>

              <FieldGroup label="Anything we should know?" htmlFor="call-notes" required error={errors.notes}>
                <textarea
                  id="call-notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add a short note about what you want to discuss."
                  className={`${getFieldClass('notes')} resize-none`}
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Full name:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {formData.phone || '-'}
                </p>
                <p>
                  <span className="font-semibold">Preferred day:</span> {formData.preferredDay || '-'}
                </p>
                <p>
                  <span className="font-semibold">Preferred time:</span> {formData.preferredTime || '-'}
                </p>
                <p>
                  <span className="font-semibold">Topic:</span> {topicLabelMap[formData.topic] || '-'}
                </p>
              </div>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Notes:</span> {formData.notes || '-'}
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
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
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
