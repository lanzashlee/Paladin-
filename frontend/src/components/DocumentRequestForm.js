import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function DocumentRequestForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    policyNumber: '',
    documentType: 'proof-of-insurance',
    deliveryMethod: 'email',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaved(true);
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
            />
          </FieldGroup>

          <FieldGroup label="Delivery method" htmlFor="documents-deliveryMethod" required error={errors.deliveryMethod}>
            <select
              id="documents-deliveryMethod"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              className={getFieldClass('deliveryMethod')}
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
          />
        </FieldGroup>

        {saved && (
          <div className="rounded-2xl border border-[#b7d4ff] bg-[#eef5ff] px-4 py-3 text-sm text-[#012E72]">
            This is a UI-only draft. Nothing has been submitted.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF]"
          >
            Close
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/15 transition-colors hover:bg-[#002DB5]"
          >
            Save draft
          </button>
        </div>
      </form>
    </RequestModal>
  );
}

export default DocumentRequestForm;