import React, { useEffect, useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const STATE_OPTIONS = [
  { value: '', label: 'Select state' },
  { value: 'CA', label: 'CA' },
  { value: 'AZ', label: 'AZ' },
  { value: 'NV', label: 'NV' },
  { value: 'OR', label: 'OR' },
  { value: 'WA', label: 'WA' },
  { value: 'TX', label: 'TX' },
  { value: 'other', label: 'Other' },
];

const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'Select legal entity' },
  { value: 'sole-proprietor', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'LLC' },
  { value: 's-corp', label: 'S-Corp' },
  { value: 'c-corp', label: 'C-Corp' },
  { value: 'non-profit', label: 'Non-Profit' },
];

const EMPLOYERS_LIABILITY_OPTIONS = [
  { value: '', label: 'Select employers liability limit' },
  { value: '100k-100k-100k', label: '$100K / $100K / $100K' },
  { value: '500k-500k-500k', label: '$500K / $500K / $500K' },
  { value: '1m-1m-1m', label: '$1M / $1M / $1M' },
];

const CLAIM_STATUS_OPTIONS = [
  { value: '', label: 'Select claim status' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

const initialClassification = {
  ncciClassCode: '',
  jobTitleDutyDescription: '',
  numberOfEmployees: '',
  estimatedAnnualPayroll: '',
};

const initialClaim = {
  year: '',
  numberOfClaims: '',
  totalIncurred: '',
  openClosed: '',
};

const initialForm = {
  legalBusinessName: '',
  fein: '',
  stateOfPrimaryOperations: '',
  additionalStatesOfOperation: '',
  businessStreetAddress: '',
  businessUnitNumber: '',
  businessCity: '',
  businessState: '',
  businessZip: '',
  businessAddress: '',
  yearsInBusiness: '',
  typeOfLegalEntity: '',
  officerOwnerExclusionRequest: '',
  excludedOfficersNames: '',
  numberOfEmployeesFullTime: '',
  numberOfEmployeesPartTime: '',
  totalEstimatedAnnualPayroll: '',
  primaryBusinessActivityOperations: '',
  workPerformedAtHeights: '',
  workPerformedInTrenches: '',
  roofingWorkPerformed: '',
  workPerformedOnLadders: '',
  ladderMaxHeight: '',
  workWithExplosivesHazardousMaterials: '',
  hazardousMaterialsDescription: '',
  workPerformedOutsideCalifornia: '',
  outsideCaliforniaStates: '',
  seasonalFluctuationsInEmployment: '',
  seasonalPayrollEstimate: '',
  useOfSubcontractors: '',
  subcontractorAnnualPayrollCost: '',
  experienceModificationRate: '',
  priorWcCarrier: '',
  priorWcPolicyExpirationDate: '',
  anyOpenOngoingClaims: '',
  openOngoingClaimsDescription: '',
  priorDeclinationsOrNonRenewalsForWc: '',
  priorDeclinationsReason: '',
  workersCompensationStatutory: '',
  employersLiabilityLimit: '',
  effectiveDate: '',
  stateFundReferral: '',
};

const requiredFields = [
  'legalBusinessName',
  'fein',
  'stateOfPrimaryOperations',
  'businessStreetAddress',
  'businessCity',
  'businessState',
  'businessZip',
  'yearsInBusiness',
  'typeOfLegalEntity',
  'numberOfEmployeesFullTime',
  'numberOfEmployeesPartTime',
  'totalEstimatedAnnualPayroll',
  'primaryBusinessActivityOperations',
  'workPerformedAtHeights',
  'workPerformedInTrenches',
  'roofingWorkPerformed',
  'workWithExplosivesHazardousMaterials',
  'useOfSubcontractors',
  'priorWcCarrier',
  'priorWcPolicyExpirationDate',
  'anyOpenOngoingClaims',
  'priorDeclinationsOrNonRenewalsForWc',
  'workersCompensationStatutory',
  'employersLiabilityLimit',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';
const isDigitsOnly = (value) => /^\d+$/.test(String(value ?? '').trim());
const isFourDigitYear = (value) => /^\d{4}$/.test(String(value ?? '').trim());

const formatZipCode = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const buildAddressSummary = ({ streetAddress, unitNumber, city, state, zip }) => (
  [streetAddress, unitNumber, city, state, zip]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(', ')
);

const formatEin = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
};

const formatCurrencyInput = (rawValue) => {
  const sanitized = String(rawValue ?? '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '');

  if (!sanitized) {
    return '';
  }

  const hasDecimal = sanitized.includes('.');
  const [wholeRaw = '', ...decimalParts] = sanitized.split('.');
  const decimalRaw = decimalParts.join('').slice(0, 2);
  const wholeNormalized = wholeRaw.replace(/^0+(?=\d)/, '');
  const wholePart = wholeNormalized || (hasDecimal ? '0' : '');
  const wholeFormatted = wholePart
    ? wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';

  if (!hasDecimal) {
    return wholeFormatted;
  }

  return `${wholeFormatted || '0'}.${decimalRaw}`;
};

function WorkersCompForm({ onBack, onFormChange, onValidityChange, onPreviewRequest }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [classifications, setClassifications] = useState([{ ...initialClassification }]);
  const [wcClaims, setWcClaims] = useState([{ ...initialClaim }]);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (nextForm, nextClassifications, nextClaims) => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    if (!isBlank(nextForm.fein) && !/^\d{2}-\d{7}$/.test(nextForm.fein)) {
      nextErrors.fein = 'Use FEIN format XX-XXXXXXX.';
    }

    if (!isBlank(nextForm.businessZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.businessZip)) {
      nextErrors.businessZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (!isBlank(nextForm.yearsInBusiness) && !isDigitsOnly(nextForm.yearsInBusiness)) {
      nextErrors.yearsInBusiness = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.numberOfEmployeesFullTime) && !isDigitsOnly(nextForm.numberOfEmployeesFullTime)) {
      nextErrors.numberOfEmployeesFullTime = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.numberOfEmployeesPartTime) && !isDigitsOnly(nextForm.numberOfEmployeesPartTime)) {
      nextErrors.numberOfEmployeesPartTime = 'Enter numbers only.';
    }

    if (nextForm.officerOwnerExclusionRequest === 'yes' && isBlank(nextForm.excludedOfficersNames)) {
      nextErrors.excludedOfficersNames = REQUIRED_MESSAGE;
    }

    if (nextForm.workPerformedOnLadders === 'yes' && isBlank(nextForm.ladderMaxHeight)) {
      nextErrors.ladderMaxHeight = REQUIRED_MESSAGE;
    }

    if (nextForm.workWithExplosivesHazardousMaterials === 'yes' && isBlank(nextForm.hazardousMaterialsDescription)) {
      nextErrors.hazardousMaterialsDescription = REQUIRED_MESSAGE;
    }

    if (nextForm.workPerformedOutsideCalifornia === 'yes' && isBlank(nextForm.outsideCaliforniaStates)) {
      nextErrors.outsideCaliforniaStates = REQUIRED_MESSAGE;
    }

    if (nextForm.seasonalFluctuationsInEmployment === 'yes' && isBlank(nextForm.seasonalPayrollEstimate)) {
      nextErrors.seasonalPayrollEstimate = REQUIRED_MESSAGE;
    }

    if (nextForm.useOfSubcontractors === 'yes' && isBlank(nextForm.subcontractorAnnualPayrollCost)) {
      nextErrors.subcontractorAnnualPayrollCost = REQUIRED_MESSAGE;
    }

    if (nextForm.anyOpenOngoingClaims === 'yes' && isBlank(nextForm.openOngoingClaimsDescription)) {
      nextErrors.openOngoingClaimsDescription = REQUIRED_MESSAGE;
    }

    if (nextForm.priorDeclinationsOrNonRenewalsForWc === 'yes' && isBlank(nextForm.priorDeclinationsReason)) {
      nextErrors.priorDeclinationsReason = REQUIRED_MESSAGE;
    }

    const hasRequiredClassData = !isBlank(nextClassifications[0].jobTitleDutyDescription)
      || !isBlank(nextClassifications[0].numberOfEmployees)
      || !isBlank(nextClassifications[0].estimatedAnnualPayroll);

    if (!hasRequiredClassData) {
      nextErrors.classification0 = 'At least one classification entry is required.';
    }

    nextClassifications.forEach((row, index) => {
      const hasAny = !isBlank(row.ncciClassCode)
        || !isBlank(row.jobTitleDutyDescription)
        || !isBlank(row.numberOfEmployees)
        || !isBlank(row.estimatedAnnualPayroll);
      const hasAll = !isBlank(row.jobTitleDutyDescription)
        && !isBlank(row.numberOfEmployees)
        && !isBlank(row.estimatedAnnualPayroll);
      if (hasAny && !hasAll) {
        nextErrors[`classification${index}`] = 'Complete job title, employees, and payroll for this classification row.';
      }

      if (!isBlank(row.ncciClassCode) && !isFourDigitYear(row.ncciClassCode)) {
        nextErrors[`classification${index}`] = 'NCCI class code must be exactly 4 digits.';
      }

      if (!isBlank(row.numberOfEmployees) && !isDigitsOnly(row.numberOfEmployees)) {
        nextErrors[`classification${index}`] = 'Number of employees must be numeric.';
      }
    });

    const hasRequiredClaimData = !isBlank(nextClaims[0].year)
      || !isBlank(nextClaims[0].numberOfClaims)
      || !isBlank(nextClaims[0].totalIncurred)
      || !isBlank(nextClaims[0].openClosed);

    if (!hasRequiredClaimData) {
      nextErrors.claim0 = 'At least one WC claim history row is required.';
    }

    nextClaims.forEach((row, index) => {
      const hasAny = !isBlank(row.year)
        || !isBlank(row.numberOfClaims)
        || !isBlank(row.totalIncurred)
        || !isBlank(row.openClosed);
      const hasAll = !isBlank(row.year)
        && !isBlank(row.numberOfClaims)
        && !isBlank(row.totalIncurred)
        && !isBlank(row.openClosed);
      if (hasAny && !hasAll) {
        nextErrors[`claim${index}`] = 'Complete year, claims count, total incurred, and status for this row.';
      }

      if (!isBlank(row.year) && !isFourDigitYear(row.year)) {
        nextErrors[`claim${index}`] = 'Year must be a valid 4-digit year.';
      }

      if (!isBlank(row.numberOfClaims) && !isDigitsOnly(row.numberOfClaims)) {
        nextErrors[`claim${index}`] = 'Number of claims must be numeric.';
      }
    });

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [
      ...requiredFields,
      'excludedOfficersNames',
      'ladderMaxHeight',
      'hazardousMaterialsDescription',
      'outsideCaliforniaStates',
      'seasonalPayrollEstimate',
      'subcontractorAnnualPayrollCost',
      'openOngoingClaimsDescription',
      'priorDeclinationsReason',
      'classification0',
      'claim0',
    ];

    const firstErrorKey = orderedKeys.find((key) => nextErrors[key]);
    if (!firstErrorKey) {
      return;
    }

    requestAnimationFrame(() => {
      if (firstErrorKey.startsWith('classification')) {
        const node = formRef.current?.querySelector('[name="classificationJobTitle0"]');
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.focus({ preventScroll: true });
        }
        return;
      }

      if (firstErrorKey.startsWith('claim')) {
        const node = formRef.current?.querySelector('[name="wcClaimYear0"]');
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.focus({ preventScroll: true });
        }
        return;
      }

      const node = formRef.current?.querySelector(`[name="${firstErrorKey}"]`);
      if (!node) {
        return;
      }
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.focus({ preventScroll: true });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let normalizedValue = value;

    if (name === 'fein') {
      normalizedValue = formatEin(value);
    }

    if (name === 'businessZip') {
      normalizedValue = formatZipCode(value);
    }

    if ([
      'totalEstimatedAnnualPayroll',
      'subcontractorAnnualPayrollCost',
      'seasonalPayrollEstimate',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    }

    if ([
      'yearsInBusiness',
      'numberOfEmployeesFullTime',
      'numberOfEmployeesPartTime',
    ].includes(name)) {
      normalizedValue = String(value ?? '').replace(/\D/g, '');
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'officerOwnerExclusionRequest' && value !== 'yes') {
      nextForm.excludedOfficersNames = '';
    }

    if (name === 'workPerformedOnLadders' && value !== 'yes') {
      nextForm.ladderMaxHeight = '';
    }

    if (name === 'workWithExplosivesHazardousMaterials' && value !== 'yes') {
      nextForm.hazardousMaterialsDescription = '';
    }

    if (name === 'workPerformedOutsideCalifornia' && value !== 'yes') {
      nextForm.outsideCaliforniaStates = '';
    }

    if (name === 'seasonalFluctuationsInEmployment' && value !== 'yes') {
      nextForm.seasonalPayrollEstimate = '';
    }

    if (name === 'useOfSubcontractors' && value !== 'yes') {
      nextForm.subcontractorAnnualPayrollCost = '';
    }

    if (name === 'anyOpenOngoingClaims' && value !== 'yes') {
      nextForm.openOngoingClaimsDescription = '';
    }

    if (name === 'priorDeclinationsOrNonRenewalsForWc' && value !== 'yes') {
      nextForm.priorDeclinationsReason = '';
    }

    if ([
      'businessStreetAddress',
      'businessUnitNumber',
      'businessCity',
      'businessState',
      'businessZip',
    ].includes(name)) {
      nextForm.businessAddress = buildAddressSummary({
        streetAddress: name === 'businessStreetAddress' ? normalizedValue : formData.businessStreetAddress,
        unitNumber: name === 'businessUnitNumber' ? normalizedValue : formData.businessUnitNumber,
        city: name === 'businessCity' ? normalizedValue : formData.businessCity,
        state: name === 'businessState' ? normalizedValue : formData.businessState,
        zip: name === 'businessZip' ? normalizedValue : formData.businessZip,
      });
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, classifications, wcClaims));
    }
  };

  const updateClassification = (index, field, value) => {
    let normalized = value;

    if (field === 'estimatedAnnualPayroll') {
      normalized = formatCurrencyInput(value);
    }

    if (field === 'ncciClassCode') {
      normalized = String(value ?? '').replace(/\D/g, '').slice(0, 4);
    }

    if (field === 'numberOfEmployees') {
      normalized = String(value ?? '').replace(/\D/g, '');
    }

    const nextRows = classifications.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));

    setClassifications(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, nextRows, wcClaims));
    }
  };

  const addClassification = () => {
    const nextRows = [...classifications, { ...initialClassification }];
    setClassifications(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, nextRows, wcClaims));
    }
  };

  const removeClassification = (index) => {
    if (classifications.length <= 1) {
      return;
    }

    const nextRows = classifications.filter((_, rowIndex) => rowIndex !== index);
    setClassifications(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, nextRows, wcClaims));
    }
  };

  const updateClaim = (index, field, value) => {
    let normalized = value;

    if (field === 'totalIncurred') {
      normalized = formatCurrencyInput(value);
    }

    if (field === 'year') {
      normalized = String(value ?? '').replace(/\D/g, '').slice(0, 4);
    }

    if (field === 'numberOfClaims') {
      normalized = String(value ?? '').replace(/\D/g, '');
    }

    const nextRows = wcClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));

    setWcClaims(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, classifications, nextRows));
    }
  };

  const addClaim = () => {
    const nextRows = [...wcClaims, { ...initialClaim }];
    setWcClaims(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, classifications, nextRows));
    }
  };

  const removeClaim = (index) => {
    if (wcClaims.length <= 1) {
      return;
    }

    const nextRows = wcClaims.filter((_, rowIndex) => rowIndex !== index);
    setWcClaims(nextRows);
    if (hasSubmitted) {
      setErrors(validate(formData, classifications, nextRows));
    }
  };

  const handleValidate = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData, classifications, wcClaims);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    if (typeof onPreviewRequest === 'function') {
      onPreviewRequest();
    }
  };

  const fieldError = (name) => errors[name];

  useEffect(() => {
    if (typeof onFormChange === 'function') {
      onFormChange({
        ...formData,
        classifications,
        wcClaims,
      });
    }
    if (typeof onValidityChange === 'function') {
      onValidityChange(Object.keys(validate(formData, classifications, wcClaims)).length === 0);
    }
  }, [formData, classifications, wcClaims, onFormChange, onValidityChange]);

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>Workers Compensation Insurance</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Payroll/classification data and WC claims history are core underwriting inputs.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Business and Payroll Details</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Legal Business Name (as registered with state) <span className="quote-request__required-mark">*</span></span>
            <input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleChange} className={fieldError('legalBusinessName') ? 'quote-request__input--invalid' : ''} />
            {fieldError('legalBusinessName') ? <span className="quote-request__validation-message">{fieldError('legalBusinessName')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">FEIN (Federal Employer Identification Number) <span className="quote-request__required-mark">*</span></span>
            <input name="fein" value={formData.fein} onChange={handleChange} placeholder="XX-XXXXXXX" className={fieldError('fein') ? 'quote-request__input--invalid' : ''} />
            {fieldError('fein') ? <span className="quote-request__validation-message">{fieldError('fein')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">State of Primary Operations <span className="quote-request__required-mark">*</span></span>
            <select name="stateOfPrimaryOperations" value={formData.stateOfPrimaryOperations} onChange={handleChange} className={fieldError('stateOfPrimaryOperations') ? 'quote-request__input--invalid' : ''}>
              {STATE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('stateOfPrimaryOperations') ? <span className="quote-request__validation-message">{fieldError('stateOfPrimaryOperations')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Additional States of Operation</span>
            <input name="additionalStatesOfOperation" value={formData.additionalStatesOfOperation} onChange={handleChange} placeholder="e.g., NV, AZ" />
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Business Street Address <span className="quote-request__required-mark">*</span></span>
            <input name="businessStreetAddress" value={formData.businessStreetAddress} onChange={handleChange} className={fieldError('businessStreetAddress') ? 'quote-request__input--invalid' : ''} />
            {fieldError('businessStreetAddress') ? <span className="quote-request__validation-message">{fieldError('businessStreetAddress')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business Unit Number</span>
            <input name="businessUnitNumber" value={formData.businessUnitNumber} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business City <span className="quote-request__required-mark">*</span></span>
            <input name="businessCity" value={formData.businessCity} onChange={handleChange} className={fieldError('businessCity') ? 'quote-request__input--invalid' : ''} />
            {fieldError('businessCity') ? <span className="quote-request__validation-message">{fieldError('businessCity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business State <span className="quote-request__required-mark">*</span></span>
            <input name="businessState" value={formData.businessState} onChange={handleChange} className={fieldError('businessState') ? 'quote-request__input--invalid' : ''} />
            {fieldError('businessState') ? <span className="quote-request__validation-message">{fieldError('businessState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business ZIP <span className="quote-request__required-mark">*</span></span>
            <input name="businessZip" value={formData.businessZip} onChange={handleChange} inputMode="numeric" maxLength={10} className={fieldError('businessZip') ? 'quote-request__input--invalid' : ''} />
            {fieldError('businessZip') ? <span className="quote-request__validation-message">{fieldError('businessZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Years in Business <span className="quote-request__required-mark">*</span></span>
            <input name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('yearsInBusiness') ? 'quote-request__input--invalid' : ''} />
            {fieldError('yearsInBusiness') ? <span className="quote-request__validation-message">{fieldError('yearsInBusiness')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Type of Legal Entity <span className="quote-request__required-mark">*</span></span>
            <select name="typeOfLegalEntity" value={formData.typeOfLegalEntity} onChange={handleChange} className={fieldError('typeOfLegalEntity') ? 'quote-request__input--invalid' : ''}>
              {ENTITY_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('typeOfLegalEntity') ? <span className="quote-request__validation-message">{fieldError('typeOfLegalEntity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Officer/Owner Exclusion Request?</span>
            <select name="officerOwnerExclusionRequest" value={formData.officerOwnerExclusionRequest} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.officerOwnerExclusionRequest === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Names of Excluded Officers <span className="quote-request__required-mark">*</span></span>
              <input name="excludedOfficersNames" value={formData.excludedOfficersNames} onChange={handleChange} className={fieldError('excludedOfficersNames') ? 'quote-request__input--invalid' : ''} />
              {fieldError('excludedOfficersNames') ? <span className="quote-request__validation-message">{fieldError('excludedOfficersNames')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Employees — Full Time <span className="quote-request__required-mark">*</span></span>
            <input name="numberOfEmployeesFullTime" value={formData.numberOfEmployeesFullTime} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('numberOfEmployeesFullTime') ? 'quote-request__input--invalid' : ''} />
            {fieldError('numberOfEmployeesFullTime') ? <span className="quote-request__validation-message">{fieldError('numberOfEmployeesFullTime')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Employees — Part Time <span className="quote-request__required-mark">*</span></span>
            <input name="numberOfEmployeesPartTime" value={formData.numberOfEmployeesPartTime} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('numberOfEmployeesPartTime') ? 'quote-request__input--invalid' : ''} />
            {fieldError('numberOfEmployeesPartTime') ? <span className="quote-request__validation-message">{fieldError('numberOfEmployeesPartTime')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Total Estimated Annual Payroll <span className="quote-request__required-mark">*</span></span>
            <input name="totalEstimatedAnnualPayroll" value={formData.totalEstimatedAnnualPayroll} onChange={handleChange} inputMode="decimal" placeholder="0.00" className={fieldError('totalEstimatedAnnualPayroll') ? 'quote-request__input--invalid' : ''} />
            {fieldError('totalEstimatedAnnualPayroll') ? <span className="quote-request__validation-message">{fieldError('totalEstimatedAnnualPayroll')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Primary Business Activity / Operations <span className="quote-request__required-mark">*</span></span>
            <textarea name="primaryBusinessActivityOperations" value={formData.primaryBusinessActivityOperations} onChange={handleChange} rows={7} className={fieldError('primaryBusinessActivityOperations') ? 'quote-request__input--invalid' : ''} />
            {fieldError('primaryBusinessActivityOperations') ? <span className="quote-request__validation-message">{fieldError('primaryBusinessActivityOperations')}</span> : null}
          </label>
        </div>

        <div className="quote-request__subsection" style={{ marginTop: 20 }}>
          <h5 className="quote-request__subsection-title" style={{ marginBottom: 12 }}>Employee Classifications <span className="quote-request__required-mark">*</span></h5>
          {classifications.map((row, index) => (
            <div className="quote-request__claim-row" key={`classification-${index}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">NCCI Class Code (if known)</span>
                <input
                  name={`classificationNcci${index}`}
                  value={row.ncciClassCode}
                  onChange={(event) => updateClassification(index, 'ncciClassCode', event.target.value)}
                  placeholder="4-digit code"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                />
              </label>
              <label className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Job Title / Duty Description <span className="quote-request__required-mark">*</span></span>
                <input
                  name={`classificationJobTitle${index}`}
                  value={row.jobTitleDutyDescription}
                  onChange={(event) => updateClassification(index, 'jobTitleDutyDescription', event.target.value)}
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Number of Employees in this Role <span className="quote-request__required-mark">*</span></span>
                <input
                  name={`classificationEmployees${index}`}
                  value={row.numberOfEmployees}
                  onChange={(event) => updateClassification(index, 'numberOfEmployees', event.target.value)}
                  inputMode="numeric"
                  pattern="\d+"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Estimated Annual Payroll <span className="quote-request__required-mark">*</span></span>
                <input
                  name={`classificationPayroll${index}`}
                  value={row.estimatedAnnualPayroll}
                  onChange={(event) => updateClassification(index, 'estimatedAnnualPayroll', event.target.value)}
                  inputMode="decimal"
                  pattern="[\d,.]+"
                  placeholder="0.00"
                />
              </label>

              {classifications.length > 1 ? (
                <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeClassification(index)}>
                  Remove Row
                </button>
              ) : null}
              {fieldError(`classification${index}`) ? <span className="quote-request__validation-message">{fieldError(`classification${index}`)}</span> : null}
            </div>
          ))}
          <button className="quote-request__inline-secondary" type="button" onClick={addClassification}>Add Another Classification</button>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Risk, Exposure, and Claims History</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed at Heights? (over 15 ft) <span className="quote-request__required-mark">*</span></span>
            <select name="workPerformedAtHeights" value={formData.workPerformedAtHeights} onChange={handleChange} className={fieldError('workPerformedAtHeights') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('workPerformedAtHeights') ? <span className="quote-request__validation-message">{fieldError('workPerformedAtHeights')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed in Trenches or Excavations? <span className="quote-request__required-mark">*</span></span>
            <select name="workPerformedInTrenches" value={formData.workPerformedInTrenches} onChange={handleChange} className={fieldError('workPerformedInTrenches') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('workPerformedInTrenches') ? <span className="quote-request__validation-message">{fieldError('workPerformedInTrenches')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Roofing Work Performed? <span className="quote-request__required-mark">*</span></span>
            <select name="roofingWorkPerformed" value={formData.roofingWorkPerformed} onChange={handleChange} className={fieldError('roofingWorkPerformed') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('roofingWorkPerformed') ? <span className="quote-request__validation-message">{fieldError('roofingWorkPerformed')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed on Ladders?</span>
            <select name="workPerformedOnLadders" value={formData.workPerformedOnLadders} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.workPerformedOnLadders === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Max Ladder Height <span className="quote-request__required-mark">*</span></span>
              <input name="ladderMaxHeight" value={formData.ladderMaxHeight} onChange={handleChange} className={fieldError('ladderMaxHeight') ? 'quote-request__input--invalid' : ''} />
              {fieldError('ladderMaxHeight') ? <span className="quote-request__validation-message">{fieldError('ladderMaxHeight')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work with Explosives or Hazardous Materials? <span className="quote-request__required-mark">*</span></span>
            <select name="workWithExplosivesHazardousMaterials" value={formData.workWithExplosivesHazardousMaterials} onChange={handleChange} className={fieldError('workWithExplosivesHazardousMaterials') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('workWithExplosivesHazardousMaterials') ? <span className="quote-request__validation-message">{fieldError('workWithExplosivesHazardousMaterials')}</span> : null}
          </label>

          {formData.workWithExplosivesHazardousMaterials === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Hazardous Materials Description <span className="quote-request__required-mark">*</span></span>
              <textarea name="hazardousMaterialsDescription" value={formData.hazardousMaterialsDescription} onChange={handleChange} rows={3} className={fieldError('hazardousMaterialsDescription') ? 'quote-request__input--invalid' : ''} />
              {fieldError('hazardousMaterialsDescription') ? <span className="quote-request__validation-message">{fieldError('hazardousMaterialsDescription')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed Outside California?</span>
            <select name="workPerformedOutsideCalifornia" value={formData.workPerformedOutsideCalifornia} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.workPerformedOutsideCalifornia === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">States of Operation <span className="quote-request__required-mark">*</span></span>
              <input name="outsideCaliforniaStates" value={formData.outsideCaliforniaStates} onChange={handleChange} className={fieldError('outsideCaliforniaStates') ? 'quote-request__input--invalid' : ''} />
              {fieldError('outsideCaliforniaStates') ? <span className="quote-request__validation-message">{fieldError('outsideCaliforniaStates')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Seasonal Fluctuations in Employment?</span>
            <select name="seasonalFluctuationsInEmployment" value={formData.seasonalFluctuationsInEmployment} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.seasonalFluctuationsInEmployment === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Seasonal Payroll Estimate <span className="quote-request__required-mark">*</span></span>
              <input name="seasonalPayrollEstimate" value={formData.seasonalPayrollEstimate} onChange={handleChange} inputMode="decimal" placeholder="0.00" className={fieldError('seasonalPayrollEstimate') ? 'quote-request__input--invalid' : ''} />
              {fieldError('seasonalPayrollEstimate') ? <span className="quote-request__validation-message">{fieldError('seasonalPayrollEstimate')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Use of Subcontractors? <span className="quote-request__required-mark">*</span></span>
            <select name="useOfSubcontractors" value={formData.useOfSubcontractors} onChange={handleChange} className={fieldError('useOfSubcontractors') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('useOfSubcontractors') ? <span className="quote-request__validation-message">{fieldError('useOfSubcontractors')}</span> : null}
          </label>

          {formData.useOfSubcontractors === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Subcontractor Annual Payroll / Cost <span className="quote-request__required-mark">*</span></span>
              <input name="subcontractorAnnualPayrollCost" value={formData.subcontractorAnnualPayrollCost} onChange={handleChange} inputMode="decimal" placeholder="0.00" className={fieldError('subcontractorAnnualPayrollCost') ? 'quote-request__input--invalid' : ''} />
              {fieldError('subcontractorAnnualPayrollCost') ? <span className="quote-request__validation-message">{fieldError('subcontractorAnnualPayrollCost')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Experience Modification Rate (EMR / X-Mod)</span>
            <input name="experienceModificationRate" value={formData.experienceModificationRate} onChange={handleChange} placeholder="e.g., 0.85" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Prior WC Carrier (most recent) <span className="quote-request__required-mark">*</span></span>
            <input name="priorWcCarrier" value={formData.priorWcCarrier} onChange={handleChange} className={fieldError('priorWcCarrier') ? 'quote-request__input--invalid' : ''} />
            {fieldError('priorWcCarrier') ? <span className="quote-request__validation-message">{fieldError('priorWcCarrier')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Prior WC Policy Expiration Date <span className="quote-request__required-mark">*</span></span>
            <input name="priorWcPolicyExpirationDate" type="date" value={formData.priorWcPolicyExpirationDate} onChange={handleChange} className={fieldError('priorWcPolicyExpirationDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('priorWcPolicyExpirationDate') ? <span className="quote-request__validation-message">{fieldError('priorWcPolicyExpirationDate')}</span> : null}
          </label>
        </div>

        <div className="quote-request__subsection" style={{ marginTop: 20 }}>
          <h5 className="quote-request__subsection-title" style={{ marginBottom: 12 }}>WC Claims - Past 3 Years <span className="quote-request__required-mark">*</span></h5>
          {wcClaims.map((row, index) => (
            <div className="quote-request__claim-row" key={`wc-claim-${index}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Year</span>
                <input
                  name={`wcClaimYear${index}`}
                  value={row.year}
                  onChange={(event) => updateClaim(index, 'year', event.target.value)}
                  placeholder="YYYY"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Number of Claims</span>
                <input
                  name={`wcClaimCount${index}`}
                  value={row.numberOfClaims}
                  onChange={(event) => updateClaim(index, 'numberOfClaims', event.target.value)}
                  inputMode="numeric"
                  pattern="\d+"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Total Incurred</span>
                <input
                  name={`wcClaimIncurred${index}`}
                  value={row.totalIncurred}
                  onChange={(event) => updateClaim(index, 'totalIncurred', event.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Status</span>
                <select
                  name={`wcClaimStatus${index}`}
                  value={row.openClosed}
                  onChange={(event) => updateClaim(index, 'openClosed', event.target.value)}
                >
                  {CLAIM_STATUS_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>

              {wcClaims.length > 1 ? (
                <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeClaim(index)}>
                  Remove Row
                </button>
              ) : null}
              {fieldError(`claim${index}`) ? <span className="quote-request__validation-message">{fieldError(`claim${index}`)}</span> : null}
            </div>
          ))}
          <button className="quote-request__inline-secondary" type="button" onClick={addClaim}>Add Another Claim Year</button>
        </div>

        <div className="quote-request__grid" style={{ marginTop: 20 }}>
          <label className="quote-request__field">
            <span className="quote-request__field-label">Any Open/Ongoing Claims? <span className="quote-request__required-mark">*</span></span>
            <select name="anyOpenOngoingClaims" value={formData.anyOpenOngoingClaims} onChange={handleChange} className={fieldError('anyOpenOngoingClaims') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('anyOpenOngoingClaims') ? <span className="quote-request__validation-message">{fieldError('anyOpenOngoingClaims')}</span> : null}
          </label>

          {formData.anyOpenOngoingClaims === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Open/Ongoing Claims Description <span className="quote-request__required-mark">*</span></span>
              <textarea name="openOngoingClaimsDescription" value={formData.openOngoingClaimsDescription} onChange={handleChange} rows={3} className={fieldError('openOngoingClaimsDescription') ? 'quote-request__input--invalid' : ''} />
              {fieldError('openOngoingClaimsDescription') ? <span className="quote-request__validation-message">{fieldError('openOngoingClaimsDescription')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Prior Declinations or Non-Renewals for WC? <span className="quote-request__required-mark">*</span></span>
            <select name="priorDeclinationsOrNonRenewalsForWc" value={formData.priorDeclinationsOrNonRenewalsForWc} onChange={handleChange} className={fieldError('priorDeclinationsOrNonRenewalsForWc') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('priorDeclinationsOrNonRenewalsForWc') ? <span className="quote-request__validation-message">{fieldError('priorDeclinationsOrNonRenewalsForWc')}</span> : null}
          </label>

          {formData.priorDeclinationsOrNonRenewalsForWc === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Declinations / Non-Renewals Reason <span className="quote-request__required-mark">*</span></span>
              <textarea name="priorDeclinationsReason" value={formData.priorDeclinationsReason} onChange={handleChange} rows={3} className={fieldError('priorDeclinationsReason') ? 'quote-request__input--invalid' : ''} />
              {fieldError('priorDeclinationsReason') ? <span className="quote-request__validation-message">{fieldError('priorDeclinationsReason')}</span> : null}
            </label>
          ) : null}
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage Selection</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Part 1 - Workers Compensation (Statutory)? <span className="quote-request__required-mark">*</span></span>
            <select name="workersCompensationStatutory" value={formData.workersCompensationStatutory} onChange={handleChange} className={fieldError('workersCompensationStatutory') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('workersCompensationStatutory') ? <span className="quote-request__validation-message">{fieldError('workersCompensationStatutory')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Part 2 - Employers Liability Limit <span className="quote-request__required-mark">*</span></span>
            <select name="employersLiabilityLimit" value={formData.employersLiabilityLimit} onChange={handleChange} className={fieldError('employersLiabilityLimit') ? 'quote-request__input--invalid' : ''}>
              {EMPLOYERS_LIABILITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('employersLiabilityLimit') ? <span className="quote-request__validation-message">{fieldError('employersLiabilityLimit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Effective Date <span className="quote-request__required-mark">*</span></span>
            <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">State Fund Referral?</span>
            <select name="stateFundReferral" value={formData.stateFundReferral} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button className="quote-request__preview-trigger" type="button" onClick={handleValidate}>Preview Form</button>
      </div>
    </section>
  );
}

export default WorkersCompForm;
