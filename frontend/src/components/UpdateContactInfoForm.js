import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function UpdateContactInfoForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'update-contact-info',
    fullName: '',
    email: '',
    policyNumber: '',
    updateType: 'contact-info',
    updatedValue: '',
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
        formType: 'update-contact-info',
        fullName: '',
        email: '',
        policyNumber: '',
        updateType: 'contact-info',
        updatedValue: '',
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
      badge="Account update"
      title="Update Contact Info or Other Insured Items"
      description="Use this form to send updated contact details or changes to insured items tied to your policy."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Full name" htmlFor="update-fullName" required error={errors.fullName}>
            <input
              id="update-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={getFieldClass('fullName')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Email address" htmlFor="update-email" required error={errors.email}>
            <input
              id="update-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={getFieldClass('email')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Policy number" htmlFor="update-policyNumber" required error={errors.policyNumber}>
            <input
              id="update-policyNumber"
              name="policyNumber"
              type="text"
              value={formData.policyNumber}
              onChange={handleChange}
              placeholder="Policy number"
              className={getFieldClass('policyNumber')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Update type" htmlFor="update-updateType" required error={errors.updateType}>
            <select
              id="update-updateType"
              name="updateType"
              value={formData.updateType}
              onChange={handleChange}
              className={getFieldClass('updateType')}
              disabled={loading}
            >
              <option value="contact-info">Contact info</option>
              <option value="mailing-address">Mailing address</option>
              <option value="insured-item">Insured item</option>
              <option value="vehicle">Vehicle details</option>
              <option value="property">Property details</option>
              <option value="other">Other</option>
            </select>
          </FieldGroup>
        </div>

        <FieldGroup label="Updated information" htmlFor="update-updatedValue" required error={errors.updatedValue}>
          <textarea
            id="update-updatedValue"
            name="updatedValue"
            rows="4"
            value={formData.updatedValue}
            onChange={handleChange}
            placeholder="Add the new contact information or describe the item that should be updated."
            className={`${getFieldClass('updatedValue')} resize-none`}
            disabled={loading}
          />
        </FieldGroup>

        <FieldGroup label="Additional notes" htmlFor="update-notes" required error={errors.notes}>
          <textarea
            id="update-notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Anything else we should know?"
            className={`${getFieldClass('notes')} resize-none`}
            disabled={loading}
          />
        </FieldGroup>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your account update request has been submitted successfully! We will follow up soon.
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

export default UpdateContactInfoForm;