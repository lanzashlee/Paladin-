import React, { useState } from 'react';
import { FileText, Send, ShieldCheck, User } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'account-holder', label: 'Identify Your Account', icon: User },
  { id: 'update-details', label: 'What Would You Like to Update?', icon: FileText },
  { id: 'new-information', label: 'New Information', icon: ShieldCheck },
  { id: 'apply-changes', label: 'Apply Changes To', icon: Send },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const requestedUpdateOptions = [
  { value: 'email', label: 'Email address' },
  { value: 'phone', label: 'Phone number' },
  { value: 'mailing-address', label: 'Mailing address' },
  { value: 'legal-name', label: 'Legal name (e.g. name change or correction)' },
  { value: 'other', label: 'Other (describe below)' },
];

const requestedUpdateLabelMap = {
  email: 'Email address',
  phone: 'Phone number',
  'mailing-address': 'Mailing address',
  'legal-name': 'Legal name (e.g. name change or correction)',
  other: 'Other',
};

const applyChangesToOptions = [
  { value: 'all-policies', label: 'All active policies on my account' },
  { value: 'specific-policy', label: 'One specific policy only - provide policy number below' },
];

const applyChangesToLabelMap = {
  'all-policies': 'All active policies on my account',
  'specific-policy': 'One specific policy only',
};

const requestedUpdateFieldMap = {
  email: {
    name: 'newEmailAddress',
    label: 'New email address',
    placeholder: 'Updated email',
    type: 'email',
  },
  phone: {
    name: 'newPhoneNumber',
    label: 'New phone number',
    placeholder: 'Updated phone',
    type: 'text',
  },
  'mailing-address': {
    name: 'newMailingAddress',
    label: 'New mailing address',
    placeholder: 'Street, City, State, ZIP',
    type: 'text',
  },
  'legal-name': {
    name: 'newLegalName',
    label: 'New legal name (if changing)',
    placeholder: 'Full updated legal name',
    type: 'text',
  },
};

const requiresOtherDescription = (requestedUpdateTypes) => requestedUpdateTypes.includes('other');
const requiresPolicyNumber = (applyChangesTo) => applyChangesTo === 'specific-policy';

const getRequestedUpdateFieldConfigs = (requestedUpdateTypes, otherUpdateLabel) =>
  requestedUpdateTypes
    .map((requestedType) => {
      if (requestedType === 'other') {
        return {
          key: 'other',
          name: 'otherUpdateValue',
          label: otherUpdateLabel.trim() || 'Other update',
          placeholder: 'Describe the update',
          type: 'textarea',
          rows: 4,
        };
      }

      return requestedUpdateFieldMap[requestedType] ? { key: requestedType, ...requestedUpdateFieldMap[requestedType] } : null;
    })
    .filter(Boolean);

const getRequestedUpdateTypeLabels = (requestedUpdateTypes) =>
  requestedUpdateTypes.map((requestedType) => requestedUpdateLabelMap[requestedType] || requestedType).join(', ');

const getApplyChangesToLabel = (applyChangesTo) => applyChangesToLabelMap[applyChangesTo] || applyChangesTo;
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

function UpdateContactInfoForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'update-contact-info',
    fullName: '',
    email: '',
    requestedUpdateTypes: [],
    requestedUpdateTypeLabels: '',
    otherUpdateLabel: '',
    otherUpdateValue: '',
    newEmailAddress: '',
    newPhoneNumber: '',
    newMailingAddress: '',
    newLegalName: '',
    notes: '',
    applyChangesTo: 'all-policies',
    applyChangesToLabel: getApplyChangesToLabel('all-policies'),
    policyNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const getFieldClass = (field) =>
    errors[field]
      ? `${inputClassName} border-red-500 focus:ring-red-300 focus:border-red-500`
      : inputClassName;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = name === 'newPhoneNumber' ? formatUsPhoneDisplay(value) : value;
    setSaved(false);
    setSubmitError(null);
    setFormData((current) => ({
      ...current,
      [name]: normalizedValue,
      ...(name === 'applyChangesTo' ? { applyChangesToLabel: getApplyChangesToLabel(value) } : {}),
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    setSaved(false);
    setSubmitError(null);
    setFormData((current) => {
      const currentValues = Array.isArray(current[name]) ? current[name] : [];
      const nextValues = checked ? [...currentValues, value] : currentValues.filter((entry) => entry !== value);

      return {
        ...current,
        [name]: nextValues,
        ...(name === 'requestedUpdateTypes' ? { requestedUpdateTypeLabels: getRequestedUpdateTypeLabels(nextValues) } : {}),
      };
    });

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const validateStep = (currentStepIndex) => {
    const validationErrors = {};

    if (currentStepIndex === 0) {
      if (!String(formData.fullName || '').trim()) {
        validationErrors.fullName = 'This field is required.';
      }
      if (!String(formData.email || '').trim()) {
        validationErrors.email = 'This field is required.';
      } else if (!isValidEmailFormat(formData.email)) {
        validationErrors.email = 'Please enter a valid email address.';
      }
      return validationErrors;
    }

    if (currentStepIndex === 1) {
      if (!Array.isArray(formData.requestedUpdateTypes) || formData.requestedUpdateTypes.length === 0) {
        validationErrors.requestedUpdateTypes = 'Select at least one update.';
      }

      if (requiresOtherDescription(formData.requestedUpdateTypes) && !String(formData.otherUpdateLabel || '').trim()) {
        validationErrors.otherUpdateLabel = 'Please name the other update.';
      }

      return validationErrors;
    }

    if (currentStepIndex === 2) {
      const fieldConfigs = getRequestedUpdateFieldConfigs(formData.requestedUpdateTypes, formData.otherUpdateLabel);

      fieldConfigs.forEach((field) => {
        if (!String(formData[field.name] || '').trim()) {
          validationErrors[field.name] = 'This field is required.';
        }
      });

      if (
        formData.requestedUpdateTypes.includes('email') &&
        String(formData.newEmailAddress || '').trim() &&
        !isValidEmailFormat(formData.newEmailAddress)
      ) {
        validationErrors.newEmailAddress = 'Please enter a valid email address.';
      }

      if (formData.requestedUpdateTypes.includes('phone') && String(formData.newPhoneNumber || '').trim()) {
        const digits = normalizeUsPhoneDigits(formData.newPhoneNumber);
        if (digits.length !== 10) {
          validationErrors.newPhoneNumber = 'Phone number must be exactly 10 digits (US format).';
        }
      }

      return validationErrors;
    }

    if (currentStepIndex === 3) {
      if (!String(formData.applyChangesTo || '').trim()) {
        validationErrors.applyChangesTo = 'This field is required.';
      }

      if (requiresPolicyNumber(formData.applyChangesTo) && !String(formData.policyNumber || '').trim()) {
        validationErrors.policyNumber = 'This field is required.';
      }

      return validationErrors;
    }

    return validationErrors;
  };

  const validateForm = () => ({
    ...validateStep(0),
    ...validateStep(1),
    ...validateStep(2),
    ...validateStep(3),
  });

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
        formType: 'update-contact-info',
        fullName: '',
        email: '',
        requestedUpdateTypes: [],
        requestedUpdateTypeLabels: '',
        otherUpdateLabel: '',
        otherUpdateValue: '',
        newEmailAddress: '',
        newPhoneNumber: '',
        newMailingAddress: '',
        newLegalName: '',
        notes: '',
        applyChangesTo: 'all-policies',
        applyChangesToLabel: getApplyChangesToLabel('all-policies'),
        policyNumber: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationErrors = validateStep(stepIndex);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const selectedFieldConfigs = getRequestedUpdateFieldConfigs(formData.requestedUpdateTypes, formData.otherUpdateLabel);

  return (
    <RequestModal
      badge="Account update"
      title="Update Contact Info or Other Insured Details"
      description="Let us know what information needs to be updated on your account. We will make sure everything is accurate
across your active policies."
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
                <h4 className="text-lg font-semibold text-[#012E72]">Section A - Identify Your Account</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Name of insured" htmlFor="update-fullName" required error={errors.fullName}>
                  <input
                    id="update-fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name as it appears on your policy"
                    className={getFieldClass('fullName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Current email on file" htmlFor="update-email" required error={errors.email}>
                  <input
                    id="update-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="So we can locate your account"
                    pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}"
                    className={getFieldClass('email')}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section B - What Would You Like to Update?</h4>
              </div>

              <FieldGroup label="Select one or more update types" htmlFor="update-requestedUpdateTypes" required error={errors.requestedUpdateTypes} hint="Check all that apply">
                <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {requestedUpdateOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm text-[#010407] transition-colors hover:bg-[#F7F4EF]"
                    >
                      <input
                        type="checkbox"
                        name="requestedUpdateTypes"
                        value={option.value}
                        checked={formData.requestedUpdateTypes.includes(option.value)}
                        onChange={handleCheckboxChange}
                        className="mt-1 h-4 w-4 rounded border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {requiresOtherDescription(formData.requestedUpdateTypes) && (
                <FieldGroup label='If you selected "Other", what should this update be called?' htmlFor="update-otherUpdateLabel" required error={errors.otherUpdateLabel}>
                  <textarea
                    id="update-otherUpdateLabel"
                    name="otherUpdateLabel"
                    rows="2"
                    value={formData.otherUpdateLabel}
                    onChange={handleChange}
                    placeholder="Example: Preferred name"
                    className={`${getFieldClass('otherUpdateLabel')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              )}
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section C - New Information</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {selectedFieldConfigs.map((field) => (
                  <FieldGroup key={field.key} label={field.label} htmlFor={`update-${field.name}`} required error={errors[field.name]}>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={`update-${field.name}`}
                        name={field.name}
                        rows={field.rows || 4}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`${getFieldClass(field.name)} resize-none`}
                        disabled={loading}
                      />
                    ) : (
                      <input
                        id={`update-${field.name}`}
                        name={field.name}
                        type={field.type || 'text'}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        inputMode={field.name === 'newPhoneNumber' ? 'numeric' : undefined}
                        maxLength={field.name === 'newPhoneNumber' ? 14 : undefined}
                        pattern={
                          field.name === 'newPhoneNumber'
                            ? '\\d{10}'
                            : field.type === 'email'
                            ? "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z]{2,})+"
                            : undefined
                        }
                        className={getFieldClass(field.name)}
                        disabled={loading}
                      />
                    )}
                  </FieldGroup>
                ))}
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section D - Apply Changes To</h4>
              </div>

              <FieldGroup label="Choose how to apply the changes" htmlFor="update-applyChangesTo" required error={errors.applyChangesTo}>
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {applyChangesToOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="applyChangesTo"
                        value={option.value}
                        checked={formData.applyChangesTo === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup
                label="Policy number"
                htmlFor="update-policyNumber"
                required={requiresPolicyNumber(formData.applyChangesTo)}
                error={errors.policyNumber}
                hint="Only required if you select one specific policy only"
              >
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
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Name of insured:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Current email on file:</span> {formData.email || '-'}
                </p>
                <p>
                  <span className="font-semibold">Updates requested:</span> {formData.requestedUpdateTypes.length ? formData.requestedUpdateTypes.map((entry) => requestedUpdateLabelMap[entry] || entry).join(', ') : '-'}
                </p>
                <p>
                  <span className="font-semibold">Apply changes to:</span> {applyChangesToLabelMap[formData.applyChangesTo] || '-'}
                </p>
              </div>

              {requiresOtherDescription(formData.requestedUpdateTypes) && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other update label:</span> {formData.otherUpdateLabel || '-'}
                </p>
              )}

              {selectedFieldConfigs.map((field) => (
                <p key={field.key} className="text-sm text-[#010407]/80">
                  <span className="font-semibold">{field.label}:</span> {formData[field.name] || '-'}
                </p>
              ))}

              {formData.notes && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Additional notes:</span> {formData.notes}
                </p>
              )}

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Policy number:</span> {formData.policyNumber || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

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

export default UpdateContactInfoForm;
