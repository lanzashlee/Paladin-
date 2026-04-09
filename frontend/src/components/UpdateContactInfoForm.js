import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function UpdateContactInfoForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    policyNumber: '',
    updateType: 'contact-info',
    updatedValue: '',
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
            />
          </FieldGroup>

          <FieldGroup label="Update type" htmlFor="update-updateType" required error={errors.updateType}>
            <select
              id="update-updateType"
              name="updateType"
              value={formData.updateType}
              onChange={handleChange}
              className={getFieldClass('updateType')}
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

export default UpdateContactInfoForm;