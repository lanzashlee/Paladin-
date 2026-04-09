import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function PolicyChangeForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    policyNumber: '',
    changeType: 'coverage',
    effectiveDate: '',
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
            />
          </FieldGroup>

          <FieldGroup label="Change type" htmlFor="policy-changeType" required error={errors.changeType}>
            <select
              id="policy-changeType"
              name="changeType"
              value={formData.changeType}
              onChange={handleChange}
              className={getFieldClass('changeType')}
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

export default PolicyChangeForm;