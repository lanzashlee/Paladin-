import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function PolicyChangeForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'policy-change',
    fullName: '',
    email: '',
    policyNumber: '',
    changeType: 'coverage',
    effectiveDate: '',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSaved(true);
      setFormData({
        formType: 'policy-change',
        fullName: '',
        email: '',
        policyNumber: '',
        changeType: 'coverage',
        effectiveDate: '',
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
      badge="Policy change"
      title="Policy Change"
      description="Use this form to describe the policy adjustment you want and when the change should take effect."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Full name" htmlFor="policy-fullName" required error={errors.fullName}>
            <input
              id="policy-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={getFieldClass('fullName')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Email address" htmlFor="policy-email" required error={errors.email}>
            <input
              id="policy-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={getFieldClass('email')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Policy number" htmlFor="policy-policyNumber" required error={errors.policyNumber}>
            <input
              id="policy-policyNumber"
              name="policyNumber"
              type="text"
              value={formData.policyNumber}
              onChange={handleChange}
              placeholder="Policy number"
              className={getFieldClass('policyNumber')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Effective date" htmlFor="policy-effectiveDate" required error={errors.effectiveDate}>
            <input
              id="policy-effectiveDate"
              name="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={handleChange}
              className={getFieldClass('effectiveDate')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Change type" htmlFor="policy-changeType" required error={errors.changeType}>
            <select
              id="policy-changeType"
              name="changeType"
              value={formData.changeType}
              onChange={handleChange}
              className={getFieldClass('changeType')}
              disabled={loading}
            >
              <option value="coverage">Coverage change</option>
              <option value="billing">Billing update</option>
              <option value="vehicle">Vehicle update</option>
              <option value="property">Property update</option>
              <option value="named-insured">Named insured update</option>
              <option value="other">Other</option>
            </select>
          </FieldGroup>
        </div>

        <FieldGroup label="Describe the change" htmlFor="policy-notes" required error={errors.notes}>
          <textarea
            id="policy-notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Describe what needs to change and include any new details or dates."
            className={`${getFieldClass('notes')} resize-none`}
            disabled={loading}
          />
        </FieldGroup>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your policy change request has been submitted successfully! We will follow up soon.
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

export default PolicyChangeForm;