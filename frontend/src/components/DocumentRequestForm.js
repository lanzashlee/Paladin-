import React, { useEffect, useRef, useState } from 'react';
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

const stepFieldsById = {
  'your-information': ['fullName', 'email'],
  'document-requested': ['documentType'],
  'special-requirements': ['additionalInsuredStatus'],
  'review-submit': [],
};
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

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || '');
      const base64Data = raw.includes(',') ? raw.split(',')[1] : '';
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });

const documentTypeOptions = [
  { value: 'coi-acord25', label: 'Certificate of Liability Insurance' },
  { value: 'evidence-property-insurance-acord28', label: 'Evidence of Property Insurance' },
  { value: 'evidence-homeowners-acord27', label: 'Evidence of Commercial Property Insurance' },
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
  { value: 'other', label: 'Other' },
];

const endorsementOptions = [
  { value: 'waiver-subrogation', label: 'Waiver of Subrogation' },
  { value: 'pnc', label: 'Primary & Non-Contributory (P&NC)' },
  { value: 'hnoa', label: 'Hired & Non-Owned Auto (HNOA)' },
];

const additionalInsuredStatusLabelMap = {
  yes: 'Yes - they need to be added as an Additional Insured on my GL / Auto policy',
  no: 'No - standard certificate of insurance is sufficient',
  'not-sure': 'I am not sure',
};

function DocumentRequestForm({ onClose }) {
  const [coiAttachments, setCoiAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    formType: 'document-request',
    fullName: '',
    email: '',
    documentType: 'coi-acord25',
    coiAttachmentNames: [],
    otherDocumentTypeDescription: '',
    coveragesToShow: [],
    coveragesOtherDescription: '',
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
  const requiresSpecialRequirementsStep = [
    'coi-acord25',
    'evidence-property-insurance-acord28',
    'evidence-homeowners-acord27',
  ].includes(formData.documentType);
  const shouldShowAttachmentField = requiresSpecialRequirementsStep;
  const activeWizardSteps = requiresSpecialRequirementsStep
    ? wizardSteps
    : wizardSteps.filter((step) => step.id !== 'special-requirements');
  const finalStepIndex = activeWizardSteps.length - 1;
  const currentStepId = activeWizardSteps[stepIndex]?.id;

  useEffect(() => {
    if (stepIndex > finalStepIndex) {
      setStepIndex(finalStepIndex);
    }
  }, [finalStepIndex, stepIndex]);

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

    if (fields.includes('email') && formData.email.trim() && !isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (fields.includes('certificateHolderEmail') && formData.certificateHolderEmail.trim() && !isValidEmailFormat(formData.certificateHolderEmail)) {
      newErrors.certificateHolderEmail = 'Please enter a valid email address.';
    }

    return newErrors;
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'documentType'];
    if (requiresSpecialRequirementsStep) {
      requiredFields.push('additionalInsuredStatus');
    }
    const validationErrors = validateFields(requiredFields);

    if (formData.documentType === 'other' && !formData.otherDocumentTypeDescription.trim()) {
      validationErrors.otherDocumentTypeDescription = 'Please describe the document you need.';
    }

    if (formData.certificateHolderEmail.trim() && !isValidEmailFormat(formData.certificateHolderEmail)) {
      validationErrors.certificateHolderEmail = 'Please enter a valid email address.';
    }

    if (formData.coveragesToShow.includes('other') && !formData.coveragesOtherDescription.trim()) {
      validationErrors.coveragesOtherDescription = 'Please specify the other coverage to show.';
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
      ...(name === 'documentType' && ![
        'coi-acord25',
        'evidence-property-insurance-acord28',
        'evidence-homeowners-acord27',
      ].includes(value) ? { coiAttachmentNames: [] } : {}),
    }));

    if (name === 'documentType' && ![
      'coi-acord25',
      'evidence-property-insurance-acord28',
      'evidence-homeowners-acord27',
    ].includes(value)) {
      setCoiAttachments([]);
    }

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setSaved(false);
    setSubmitError(null);

    if (!selectedFiles.length) {
      return;
    }

    try {
      const nextAttachments = await Promise.all(
        selectedFiles.map(async (file) => ({
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          dataBase64: await fileToBase64(file),
        }))
      );

      setCoiAttachments((current) => [...current, ...nextAttachments]);
      setFormData((current) => ({
        ...current,
        coiAttachmentNames: [...(current.coiAttachmentNames || []), ...nextAttachments.map((attachment) => attachment.filename)],
      }));
    } catch (error) {
      setSubmitError(error.message || 'Unable to read the selected file. Please try again.');
    } finally {
      event.target.value = '';
    }
  };

  const handleAddAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveAttachment = (attachmentIndex) => {
    setSaved(false);
    setSubmitError(null);
    setCoiAttachments((current) => current.filter((_, index) => index !== attachmentIndex));
    setFormData((current) => ({
      ...current,
      coiAttachmentNames: (current.coiAttachmentNames || []).filter((_, index) => index !== attachmentIndex),
    }));
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
        ...(name === 'coveragesToShow' && !nextValues.includes('other')
          ? { coveragesOtherDescription: '' }
          : {}),
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
      const payload = {
        ...formData,
        ...(coiAttachments.length > 0
          ? {
              coiAttachments,
              coiAttachment: coiAttachments[0],
            }
          : {}),
      };

      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const serverError = typeof errorPayload.error === 'string' ? errorPayload.error : '';

        if (response.status === 413) {
          throw new Error('Attachments are too large. Please upload smaller files and try again.');
        }

        throw new Error(serverError || 'Failed to submit form');
      }

      setSaved(true);
      setFormData({
        formType: 'document-request',
        fullName: '',
        email: '',
        documentType: 'coi-acord25',
        coiAttachmentNames: [],
        otherDocumentTypeDescription: '',
        coveragesToShow: [],
        coveragesOtherDescription: '',
        operationsDescription: '',
        additionalInsuredStatus: '',
        additionalEndorsements: [],
        certificateHolderName: '',
        certificateHolderEmail: '',
        certificateHolderAddress: '',
        deadlineInstructions: '',
      });
      setCoiAttachments([]);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationErrors = validateFields(stepFieldsById[currentStepId] || []);

    if (currentStepId === 'document-requested' && formData.documentType === 'other' && !formData.otherDocumentTypeDescription.trim()) {
      validationErrors.otherDocumentTypeDescription = 'Please describe the document you need.';
    }

    if (currentStepId === 'document-requested' && formData.coveragesToShow.includes('other') && !formData.coveragesOtherDescription.trim()) {
      validationErrors.coveragesOtherDescription = 'Please specify the other coverage to show.';
    }

    if (
      currentStepId === 'special-requirements' &&
      formData.certificateHolderEmail.trim() &&
      !isValidEmailFormat(formData.certificateHolderEmail)
    ) {
      validationErrors.certificateHolderEmail = 'Please enter a valid email address.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors((current) => ({ ...current, ...validationErrors }));
      return;
    }

    setStepIndex((current) => {
      return Math.min(current + 1, finalStepIndex);
    });
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
      title="Request Certificate of Insurance or Other Documents"
      description="Use this form to request a Certificate of Insurance (COI), Evidence of Insurance, ACORD forms, or other policy
documents."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()} noValidate>
        <RequestFormWizard
          steps={activeWizardSteps}
          activeStep={stepIndex}
          onStepChange={(nextIndex) => {
            if (nextIndex <= stepIndex) {
              setStepIndex(nextIndex);
            }
          }}
        >
          {currentStepId === 'your-information' && (
            <div>
              <div className="mb-4 border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section A - Your Information</h4>
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
                  pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}"
                  className={getFieldClass('email')}
                  disabled={loading}
                />
              </FieldGroup>
              </div>
            </div>
          )}

          {currentStepId === 'document-requested' && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section B - Document Requested</h4>
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
                <div className="space-y-5">
                  <FieldGroup label="Coverages to show on the Certificate of Liability Insurance" htmlFor="documents-coveragesToShow" hint="Check all that apply">
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

                </div>

                <div className="space-y-5">
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

                  {formData.coveragesToShow.includes('other') && (
                    <FieldGroup
                      label='If you selected "Other" above, please specify:'
                      htmlFor="documents-coveragesOtherDescription"
                      required
                      error={errors.coveragesOtherDescription}
                    >
                      <input
                        id="documents-coveragesOtherDescription"
                        name="coveragesOtherDescription"
                        type="text"
                        value={formData.coveragesOtherDescription}
                        onChange={handleChange}
                        placeholder="Enter the other coverage"
                        className={getFieldClass('coveragesOtherDescription')}
                        disabled={loading}
                      />
                    </FieldGroup>
                  )}
                </div>
              </div>

              {shouldShowAttachmentField && (
                <FieldGroup
                  label="Attach necessary documents (Sample COI, Contract, etc.)"
                >
                  <input
                    ref={fileInputRef}
                    id="documents-coiAttachment"
                    name="coiAttachment"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachmentClick}
                    disabled={loading}
                    className="inline-flex items-center justify-start self-start rounded-full border border-[#d8cbb8] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add file
                  </button>
                  {formData.coiAttachmentNames.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.coiAttachmentNames.map((attachmentName, index) => (
                        <div
                          key={`${attachmentName}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#d8cbb8] bg-[#F7F4EF]/60 px-3 py-2 text-xs text-[#012E72]"
                        >
                          <span className="truncate">Selected file: {attachmentName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            disabled={loading}
                            className="rounded-full border border-[#d8cbb8] bg-white px-2 py-1 text-[11px] font-semibold text-[#012E72] hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldGroup>
              )}
            </div>
          )}

          {currentStepId === 'special-requirements' && (
            <div className="space-y-5">
              <div className="border-b border-[#1e4f97] pb-2">
                <h4 className="text-lg font-semibold text-[#012E72]">Section C - Special Requirements & Certificate Holder Details</h4>
              </div>

              <FieldGroup label="Does the certificate holder require additional insured (AI) status?" htmlFor="documents-additionalInsuredStatus" required error={errors.additionalInsuredStatus}>
                <div className="space-y-2 rounded-2xl border border-[#d8cbb8] bg-white p-4">
                  {[
                    { value: 'yes', label: 'Yes - they need to be added as an Additional Insured on my GL / Auto policy' },
                    { value: 'no', label: 'No - standard certificate of insurance is sufficient' },
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
                The party requesting certificate of your insurance - e.g. your landlord, general contractor, or lender.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Certificate Holder Name (optional)" htmlFor="documents-certificateHolderName" error={errors.certificateHolderName}>
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

                <FieldGroup label="Email Address (optional)" htmlFor="documents-certificateHolderEmail" error={errors.certificateHolderEmail}>
                  <input
                    id="documents-certificateHolderEmail"
                    name="certificateHolderEmail"
                    type="email"
                    value={formData.certificateHolderEmail}
                    onChange={handleChange}
                    placeholder="holder@company.com"
                    pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}"
                    className={getFieldClass('certificateHolderEmail')}
                    disabled={loading}
                  />
                </FieldGroup>

                <FieldGroup label="Full Address (optional)" htmlFor="documents-certificateHolderAddress" error={errors.certificateHolderAddress}>
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

          {currentStepId === 'review-submit' && (
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
                {requiresSpecialRequirementsStep && (
                  <p>
                    <span className="font-semibold">AI status:</span> {additionalInsuredStatusLabelMap[formData.additionalInsuredStatus] || '-'}
                  </p>
                )}
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
              {formData.coveragesToShow.includes('other') && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Other coverage:</span> {formData.coveragesOtherDescription || '-'}
                </p>
              )}
              {requiresSpecialRequirementsStep && (
                <p className="text-sm text-[#010407]/80">
                  <span className="font-semibold">Additional endorsements:</span> {getMultiOptionLabels(endorsementOptions, formData.additionalEndorsements)}
                </p>
              )}
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Operations / locations / vehicles:</span> {formData.operationsDescription || '-'}
              </p>
              <p className="text-sm text-[#010407]/80">
                <span className="font-semibold">Attached files:</span> {formData.coiAttachmentNames.length ? formData.coiAttachmentNames.join(', ') : '-'}
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

            {stepIndex < finalStepIndex ? (
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