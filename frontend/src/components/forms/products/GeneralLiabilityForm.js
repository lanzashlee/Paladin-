import React, { useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const BUSINESS_ENTITY_OPTIONS = [
  { value: '', label: 'Select entity type' },
  { value: 'sole-proprietor', label: 'Sole Proprietor' },
  { value: 'llc', label: 'LLC' },
  { value: 'partnership', label: 'Partnership' },
  { value: 's-corp', label: 'S-Corp' },
  { value: 'c-corp', label: 'C-Corp' },
  { value: 'non-profit', label: 'Non-Profit' },
];

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select industry / type' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'retail-wholesale', label: 'Retail / Wholesale' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'hospitality-food', label: 'Hospitality / Food' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

const OCCURRENCE_LIMIT_OPTIONS = [
  { value: '', label: 'Select each occurrence limit' },
  { value: '300000', label: '$300,000' },
  { value: '500000', label: '$500,000' },
  { value: '1000000', label: '$1,000,000' },
  { value: '2000000', label: '$2,000,000' },
];

const AGGREGATE_LIMIT_OPTIONS = [
  { value: '', label: 'Select general aggregate limit' },
  { value: '600000', label: '$600,000' },
  { value: '1000000', label: '$1,000,000' },
  { value: '2000000', label: '$2,000,000' },
  { value: '4000000', label: '$4,000,000' },
];

const PRODUCTS_COMPLETED_OPS_OPTIONS = [
  { value: '', label: 'Select products/completed ops aggregate' },
  { value: '1000000', label: '$1,000,000' },
  { value: '2000000', label: '$2,000,000' },
];

const PERSONAL_ADVERTISING_INJURY_OPTIONS = [
  { value: '', label: 'Select personal/advertising injury limit' },
  { value: 'match-occurrence', label: 'Standard (Match Occurrence)' },
  { value: 'custom', label: 'Custom Amount' },
];

const DAMAGE_RENTED_PREMISES_OPTIONS = [
  { value: '', label: 'Select damage to rented premises limit' },
  { value: '50000', label: '$50,000' },
  { value: '100000', label: '$100,000' },
  { value: '300000', label: '$300,000' },
];

const MEDICAL_EXPENSE_LIMIT_OPTIONS = [
  { value: '', label: 'Select medical expense limit' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
];

const POLICY_TERM_OPTIONS = [
  { value: '', label: 'Select policy term' },
  { value: 'annual-12-months', label: 'Annual (12 Months)' },
  { value: 'short-term', label: 'Short-Term' },
  { value: 'other', label: 'Other' },
];

const initialClaim = {
  date: '',
  description: '',
  paidAmount: '',
  status: '',
};

const initialForm = {
  legalBusinessName: '',
  dbaName: '',
  businessEntityType: '',
  federalEin: '',
  primaryBusinessAddress: '',
  additionalLocationsPremises: '',
  yearBusinessEstablished: '',
  industryTypeOfBusiness: '',
  naicsCsicCode: '',
  detailedDescriptionOfOperations: '',
  productsManufacturedOrDistributed: '',
  descriptionOfProducts: '',
  estimatedAnnualRevenueGrossSales: '',
  estimatedAnnualPayroll: '',
  numberOfEmployeesFullTime: '',
  numberOfEmployeesPartTimeSeasonal: '',
  numberOfSubcontractorsUsedAnnually: '',
  subcontractorsCarryOwnInsurance: '',
  subcontractorAnnualCost: '',
  workPerformedOnResidentialProperties: '',
  workPerformedOnCommercialProperties: '',
  businessInvolvesLiquorSalesOrService: '',
  businessInvolvesFirearms: '',
  businessInvolvesMedicalServices: '',
  eachOccurrenceLimit: '',
  generalAggregateLimit: '',
  productsCompletedOperationsAggregate: '',
  personalAdvertisingInjuryLimit: '',
  damageToRentedPremisesLimit: '',
  medicalExpenseLimit: '',
  hiredNonOwnedAutoLiability: '',
  employeeBenefitsLiability: '',
  liquorLiabilityEndorsement: '',
  professionalLiabilityEo: '',
  additionalInsuredRequirements: '',
  waiverOfSubrogationRequired: '',
  waiverOfSubrogationEntityName: '',
  primaryAndNonContributoryRequired: '',
  effectiveDate: '',
  policyTerm: '',
};

const requiredFields = [
  'legalBusinessName',
  'businessEntityType',
  'federalEin',
  'primaryBusinessAddress',
  'yearBusinessEstablished',
  'industryTypeOfBusiness',
  'detailedDescriptionOfOperations',
  'estimatedAnnualRevenueGrossSales',
  'numberOfEmployeesFullTime',
  'eachOccurrenceLimit',
  'generalAggregateLimit',
  'productsCompletedOperationsAggregate',
  'effectiveDate',
  'policyTerm',
];

const isBlank = (value) => String(value ?? '').trim() === '';

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

function GeneralLiabilityForm({ onBack }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [priorClaims, setPriorClaims] = useState([{ ...initialClaim }]);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (nextForm, nextClaims) => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    if (!isBlank(nextForm.federalEin) && !/^\d{2}-\d{7}$/.test(nextForm.federalEin)) {
      nextErrors.federalEin = 'Use EIN format XX-XXXXXXX.';
    }

    if (nextForm.productsManufacturedOrDistributed === 'yes' && isBlank(nextForm.descriptionOfProducts)) {
      nextErrors.descriptionOfProducts = REQUIRED_MESSAGE;
    }

    if (nextForm.waiverOfSubrogationRequired === 'yes' && isBlank(nextForm.waiverOfSubrogationEntityName)) {
      nextErrors.waiverOfSubrogationEntityName = REQUIRED_MESSAGE;
    }

    const hasRequiredClaimData = !isBlank(nextClaims[0].date) || !isBlank(nextClaims[0].description) || !isBlank(nextClaims[0].paidAmount) || !isBlank(nextClaims[0].status);
    if (!hasRequiredClaimData) {
      nextErrors.claim0 = 'At least one prior GL claim entry is required.';
    }

    nextClaims.forEach((row, index) => {
      const hasAny = !isBlank(row.date) || !isBlank(row.description) || !isBlank(row.paidAmount) || !isBlank(row.status);
      const hasAll = !isBlank(row.date) && !isBlank(row.description) && !isBlank(row.paidAmount) && !isBlank(row.status);
      if (hasAny && !hasAll) {
        nextErrors[`claim${index}`] = 'Complete date, description, paid amount, and status for this claim row.';
      }
    });

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [
      ...requiredFields,
      'descriptionOfProducts',
      'waiverOfSubrogationEntityName',
      'claim0',
    ];

    const firstErrorKey = orderedKeys.find((key) => nextErrors[key]);
    if (!firstErrorKey) {
      return;
    }

    requestAnimationFrame(() => {
      if (firstErrorKey.startsWith('claim')) {
        const node = formRef.current?.querySelector('[name="claimDate0"]');
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

    if (name === 'federalEin') {
      normalizedValue = formatEin(value);
    }

    if ([
      'estimatedAnnualRevenueGrossSales',
      'estimatedAnnualPayroll',
      'subcontractorAnnualCost',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'productsManufacturedOrDistributed' && value !== 'yes') {
      nextForm.descriptionOfProducts = '';
    }

    if (name === 'waiverOfSubrogationRequired' && value !== 'yes') {
      nextForm.waiverOfSubrogationEntityName = '';
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, priorClaims));
    }
  };

  const updateClaim = (index, field, value) => {
    const normalized = field === 'paidAmount' ? formatCurrencyInput(value) : value;
    const nextClaims = priorClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));

    setPriorClaims(nextClaims);

    if (hasSubmitted) {
      setErrors(validate(formData, nextClaims));
    }
  };

  const addClaim = () => {
    const nextClaims = [...priorClaims, { ...initialClaim }];
    setPriorClaims(nextClaims);
    if (hasSubmitted) {
      setErrors(validate(formData, nextClaims));
    }
  };

  const removeClaim = (index) => {
    if (priorClaims.length <= 1) {
      return;
    }
    const nextClaims = priorClaims.filter((_, rowIndex) => rowIndex !== index);
    setPriorClaims(nextClaims);
    if (hasSubmitted) {
      setErrors(validate(formData, nextClaims));
    }
  };

  const handleValidate = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData, priorClaims);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
    }
  };

  const fieldError = (name) => errors[name];

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>General Liability Insurance (GL / CGL)</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Detailed operations and prior claims are critical for GL underwriting.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Business and Operations Profile</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Legal Business Name <span className="quote-request__required-mark">*</span></span>
            <input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleChange} className={fieldError('legalBusinessName') ? 'quote-request__input--invalid' : ''} />
            {fieldError('legalBusinessName') ? <span className="quote-request__validation-message">{fieldError('legalBusinessName')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">DBA (Doing Business As)</span>
            <input name="dbaName" value={formData.dbaName} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business Entity Type <span className="quote-request__required-mark">*</span></span>
            <select name="businessEntityType" value={formData.businessEntityType} onChange={handleChange} className={fieldError('businessEntityType') ? 'quote-request__input--invalid' : ''}>
              {BUSINESS_ENTITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('businessEntityType') ? <span className="quote-request__validation-message">{fieldError('businessEntityType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Federal EIN <span className="quote-request__required-mark">*</span></span>
            <input name="federalEin" value={formData.federalEin} onChange={handleChange} placeholder="XX-XXXXXXX" className={fieldError('federalEin') ? 'quote-request__input--invalid' : ''} />
            {fieldError('federalEin') ? <span className="quote-request__validation-message">{fieldError('federalEin')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Primary Business Address <span className="quote-request__required-mark">*</span></span>
            <input name="primaryBusinessAddress" value={formData.primaryBusinessAddress} onChange={handleChange} className={fieldError('primaryBusinessAddress') ? 'quote-request__input--invalid' : ''} />
            {fieldError('primaryBusinessAddress') ? <span className="quote-request__validation-message">{fieldError('primaryBusinessAddress')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Additional Locations / Premises</span>
            <textarea name="additionalLocationsPremises" value={formData.additionalLocationsPremises} onChange={handleChange} rows={3} placeholder="List additional addresses and details" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Year Business Established <span className="quote-request__required-mark">*</span></span>
            <input name="yearBusinessEstablished" value={formData.yearBusinessEstablished} onChange={handleChange} placeholder="YYYY" className={fieldError('yearBusinessEstablished') ? 'quote-request__input--invalid' : ''} />
            {fieldError('yearBusinessEstablished') ? <span className="quote-request__validation-message">{fieldError('yearBusinessEstablished')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Industry / Type of Business <span className="quote-request__required-mark">*</span></span>
            <select name="industryTypeOfBusiness" value={formData.industryTypeOfBusiness} onChange={handleChange} className={fieldError('industryTypeOfBusiness') ? 'quote-request__input--invalid' : ''}>
              {INDUSTRY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('industryTypeOfBusiness') ? <span className="quote-request__validation-message">{fieldError('industryTypeOfBusiness')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">NAICS / CSIC Code</span>
            <input name="naicsCsicCode" value={formData.naicsCsicCode} onChange={handleChange} />
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Detailed Description of Operations <span className="quote-request__required-mark">*</span></span>
            <textarea name="detailedDescriptionOfOperations" value={formData.detailedDescriptionOfOperations} onChange={handleChange} rows={5} placeholder="Describe operations, services, process, and delivery model" className={fieldError('detailedDescriptionOfOperations') ? 'quote-request__input--invalid' : ''} />
            {fieldError('detailedDescriptionOfOperations') ? <span className="quote-request__validation-message">{fieldError('detailedDescriptionOfOperations')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Products Manufactured or Distributed?</span>
            <select name="productsManufacturedOrDistributed" value={formData.productsManufacturedOrDistributed} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.productsManufacturedOrDistributed === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Description of Products <span className="quote-request__required-mark">*</span></span>
              <textarea name="descriptionOfProducts" value={formData.descriptionOfProducts} onChange={handleChange} rows={3} className={fieldError('descriptionOfProducts') ? 'quote-request__input--invalid' : ''} />
              {fieldError('descriptionOfProducts') ? <span className="quote-request__validation-message">{fieldError('descriptionOfProducts')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Estimated Annual Revenue / Gross Sales <span className="quote-request__required-mark">*</span></span>
            <input name="estimatedAnnualRevenueGrossSales" value={formData.estimatedAnnualRevenueGrossSales} onChange={handleChange} inputMode="decimal" placeholder="0.00" className={fieldError('estimatedAnnualRevenueGrossSales') ? 'quote-request__input--invalid' : ''} />
            {fieldError('estimatedAnnualRevenueGrossSales') ? <span className="quote-request__validation-message">{fieldError('estimatedAnnualRevenueGrossSales')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Estimated Annual Payroll (If Applicable)</span>
            <input name="estimatedAnnualPayroll" value={formData.estimatedAnnualPayroll} onChange={handleChange} inputMode="decimal" placeholder="0.00" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Employees (Full-Time) <span className="quote-request__required-mark">*</span></span>
            <input name="numberOfEmployeesFullTime" value={formData.numberOfEmployeesFullTime} onChange={handleChange} className={fieldError('numberOfEmployeesFullTime') ? 'quote-request__input--invalid' : ''} />
            {fieldError('numberOfEmployeesFullTime') ? <span className="quote-request__validation-message">{fieldError('numberOfEmployeesFullTime')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Employees (Part-Time / Seasonal)</span>
            <input name="numberOfEmployeesPartTimeSeasonal" value={formData.numberOfEmployeesPartTimeSeasonal} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Subcontractors Used Annually</span>
            <input name="numberOfSubcontractorsUsedAnnually" value={formData.numberOfSubcontractorsUsedAnnually} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Do Subcontractors Carry Their Own Insurance?</span>
            <select name="subcontractorsCarryOwnInsurance" value={formData.subcontractorsCarryOwnInsurance} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Subcontractor Annual Cost</span>
            <input name="subcontractorAnnualCost" value={formData.subcontractorAnnualCost} onChange={handleChange} inputMode="decimal" placeholder="0.00" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed on Residential Properties?</span>
            <select name="workPerformedOnResidentialProperties" value={formData.workPerformedOnResidentialProperties} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Work Performed on Commercial Properties?</span>
            <select name="workPerformedOnCommercialProperties" value={formData.workPerformedOnCommercialProperties} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Does Business Involve Liquor Sales or Service?</span>
            <select name="businessInvolvesLiquorSalesOrService" value={formData.businessInvolvesLiquorSalesOrService} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Does Business Involve Firearms?</span>
            <select name="businessInvolvesFirearms" value={formData.businessInvolvesFirearms} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Does Business Involve Medical Services?</span>
            <select name="businessInvolvesMedicalServices" value={formData.businessInvolvesMedicalServices} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>

        <div className="quote-request__subsection" style={{ marginTop: 20 }}>
          <h5 className="quote-request__subsection-title" style={{ marginBottom: 12 }}>Prior GL Claims (Past 5 Years) <span className="quote-request__required-mark">*</span></h5>
          {priorClaims.map((row, index) => (
            <div className="quote-request__claim-row" key={`claim-${index}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Date</span>
                <input
                  name={`claimDate${index}`}
                  type="date"
                  value={row.date}
                  onChange={(event) => updateClaim(index, 'date', event.target.value)}
                />
              </label>
              <label className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Description</span>
                <input
                  name={`claimDescription${index}`}
                  value={row.description}
                  onChange={(event) => updateClaim(index, 'description', event.target.value)}
                  placeholder="Describe claim details"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Paid Amount</span>
                <input
                  name={`claimPaidAmount${index}`}
                  value={row.paidAmount}
                  onChange={(event) => updateClaim(index, 'paidAmount', event.target.value)}
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Status</span>
                <input
                  name={`claimStatus${index}`}
                  value={row.status}
                  onChange={(event) => updateClaim(index, 'status', event.target.value)}
                  placeholder="Open / Closed"
                />
              </label>

              {priorClaims.length > 1 ? (
                <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeClaim(index)}>
                  Remove Row
                </button>
              ) : null}
              {fieldError(`claim${index}`) ? <span className="quote-request__validation-message">{fieldError(`claim${index}`)}</span> : null}
            </div>
          ))}
          <button className="quote-request__inline-secondary" type="button" onClick={addClaim}>Add Another Claim</button>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage Limits and Endorsements</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Each Occurrence Limit <span className="quote-request__required-mark">*</span></span>
            <select name="eachOccurrenceLimit" value={formData.eachOccurrenceLimit} onChange={handleChange} className={fieldError('eachOccurrenceLimit') ? 'quote-request__input--invalid' : ''}>
              {OCCURRENCE_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('eachOccurrenceLimit') ? <span className="quote-request__validation-message">{fieldError('eachOccurrenceLimit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">General Aggregate Limit <span className="quote-request__required-mark">*</span></span>
            <select name="generalAggregateLimit" value={formData.generalAggregateLimit} onChange={handleChange} className={fieldError('generalAggregateLimit') ? 'quote-request__input--invalid' : ''}>
              {AGGREGATE_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('generalAggregateLimit') ? <span className="quote-request__validation-message">{fieldError('generalAggregateLimit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Products and Completed Operations Aggregate <span className="quote-request__required-mark">*</span></span>
            <select name="productsCompletedOperationsAggregate" value={formData.productsCompletedOperationsAggregate} onChange={handleChange} className={fieldError('productsCompletedOperationsAggregate') ? 'quote-request__input--invalid' : ''}>
              {PRODUCTS_COMPLETED_OPS_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('productsCompletedOperationsAggregate') ? <span className="quote-request__validation-message">{fieldError('productsCompletedOperationsAggregate')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Personal and Advertising Injury Limit</span>
            <select name="personalAdvertisingInjuryLimit" value={formData.personalAdvertisingInjuryLimit} onChange={handleChange}>
              {PERSONAL_ADVERTISING_INJURY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Damage to Rented Premises (Fire Legal Liability)</span>
            <select name="damageToRentedPremisesLimit" value={formData.damageToRentedPremisesLimit} onChange={handleChange}>
              {DAMAGE_RENTED_PREMISES_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Medical Expense Limit</span>
            <select name="medicalExpenseLimit" value={formData.medicalExpenseLimit} onChange={handleChange}>
              {MEDICAL_EXPENSE_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Hired and Non-Owned Auto Liability?</span>
            <select name="hiredNonOwnedAutoLiability" value={formData.hiredNonOwnedAutoLiability} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Employee Benefits Liability?</span>
            <select name="employeeBenefitsLiability" value={formData.employeeBenefitsLiability} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Liquor Liability Endorsement?</span>
            <select name="liquorLiabilityEndorsement" value={formData.liquorLiabilityEndorsement} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Professional Liability / E&O?</span>
            <select name="professionalLiabilityEo" value={formData.professionalLiabilityEo} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Additional Insured Requirements</span>
            <textarea name="additionalInsuredRequirements" value={formData.additionalInsuredRequirements} onChange={handleChange} rows={3} placeholder="List entity names requiring AI status" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Waiver of Subrogation Required?</span>
            <select name="waiverOfSubrogationRequired" value={formData.waiverOfSubrogationRequired} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.waiverOfSubrogationRequired === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Waiver Entity Name <span className="quote-request__required-mark">*</span></span>
              <input name="waiverOfSubrogationEntityName" value={formData.waiverOfSubrogationEntityName} onChange={handleChange} className={fieldError('waiverOfSubrogationEntityName') ? 'quote-request__input--invalid' : ''} />
              {fieldError('waiverOfSubrogationEntityName') ? <span className="quote-request__validation-message">{fieldError('waiverOfSubrogationEntityName')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Primary and Non-Contributory Required?</span>
            <select name="primaryAndNonContributoryRequired" value={formData.primaryAndNonContributoryRequired} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Effective Date <span className="quote-request__required-mark">*</span></span>
            <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Policy Term <span className="quote-request__required-mark">*</span></span>
            <select name="policyTerm" value={formData.policyTerm} onChange={handleChange} className={fieldError('policyTerm') ? 'quote-request__input--invalid' : ''}>
              {POLICY_TERM_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('policyTerm') ? <span className="quote-request__validation-message">{fieldError('policyTerm')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleValidate}>Validate GL Form</button>
      </div>
    </section>
  );
}

export default GeneralLiabilityForm;
