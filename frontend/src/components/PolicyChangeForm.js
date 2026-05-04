import React, { useState } from 'react';
import { FileText, Send, ShieldCheck, User } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'your-information', label: 'Your Information', icon: User },
  { id: 'change-requested', label: 'Type of Change', icon: FileText },
  { id: 'special-details', label: 'Mortgage / Lienholder Update', icon: ShieldCheck },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'email', 'policyType'],
  ['requestedChangeTypes', 'notes'],
  ['mortgageeName', 'loanNumber', 'mailingAddress'],
  [],
];

const policyTypeOptions = [
  { value: 'homeowners-ho3', label: 'Homeowners (HO3)' },
  { value: 'condo-ho6', label: 'Condo (HO6)' },
  { value: 'renters-ho4', label: 'Renters (HO4)' },
  { value: 'dwelling-rental-property', label: 'Dwelling / Rental Property' },
  { value: 'commercial-gl', label: 'Commercial GL' },
  { value: 'commercial-auto', label: 'Commercial Auto' },
  { value: 'workers-comp', label: "Workers' Comp" },
  { value: 'umbrella-excess', label: 'Umbrella / Excess' },
  { value: 'other', label: 'Other' },
];

const requestedChangeTypeOptions = [
  { value: 'driver', label: 'Add or remove a driver' },
  { value: 'vehicle', label: 'Add, replace, or remove a vehicle' },
  { value: 'property-location', label: 'Add or remove a property / location' },
  { value: 'property-details', label: 'Update property details (roof, renovations, square footage, etc.)' },
  { value: 'endorsement', label: 'Add or remove an endorsement' },
  { value: 'coverage-limits-deductibles', label: 'Change coverage limits or deductibles' },
  { value: 'mortgagee-lienholder-loss-payee', label: 'Add or update a mortgagee / lienholder / loss payee' },
  { value: 'cancel-policy', label: 'Cancel this policy' },
  { value: 'other', label: 'Other (describe below)' },
];

const requestedChangeTypeLabelMap = {
  driver: 'Add or remove a driver',
  vehicle: 'Add, replace, or remove a vehicle',
  'property-location': 'Add or remove a property / location',
  'property-details': 'Update property details (roof, renovations, square footage, etc.)',
  endorsement: 'Add or remove an endorsement',
  'coverage-limits-deductibles': 'Change coverage limits or deductibles',
  'mortgagee-lienholder-loss-payee': 'Add or update a mortgagee / lienholder / loss payee',
  'cancel-policy': 'Cancel this policy',
  other: 'Other',
};

const requiresMortgageeDetails = (requestedChangeTypes) =>
  requestedChangeTypes.includes('mortgagee-lienholder-loss-payee');

const requiresRequestedChangeOther = (requestedChangeTypes) =>
  requestedChangeTypes.includes('other');
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

const getTodayIsoDate = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

function PolicyChangeForm({ onClose }) {
  const todayIsoDate = getTodayIsoDate();
  const [formData, setFormData] = useState({
    formType: 'policy-change',
    fullName: '',
    email: '',
    policyType: '',
    otherPolicyType: '',
    effectiveDate: '',
    requestedChangeTypes: [],
    requestedChangeOther: '',
    notes: '',
    mortgageeName: '',
    loanNumber: '',
    mailingAddress: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const validateFields = (fields) => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field === 'requestedChangeTypes') {
        if (!Array.isArray(formData.requestedChangeTypes) || formData.requestedChangeTypes.length === 0) {
          newErrors.requestedChangeTypes = 'Select at least one requested change.';
        }
        return;
      }

      if (field === 'otherPolicyType' && formData.policyType !== 'other') {
        return;
      }

      if (field === 'requestedChangeOther' && !requiresRequestedChangeOther(formData.requestedChangeTypes)) {
        return;
      }

      if (
        ['mortgageeName', 'loanNumber', 'mailingAddress'].includes(field) &&
        !requiresMortgageeDetails(formData.requestedChangeTypes)
      ) {
        return;
      }

      if (field === 'effectiveDate') {
        return;
      }

      if (!String(formData[field] ?? '').trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    if (fields.includes('otherPolicyType') && formData.policyType === 'other' && !formData.otherPolicyType.trim()) {
      newErrors.otherPolicyType = 'Please describe the policy type.';
    }

    if (
      fields.includes('requestedChangeOther') &&
      requiresRequestedChangeOther(formData.requestedChangeTypes) &&
      !formData.requestedChangeOther.trim()
    ) {
      newErrors.requestedChangeOther = 'Please describe the other requested change.';
    }

    if (fields.includes('mortgageeName') && requiresMortgageeDetails(formData.requestedChangeTypes)) {
      if (!formData.mortgageeName.trim()) {
        newErrors.mortgageeName = 'This field is required.';
      }
      if (!formData.loanNumber.trim()) {
        newErrors.loanNumber = 'This field is required.';
      }
      if (!formData.mailingAddress.trim()) {
        newErrors.mailingAddress = 'This field is required.';
      }
    }

    if (fields.includes('email') && formData.email.trim() && !isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (fields.includes('effectiveDate') && formData.effectiveDate.trim() && formData.effectiveDate < todayIsoDate) {
      newErrors.effectiveDate = 'Requested effective date cannot be in the past.';
    }

    return newErrors;
  };

  const validateForm = () =>
    validateFields([
      'fullName',
      'email',
      'policyType',
      'otherPolicyType',
      'effectiveDate',
      'requestedChangeTypes',
      'requestedChangeOther',
      'notes',
      'mortgageeName',
      'loanNumber',
      'mailingAddress',
    ]);

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

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    setSaved(false);
    setSubmitError(null);
    setFormData((current) => {
      const currentValues = Array.isArray(current[name]) ? current[name] : [];
      const nextValues = checked
        ? [...currentValues, value]
        : currentValues.filter((entry) => entry !== value);

      return {
        ...current,
        [name]: nextValues,
      };
    });

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
      setStepIndex(wizardSteps.length - 1);
      setFormData({
        formType: 'policy-change',
        fullName: '',
        email: '',
        policyType: '',
        otherPolicyType: '',
        effectiveDate: '',
        requestedChangeTypes: [],
        requestedChangeOther: '',
        notes: '',
        mortgageeName: '',
        loanNumber: '',
        mailingAddress: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentFields = [...(stepFields[stepIndex] || [])];
    if (stepIndex === 0) {
      currentFields.push('otherPolicyType');
      currentFields.push('effectiveDate');
    }
    if (stepIndex === 1) {
      currentFields.push('requestedChangeOther');
    }

    const validationErrors = validateFields(currentFields);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const getPolicyTypeLabel = (value) =>
    policyTypeOptions.find((option) => option.value === value)?.label || '-';

  const getRequestedChangeTypeLabelList = (values) => {
    if (!values.length) {
      return '-';
    }

    return values
      .map((entry) => requestedChangeTypeLabelMap[entry] || entry)
      .join(', ');
  };

  return (
    <RequestModal
      badge="Policy change"
      title="Policy Change Request"
      description="Use this form to request changes to your existing policy. Changes are subject to carrier approval and may
        affect your premium."
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
            <div>
              <div className="mb-4 border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section A - Your Information</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Name of insured" htmlFor="policy-fullName" required error={errors.fullName} hint="As it appears on your policy">
                  <input
                    id="policy-fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="As it appears on your policy"
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
                    placeholder="your@email.com"
                    pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}"
                    className={getFieldClass('email')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Policy type" htmlFor="policy-policyType" required error={errors.policyType}>
                  <select
                    id="policy-policyType"
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleChange}
                    className={getFieldClass('policyType')}
                    disabled={loading}
                  >
                    <option value="">Select policy type</option>
                    {policyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FieldGroup>

                <FieldGroup label="Requested effective date of change (optional)" htmlFor="policy-effectiveDate" error={errors.effectiveDate}>
                  <input
                    id="policy-effectiveDate"
                    name="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={handleChange}
                    min={todayIsoDate}
                    className={getFieldClass('effectiveDate')}
                    disabled={loading}
                  />
                </FieldGroup>

                {formData.policyType === 'other' && (
                  <FieldGroup label='If you selected "Other", please describe:' htmlFor="policy-otherPolicyType" required error={errors.otherPolicyType}>
                    <input
                      id="policy-otherPolicyType"
                      name="otherPolicyType"
                      type="text"
                      value={formData.otherPolicyType}
                      onChange={handleChange}
                      placeholder="Describe your policy type"
                      className={getFieldClass('otherPolicyType')}
                      disabled={loading}
                    />
                  </FieldGroup>
                )}
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section B - Change Requested</h4>
              </div>

              <div className="grid gap-5 md:grid-cols-1">
                <FieldGroup label="What would you like to change?" htmlFor="policy-requestedChangeTypes" required error={errors.requestedChangeTypes} hint="Check all that apply">
                  <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                    {requestedChangeTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm text-[#010407] transition-colors hover:bg-[#F7F4EF]"
                      >
                        <input
                          type="checkbox"
                          name="requestedChangeTypes"
                          value={option.value}
                          checked={formData.requestedChangeTypes.includes(option.value)}
                          onChange={handleCheckboxChange}
                          className="mt-1 h-4 w-4 rounded border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                          disabled={loading}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </FieldGroup>
              </div>

              {requiresRequestedChangeOther(formData.requestedChangeTypes) && (
                <FieldGroup label='If you selected "Other", please describe:' htmlFor="policy-requestedChangeOther" required error={errors.requestedChangeOther}>
                  <textarea
                    id="policy-requestedChangeOther"
                    name="requestedChangeOther"
                    rows="3"
                    value={formData.requestedChangeOther}
                    onChange={handleChange}
                    placeholder="Describe the requested change..."
                    className={`${getFieldClass('requestedChangeOther')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              )}

              <FieldGroup label="Describe the requested change in detail" htmlFor="policy-notes" required error={errors.notes}>
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
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section C - Mortgagee / Lienholder Details</h4>
              </div>

              <p className="text-sm italic text-[#010407]/70">
                Complete this section if your requested changes include a mortgagee, lienholder, or loss payee update.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup
                  label="Mortgagee / lienholder name"
                  htmlFor="policy-mortgageeName"
                  required={requiresMortgageeDetails(formData.requestedChangeTypes)}
                  error={errors.mortgageeName}
                >
                  <input
                    id="policy-mortgageeName"
                    name="mortgageeName"
                    type="text"
                    value={formData.mortgageeName}
                    onChange={handleChange}
                    placeholder="Company or person name"
                    className={getFieldClass('mortgageeName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup
                  label="Loan number"
                  htmlFor="policy-loanNumber"
                  required={requiresMortgageeDetails(formData.requestedChangeTypes)}
                  error={errors.loanNumber}
                >
                  <input
                    id="policy-loanNumber"
                    name="loanNumber"
                    type="text"
                    value={formData.loanNumber}
                    onChange={handleChange}
                    placeholder="Loan number"
                    className={getFieldClass('loanNumber')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup
                  label="Mailing address"
                  htmlFor="policy-mailingAddress"
                  required={requiresMortgageeDetails(formData.requestedChangeTypes)}
                  error={errors.mailingAddress}
                >
                  <textarea
                    id="policy-mailingAddress"
                    name="mailingAddress"
                    rows="4"
                    value={formData.mailingAddress}
                    onChange={handleChange}
                    placeholder="Street, City, State, ZIP"
                    className={`${getFieldClass('mailingAddress')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-serif text-sm text-amber-900">
                <strong>Note:</strong> Policy changes require carrier approval and may result in a premium adjustment. We will confirm the change with you before anything is finalized.
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="font-constantia text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="font-serif grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Full name:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {formData.email || '-'}
                </p>
                <p>
                  <span className="font-semibold">Policy type:</span> {getPolicyTypeLabel(formData.policyType)}
                </p>
                <p>
                  <span className="font-semibold">Requested effective date of change:</span> {formData.effectiveDate || '-'}
                </p>
                <p>
                  <span className="font-semibold">Requested change type(s):</span> {getRequestedChangeTypeLabelList(formData.requestedChangeTypes)}
                </p>
              </div>

              {formData.policyType === 'other' && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other policy type:</span> {formData.otherPolicyType || '-'}
                </p>
              )}

              {requiresRequestedChangeOther(formData.requestedChangeTypes) && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other requested change:</span> {formData.requestedChangeOther || '-'}
                </p>
              )}

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Change details:</span> {formData.notes || '-'}
              </p>

              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Mortgagee / lienholder name:</span> {formData.mortgageeName || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Loan number:</span> {formData.loanNumber || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Mailing address:</span> {formData.mailingAddress || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 font-serif text-sm text-green-700">
            Your policy change request has been submitted successfully! We will follow up soon.
          </div>
        )}

        {submitError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 font-serif text-sm text-red-700">
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

export default PolicyChangeForm;
