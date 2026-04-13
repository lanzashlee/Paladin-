import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

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

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      if (!value.trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    return newErrors;
  };

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

  return (
    <RequestModal
      badge="Call request"
      title="Request a Call"
      description="Use this form to request a callback and describe what you want to discuss."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/15 transition-colors hover:bg-[#002DB5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </RequestModal>
  );
}

export default CallRequestForm;