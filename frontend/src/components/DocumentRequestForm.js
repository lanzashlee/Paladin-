import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function DocumentRequestForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'document-request',
    fullName: '',
    email: '',
    policyNumber: '',
    documentType: 'proof-of-insurance',
    deliveryMethod: 'email',
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
        formType: 'document-request',
        fullName: '',
        email: '',
        policyNumber: '',
        documentType: 'proof-of-insurance',
        deliveryMethod: 'email',
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
      badge="Documents"
      title="Request Proof of Insurance or Other Documents"
      description="Use this form to request policy documents and choose how you want them delivered."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Full name" htmlFor="documents-fullName" required error={errors.fullName}>
            <input
              id="documents-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={getFieldClass('fullName')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Email address" htmlFor="documents-email" required error={errors.email}>
            <input
              id="documents-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={getFieldClass('email')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Policy number" htmlFor="documents-policyNumber" required error={errors.policyNumber}>
            <input
              id="documents-policyNumber"
              name="policyNumber"
              type="text"
              value={formData.policyNumber}
              onChange={handleChange}
              placeholder="Policy number"
              className={getFieldClass('policyNumber')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Delivery method" htmlFor="documents-deliveryMethod" required error={errors.deliveryMethod}>
            <select
              id="documents-deliveryMethod"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              className={getFieldClass('deliveryMethod')}
              disabled={loading}
            >
              <option value="email">Email</option>
              <option value="pickup">Pick up in office</option>
              <option value="secure-link">Secure link</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Document type" htmlFor="documents-documentType" required error={errors.documentType}>
            <select
              id="documents-documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className={getFieldClass('documentType')}
              disabled={loading}
            >
              <option value="proof-of-insurance">Proof of insurance</option>
              <option value="id-card">Insurance ID card</option>
              <option value="declarations-page">Declarations page</option>
              <option value="certificate-holder">Certificate holder</option>
              <option value="other-documents">Other documents</option>
            </select>
          </FieldGroup>
        </div>

        <FieldGroup label="Additional details" htmlFor="documents-notes" required error={errors.notes}>
          <textarea
            id="documents-notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us who needs the document, where it should go, and any special details."
            className={`${getFieldClass('notes')} resize-none`}
            disabled={loading}
          />
        </FieldGroup>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your document request has been submitted successfully! We will follow up soon.
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

export default DocumentRequestForm;