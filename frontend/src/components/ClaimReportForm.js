import React, { useState } from 'react';
import { User, FileText, Send } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'claimant-info', label: 'Claimant Info', icon: User },
  { id: 'incident-details', label: 'Incident Details', icon: FileText },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'email', 'policyNumber'],
  ['incidentDate', 'claimType', 'incidentLocation', 'notes'],
  [],
];

const claimTypeLabelMap = {
  auto: 'Auto',
  home: 'Home',
  liability: 'Liability',
  property: 'Property',
  other: 'Other',
};

function ClaimReportForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'claim-report',
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
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const validateFields = (fields) => {
    const newErrors = {};

    fields.forEach((field) => {
      if (!String(formData[field] ?? '').trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    return newErrors;
  };

  const validateForm = () => validateFields(Object.keys(formData));

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
      setStepIndex(wizardSteps.length - 1);
      setFormData({
        formType: 'claim-report',
        fullName: '',
        email: '',
        policyNumber: '',
        incidentDate: '',
        claimType: 'auto',
        incidentLocation: '',
        notes: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationErrors = validateFields(stepFields[stepIndex] || []);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <RequestModal
      badge="Claim report"
      title="Report a Claim"
      description="Use this form to outline the incident, date, location, and any immediate concerns."
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Date of incident" htmlFor="claim-incidentDate" required error={errors.incidentDate}>
                  <input
                    id="claim-incidentDate"
                    name="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    className={getFieldClass('incidentDate')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Claim type" htmlFor="claim-claimType" required error={errors.claimType}>
                  <select
                    id="claim-claimType"
                    name="claimType"
                    value={formData.claimType}
                    onChange={handleChange}
                    className={getFieldClass('claimType')}
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
                />
              </FieldGroup>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4 rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/55 p-5">
              <h4 className="text-base font-semibold text-[#012E72]">Review your request</h4>
              <div className="grid gap-3 text-sm text-[#010407]/80 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Full name:</span> {formData.fullName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {formData.email || '-'}
                </p>
                <p>
                  <span className="font-semibold">Policy number:</span> {formData.policyNumber || '-'}
                </p>
                <p>
                  <span className="font-semibold">Date of incident:</span> {formData.incidentDate || '-'}
                </p>
                <p>
                  <span className="font-semibold">Claim type:</span> {claimTypeLabelMap[formData.claimType] || '-'}
                </p>
                <p>
                  <span className="font-semibold">Incident location:</span> {formData.incidentLocation || '-'}
                </p>
              </div>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Incident details:</span> {formData.notes || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your claim report has been submitted successfully! We will follow up soon.
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

export default ClaimReportForm;
