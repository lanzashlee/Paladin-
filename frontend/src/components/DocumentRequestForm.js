import React, { useState } from 'react';
import { FileText, Send, ShieldCheck, User } from 'lucide-react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';
import RequestFormWizard from './RequestFormWizard';

const wizardSteps = [
  { id: 'your-information', label: 'Your Information', icon: User },
  { id: 'document-requested', label: 'Document Requested', icon: FileText },
  { id: 'special-requirements', label: 'Special Requirements', icon: ShieldCheck },
  { id: 'review-submit', label: 'Review & Submit', icon: Send },
];

const stepFields = [
  ['fullName', 'email'],
  ['documentType'],
  ['additionalInsuredStatus', 'certificateHolderName', 'certificateHolderEmail', 'certificateHolderAddress'],
  [],
];

const documentTypeOptions = [
  { value: 'coi-acord25', label: 'COI / ACORD 25 (General Liability / Auto / Workers\' Comp)' },
  { value: 'evidence-property-insurance-acord28', label: 'Evidence of Property Insurance / ACORD 28 (Mortgagee / Lender)' },
  { value: 'evidence-homeowners-acord27', label: 'Evidence of Homeowners Insurance / ACORD 27' },
  { value: 'declarations-page-copy', label: 'Declarations page copy' },
  { value: 'endorsement-copy', label: 'Endorsement copy' },
  { value: 'other', label: 'Other (describe in the box below)' },
];

const coverageOptions = [
  { value: 'general-liability', label: 'General Liability (GL)' },
  { value: 'commercial-auto', label: 'Commercial Auto' },
  { value: 'umbrella', label: 'Umbrella / Excess Liability' },
  { value: 'workers-compensation', label: 'Workers\' Compensation (WC)' },
  { value: 'professional-liability', label: 'Professional Liability / E&O' },
];

const endorsementOptions = [
  { value: 'waiver-subrogation', label: 'Waiver of Subrogation' },
  { value: 'pnc', label: 'Primary & Non-Contributory (P&NC)' },
  { value: 'hnoa', label: 'Hired & Non-Owned Auto (HNOA)' },
];

const additionalInsuredStatusLabelMap = {
  yes: 'Yes - they need to be added as an Additional Insured on my GL / Auto policy',
  no: 'No - standard proof of insurance is sufficient',
  'not-sure': 'I am not sure',
};

function DocumentRequestForm({ onClose }) {
  const [formData, setFormData] = useState({
    formType: 'document-request',
    fullName: '',
    email: '',
    documentType: 'coi-acord25',
    otherDocumentTypeDescription: '',
    coveragesToShow: [],
    operationsDescription: '',
    additionalInsuredStatus: '',
    additionalEndorsements: [],
    certificateHolderName: '',
    certificateHolderEmail: '',
    certificateHolderAddress: '',
    deadlineInstructions: '',
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

    if (fields.includes('otherDocumentTypeDescription') && formData.documentType === 'other' && !formData.otherDocumentTypeDescription.trim()) {
      newErrors.otherDocumentTypeDescription = 'Please describe the document you need.';
    }

    return newErrors;
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'documentType', 'additionalInsuredStatus', 'certificateHolderName', 'certificateHolderEmail', 'certificateHolderAddress'];
    const validationErrors = validateFields(requiredFields);

    if (formData.documentType === 'other' && !formData.otherDocumentTypeDescription.trim()) {
      validationErrors.otherDocumentTypeDescription = 'Please describe the document you need.';
    }

    return validationErrors;
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
        documentType: 'coi-acord25',
        otherDocumentTypeDescription: '',
        coveragesToShow: [],
        operationsDescription: '',
        additionalInsuredStatus: '',
        additionalEndorsements: [],
        certificateHolderName: '',
        certificateHolderEmail: '',
        certificateHolderAddress: '',
        deadlineInstructions: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationErrors = validateFields(stepFields[stepIndex] || []);

    if (stepIndex === 1 && formData.documentType === 'other' && !formData.otherDocumentTypeDescription.trim()) {
      validationErrors.otherDocumentTypeDescription = 'Please describe the document you need.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const getOptionLabel = (options, value) => options.find((option) => option.value === value)?.label || '-';

  const getMultiOptionLabels = (options, values) => {
    if (!values.length) {
      return '-';
    }

    const optionMap = new Map(options.map((option) => [option.value, option.label]));
    return values.map((value) => optionMap.get(value) || value).join(', ');
  };

  return (
    <RequestModal
      badge="Documents"
      title="Request Proof of Insurance or Other Documents"
      description="Use this form to request a Certificate of Insurance (COI), Evidence of Insurance, ACORD forms, or other policy
documents."
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
              <div className="mb-4 border-b border-[#b9d0ef] pb-2">
                <h4 className="text-lg font-semibold text-[#2d78bf]">Section A - Your Information</h4>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup label="Name of insured" htmlFor="documents-fullName" required error={errors.fullName} hint="As it appears on your policy">
                <input
                  id="documents-fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="As it appears on your policy"
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
                  placeholder="your@email.com"
                  className={getFieldClass('email')}
                  disabled={loading}
                />
              </FieldGroup>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-5">
              <div className="border-b border-[#b9d0ef] pb-2">
                <h4 className="text-lg font-semibold text-[#2d78bf]">Section B - Document Requested</h4>
              </div>
              <FieldGroup label="Document type" htmlFor="documents-documentType" required error={errors.documentType}>
                <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {documentTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm text-[#010407] transition-colors hover:bg-[#F7F4EF]"
                    >
                      <input
                        type="radio"
                        name="documentType"
                        value={option.value}
                        checked={formData.documentType === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              {formData.documentType === 'other' && (
                <FieldGroup label='If you selected "Other" above, please describe:' htmlFor="documents-otherDocumentTypeDescription" required error={errors.otherDocumentTypeDescription}>
                  <textarea
                    id="documents-otherDocumentTypeDescription"
                    name="otherDocumentTypeDescription"
                    rows="3"
                    value={formData.otherDocumentTypeDescription}
                    onChange={handleChange}
                    placeholder="Describe the document you need..."
                    className={`${getFieldClass('otherDocumentTypeDescription')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Coverages to show on the certificate" htmlFor="documents-coveragesToShow" hint="Check all that apply">
                  <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                    {coverageOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm text-[#010407] transition-colors hover:bg-[#F7F4EF]"
                      >
                        <input
                          type="checkbox"
                          name="coveragesToShow"
                          value={option.value}
                          checked={formData.coveragesToShow.includes(option.value)}
                          onChange={handleCheckboxChange}
                          className="mt-1 h-4 w-4 rounded border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                          disabled={loading}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label="Description of operations / locations / vehicles" htmlFor="documents-operationsDescription" hint="Exact wording required if any">
                  <textarea
                    id="documents-operationsDescription"
                    name="operationsDescription"
                    rows="5"
                    value={formData.operationsDescription}
                    onChange={handleChange}
                    placeholder="Paste any specific wording the certificate holder has provided. We will copy it exactly into the Description of
Operations box on the certificate."
                    className={`${getFieldClass('operationsDescription')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-5">
              <div className="border-b border-[#b9d0ef] pb-2">
                <h4 className="text-lg font-semibold text-[#2d78bf]">Section C - Special Requirements & Certificate Holder Details</h4>
              </div>

              <FieldGroup label="Does the certificate holder require additional insured (AI) status?" htmlFor="documents-additionalInsuredStatus" required error={errors.additionalInsuredStatus}>
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {[
                    { value: 'yes', label: 'Yes - they need to be added as an Additional Insured on my GL / Auto policy' },
                    { value: 'no', label: 'No - standard proof of insurance is sufficient' },
                    { value: 'not-sure', label: 'I am not sure' },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="radio"
                        name="additionalInsuredStatus"
                        value={option.value}
                        checked={formData.additionalInsuredStatus === option.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label="Additional endorsements requested" htmlFor="documents-additionalEndorsements" hint="Check all that apply">
                <div className="grid gap-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {endorsementOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#F7F4EF]">
                      <input
                        type="checkbox"
                        name="additionalEndorsements"
                        value={option.value}
                        checked={formData.additionalEndorsements.includes(option.value)}
                        onChange={handleCheckboxChange}
                        className="mt-1 h-4 w-4 rounded border-[#b8c7dc] text-[#2d78bf] focus:ring-[#2d78bf]"
                        disabled={loading}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </FieldGroup>

              <p className="text-sm italic text-[#010407]/70">
                The party requesting proof of your insurance - e.g. your landlord, general contractor, or lender.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Certificate holder name" htmlFor="documents-certificateHolderName" required error={errors.certificateHolderName}>
                  <input
                    id="documents-certificateHolderName"
                    name="certificateHolderName"
                    type="text"
                    value={formData.certificateHolderName}
                    onChange={handleChange}
                    placeholder="Company or person name"
                    className={getFieldClass('certificateHolderName')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Their email address (if sending directly)" htmlFor="documents-certificateHolderEmail" required error={errors.certificateHolderEmail}>
                  <input
                    id="documents-certificateHolderEmail"
                    name="certificateHolderEmail"
                    type="email"
                    value={formData.certificateHolderEmail}
                    onChange={handleChange}
                    placeholder="holder@company.com"
                    className={getFieldClass('certificateHolderEmail')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Full mailing address" htmlFor="documents-certificateHolderAddress" required error={errors.certificateHolderAddress}>
                  <input
                    id="documents-certificateHolderAddress"
                    name="certificateHolderAddress"
                    type="text"
                    value={formData.certificateHolderAddress}
                    onChange={handleChange}
                    placeholder="Street, City, State, ZIP"
                    className={getFieldClass('certificateHolderAddress')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Deadline or special instructions" htmlFor="documents-deadlineInstructions">
                  <textarea
                    id="documents-deadlineInstructions"
                    name="deadlineInstructions"
                    rows="4"
                    value={formData.deadlineInstructions}
                    onChange={handleChange}
                    placeholder="Project name, urgency, preferred delivery method, etc."
                    className={`${getFieldClass('deadlineInstructions')} resize-none`}
                    disabled={loading}
                  />
                </FieldGroup>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <strong>Note:</strong> We can only include coverages that actually exist on your active policy. If an endorsement is needed first, we will contact you before issuing the certificate.
              </div>
            </div>
          )}

          {stepIndex === 3 && (
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
                  <span className="font-semibold">Document type:</span> {getOptionLabel(documentTypeOptions, formData.documentType)}
                </p>
                <p>
                  <span className="font-semibold">AI status:</span> {additionalInsuredStatusLabelMap[formData.additionalInsuredStatus] || '-'}
                </p>
                <p>
                  <span className="font-semibold">Certificate holder:</span> {formData.certificateHolderName || '-'}
                </p>
                <p>
                  <span className="font-semibold">Holder email:</span> {formData.certificateHolderEmail || '-'}
                </p>
              </div>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Coverages:</span> {getMultiOptionLabels(coverageOptions, formData.coveragesToShow)}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Additional endorsements:</span> {getMultiOptionLabels(endorsementOptions, formData.additionalEndorsements)}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Operations / locations / vehicles:</span> {formData.operationsDescription || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Holder address:</span> {formData.certificateHolderAddress || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Special instructions:</span> {formData.deadlineInstructions || '-'}
              </p>
            </div>
          )}
        </RequestFormWizard>

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

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:opacity-50 disabled:cursor-not-allowed"
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

export default DocumentRequestForm;