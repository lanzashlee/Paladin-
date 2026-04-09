import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function ClaimReportForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    policyNumber: '',
    incidentDate: '',
    claimType: 'auto',
    incidentLocation: '',
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
      badge="Claim report"
      title="Report a Claim"
      description="Use this form to outline the incident, date, location, and any immediate concerns."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Full name" htmlFor="claim-fullName" required error={errors.fullName}>
            <input
              id="claim-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={getFieldClass('fullName')}
            />
          </FieldGroup>

          <FieldGroup label="Email address" htmlFor="claim-email" required error={errors.email}>
            <input
              id="claim-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={getFieldClass('email')}
            />
          </FieldGroup>

          <FieldGroup label="Policy number" htmlFor="claim-policyNumber" required error={errors.policyNumber}>
            <input
              id="claim-policyNumber"
              name="policyNumber"
              type="text"
              value={formData.policyNumber}
              onChange={handleChange}
              placeholder="Policy number"
              className={getFieldClass('policyNumber')}
            />
          </FieldGroup>

          <FieldGroup label="Date of incident" htmlFor="claim-incidentDate" required error={errors.incidentDate}>
            <input
              id="claim-incidentDate"
              name="incidentDate"
              type="date"
              value={formData.incidentDate}
              onChange={handleChange}
              className={getFieldClass('incidentDate')}
            />
          </FieldGroup>

          <FieldGroup label="Claim type" htmlFor="claim-claimType" required error={errors.claimType}>
            <select
              id="claim-claimType"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              className={getFieldClass('claimType')}
            >
              <option value="auto">Auto</option>
              <option value="home">Home</option>
              <option value="liability">Liability</option>
              <option value="property">Property</option>
              <option value="other">Other</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Location of incident" htmlFor="claim-incidentLocation" required error={errors.incidentLocation}>
            <input
              id="claim-incidentLocation"
              name="incidentLocation"
              type="text"
              value={formData.incidentLocation}
              onChange={handleChange}
              placeholder="City, state, or exact location"
              className={getFieldClass('incidentLocation')}
            />
          </FieldGroup>
        </div>

        <FieldGroup label="What happened?" htmlFor="claim-notes" required error={errors.notes}>
          <textarea
            id="claim-notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Share the event details, who was involved, and any immediate concerns."
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

export default ClaimReportForm;