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

const INDUSTRY_TYPE_OPTIONS = [
  { value: '', label: 'Select industry type' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'delivery-logistics', label: 'Delivery / Logistics' },
  { value: 'artisan-trade', label: 'Artisan Trade' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'retail-wholesale', label: 'Retail / Wholesale' },
  { value: 'other', label: 'Other' },
];

const GVWR_OPTIONS = [
  { value: '', label: 'Select GVWR class' },
  { value: 'under-10000', label: 'Under 10,000' },
  { value: '10001-26000', label: '10,001-26,000' },
  { value: 'over-26000', label: 'Over 26,000' },
];

const PRIMARY_USE_OPTIONS = [
  { value: '', label: 'Select primary use' },
  { value: 'transport-goods', label: 'Transport of Goods' },
  { value: 'service-repair-calls', label: 'Service / Repair Calls' },
  { value: 'employee-transport', label: 'Employee Transport' },
  { value: 'pickup-delivery', label: 'Pickup / Delivery' },
  { value: 'farm', label: 'Farm' },
  { value: 'other', label: 'Other' },
];

const RADIUS_OPTIONS = [
  { value: '', label: 'Select radius of operation' },
  { value: 'local-under-50', label: 'Local (<50 miles)' },
  { value: 'intermediate-50-200', label: 'Intermediate (50-200 miles)' },
  { value: 'long-haul-200-plus', label: 'Long-Haul (200+)' },
];

const LICENSE_STATE_OPTIONS = [
  { value: '', label: 'Select state' },
  { value: 'CA', label: 'CA' },
  { value: 'AZ', label: 'AZ' },
  { value: 'NV', label: 'NV' },
  { value: 'OR', label: 'OR' },
  { value: 'WA', label: 'WA' },
  { value: 'TX', label: 'TX' },
  { value: 'other', label: 'Other' },
];

const BI_LIMIT_OPTIONS = [
  { value: '', label: 'Select BI limits' },
  { value: '25-50', label: '25/50' },
  { value: '50-100', label: '50/100' },
  { value: '100-300', label: '100/300' },
  { value: 'csl-300000', label: 'CSL $300,000' },
  { value: 'csl-500000', label: 'CSL $500,000' },
  { value: 'csl-1000000', label: 'CSL $1,000,000' },
];

const PD_LIMIT_OPTIONS = [
  { value: '', label: 'Select property damage limit' },
  { value: '25000', label: '$25,000' },
  { value: '50000', label: '$50,000' },
  { value: '100000', label: '$100,000' },
  { value: '250000', label: '$250,000' },
  { value: '500000', label: '$500,000' },
];

const MED_PAY_PIP_OPTIONS = [
  { value: '', label: 'Select Med Pay / PIP amount' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
];

const DEDUCTIBLE_OPTIONS = [
  { value: '', label: 'Select deductible' },
  { value: '250', label: '$250' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
];

const ACCIDENT_AT_FAULT_OPTIONS = [
  { value: '', label: 'At-fault?' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const VIOLATION_TYPE_OPTIONS = [
  { value: '', label: 'Violation type' },
  { value: 'speeding', label: 'Speeding' },
  { value: 'dui', label: 'DUI' },
  { value: 'reckless-driving', label: 'Reckless Driving' },
  { value: 'cell-phone', label: 'Cell Phone / Distracted Driving' },
  { value: 'other', label: 'Other' },
];

const initialAccident = {
  date: '',
  atFault: '',
  description: '',
};

const initialViolation = {
  date: '',
  type: '',
  description: '',
};

const initialForm = {
  legalBusinessName: '',
  dbaName: '',
  businessEntityType: '',
  federalEin: '',
  businessStreetAddress: '',
  businessCity: '',
  businessState: '',
  businessZip: '',
  yearBusinessEstablished: '',
  industryType: '',
  naicsCode: '',
  businessWebsiteUrl: '',
  primaryContactName: '',
  primaryContactPhone: '',
  primaryContactEmail: '',

  numberOfVehiclesToInsure: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleVin: '',
  vehicleGvwr: '',
  vehiclePrimaryUse: '',
  vehicleRadiusOfOperation: '',
  vehicleAnnualMileage: '',
  vehicleGaragingZip: '',
  vehicleLienholderLessorName: '',
  vehicleLienholderLessorAddress: '',
  vehicleCurrentMarketValue: '',
  dotNumber: '',
  mcNumber: '',

  driverFullLegalName: '',
  driverDateOfBirth: '',
  driverLicenseNumber: '',
  driverLicenseState: '',
  driverYearsLicensedUs: '',
  driverCdlHolder: '',
  driverSr22Required: '',

  bodilyInjuryLiabilityLimits: '',
  propertyDamageLiability: '',
  uninsuredUnderinsuredMotorist: '',
  medicalPaymentsPip: '',
  comprehensiveCoverage: '',
  comprehensiveDeductible: '',
  collisionCoverage: '',
  collisionDeductible: '',
  rentalReimbursement: '',
  rentalReimbursementDailyLimit: '',
  towingRoadsideAssistance: '',
  hiredNonOwnedAutoCoverage: '',
  mcs90EndorsementRequired: '',
  effectiveDate: '',
};

const requiredFields = [
  'legalBusinessName',
  'businessEntityType',
  'federalEin',
  'businessStreetAddress',
  'businessCity',
  'businessState',
  'businessZip',
  'yearBusinessEstablished',
  'industryType',
  'primaryContactName',
  'primaryContactPhone',
  'primaryContactEmail',
  'numberOfVehiclesToInsure',
  'vehicleYear',
  'vehicleMake',
  'vehicleModel',
  'vehicleVin',
  'vehicleGvwr',
  'vehiclePrimaryUse',
  'vehicleRadiusOfOperation',
  'vehicleAnnualMileage',
  'vehicleGaragingZip',
  'driverFullLegalName',
  'driverDateOfBirth',
  'driverLicenseNumber',
  'driverLicenseState',
  'driverYearsLicensedUs',
  'bodilyInjuryLiabilityLimits',
  'propertyDamageLiability',
  'uninsuredUnderinsuredMotorist',
  'hiredNonOwnedAutoCoverage',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';
const isFourDigitYear = (value) => /^\d{4}$/.test(String(value || '').trim());
const isDigitsOnly = (value) => /^\d+$/.test(String(value || '').trim());
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

const formatPhoneNumber = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

const formatEin = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
};

const formatVin = (rawValue) => String(rawValue ?? '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 17);

const formatZipCode = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
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

const formatWholeNumberWithCommas = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function CommercialAutoForm({ onBack }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [accidents, setAccidents] = useState([{ ...initialAccident }]);
  const [violations, setViolations] = useState([{ ...initialViolation }]);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (nextForm, nextAccidents, nextViolations) => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    if (!isBlank(nextForm.primaryContactEmail) && !isValidEmailFormat(nextForm.primaryContactEmail)) {
      nextErrors.primaryContactEmail = 'Enter a valid email address.';
    }

    if (!isBlank(nextForm.primaryContactPhone) && nextForm.primaryContactPhone.replace(/\D/g, '').length !== 10) {
      nextErrors.primaryContactPhone = 'Enter a valid 10-digit phone number.';
    }

    if (!isBlank(nextForm.federalEin) && !/^\d{2}-\d{7}$/.test(nextForm.federalEin)) {
      nextErrors.federalEin = 'Use EIN format XX-XXXXXXX.';
    }

    if (!isBlank(nextForm.vehicleVin) && nextForm.vehicleVin.length !== 17) {
      nextErrors.vehicleVin = 'VIN must be exactly 17 characters.';
    }

    if (!isBlank(nextForm.vehicleGaragingZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.vehicleGaragingZip)) {
      nextErrors.vehicleGaragingZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (!isBlank(nextForm.businessZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.businessZip)) {
      nextErrors.businessZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (!isBlank(nextForm.yearBusinessEstablished) && !isFourDigitYear(nextForm.yearBusinessEstablished)) {
      nextErrors.yearBusinessEstablished = 'Enter a valid 4-digit year.';
    }

    if (!isBlank(nextForm.numberOfVehiclesToInsure) && !isDigitsOnly(nextForm.numberOfVehiclesToInsure)) {
      nextErrors.numberOfVehiclesToInsure = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.vehicleYear) && !isFourDigitYear(nextForm.vehicleYear)) {
      nextErrors.vehicleYear = 'Enter a valid 4-digit year.';
    }

    if (!isBlank(nextForm.vehicleAnnualMileage) && !isDigitsOnly(nextForm.vehicleAnnualMileage.replace(/,/g, ''))) {
      nextErrors.vehicleAnnualMileage = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.dotNumber) && !isDigitsOnly(nextForm.dotNumber)) {
      nextErrors.dotNumber = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.mcNumber) && !isDigitsOnly(nextForm.mcNumber)) {
      nextErrors.mcNumber = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.driverYearsLicensedUs) && !isDigitsOnly(nextForm.driverYearsLicensedUs)) {
      nextErrors.driverYearsLicensedUs = 'Enter numbers only.';
    }

    if (nextForm.comprehensiveCoverage === 'yes' && isBlank(nextForm.comprehensiveDeductible)) {
      nextErrors.comprehensiveDeductible = REQUIRED_MESSAGE;
    }

    if (nextForm.collisionCoverage === 'yes' && isBlank(nextForm.collisionDeductible)) {
      nextErrors.collisionDeductible = REQUIRED_MESSAGE;
    }

    if (nextForm.rentalReimbursement === 'yes' && isBlank(nextForm.rentalReimbursementDailyLimit)) {
      nextErrors.rentalReimbursementDailyLimit = REQUIRED_MESSAGE;
    }

    const hasRequiredAccidentData = !isBlank(nextAccidents[0].date) || !isBlank(nextAccidents[0].atFault) || !isBlank(nextAccidents[0].description);
    if (!hasRequiredAccidentData) {
      nextErrors.accident0 = 'At least one accident record is required.';
    }

    nextAccidents.forEach((row, index) => {
      const hasAny = !isBlank(row.date) || !isBlank(row.atFault) || !isBlank(row.description);
      const hasAll = !isBlank(row.date) && !isBlank(row.atFault) && !isBlank(row.description);
      if (hasAny && !hasAll) {
        nextErrors[`accident${index}`] = 'Complete date, at-fault, and description for this accident entry.';
      }
    });

    const hasRequiredViolationData = !isBlank(nextViolations[0].date) || !isBlank(nextViolations[0].type) || !isBlank(nextViolations[0].description);
    if (!hasRequiredViolationData) {
      nextErrors.violation0 = 'At least one violation record is required.';
    }

    nextViolations.forEach((row, index) => {
      const hasAny = !isBlank(row.date) || !isBlank(row.type) || !isBlank(row.description);
      const hasAll = !isBlank(row.date) && !isBlank(row.type) && !isBlank(row.description);
      if (hasAny && !hasAll) {
        nextErrors[`violation${index}`] = 'Complete date, type, and description for this violation entry.';
      }
    });

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [
      ...requiredFields,
      'comprehensiveDeductible',
      'collisionDeductible',
      'rentalReimbursementDailyLimit',
      'accident0',
      'violation0',
    ];

    const firstErrorKey = orderedKeys.find((key) => nextErrors[key]);
    if (!firstErrorKey) {
      return;
    }

    requestAnimationFrame(() => {
      if (firstErrorKey.startsWith('accident')) {
        const node = formRef.current?.querySelector('[name="accidentDate0"]');
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.focus({ preventScroll: true });
        }
        return;
      }

      if (firstErrorKey.startsWith('violation')) {
        const node = formRef.current?.querySelector('[name="violationDate0"]');
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

    if (name === 'primaryContactPhone') {
      normalizedValue = formatPhoneNumber(value);
    }

    if (name === 'federalEin') {
      normalizedValue = formatEin(value);
    }

    if (name === 'vehicleVin') {
      normalizedValue = formatVin(value);
    }

    if (name === 'vehicleGaragingZip') {
      normalizedValue = formatZipCode(value);
    }

    if (name === 'businessZip') {
      normalizedValue = formatZipCode(value);
    }

    if ([
      'vehicleCurrentMarketValue',
      'rentalReimbursementDailyLimit',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    }

    if (name === 'yearBusinessEstablished') {
      normalizedValue = String(value ?? '').replace(/\D/g, '').slice(0, 4);
    }

    if ([
      'numberOfVehiclesToInsure',
      'driverYearsLicensedUs',
      'dotNumber',
      'mcNumber',
    ].includes(name)) {
      normalizedValue = String(value ?? '').replace(/\D/g, '');
    }

    if (name === 'vehicleAnnualMileage') {
      normalizedValue = formatWholeNumberWithCommas(value);
    }

    if (name === 'vehicleYear') {
      normalizedValue = String(value ?? '').replace(/\D/g, '').slice(0, 4);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'comprehensiveCoverage' && value !== 'yes') {
      nextForm.comprehensiveDeductible = '';
    }

    if (name === 'collisionCoverage' && value !== 'yes') {
      nextForm.collisionDeductible = '';
    }

    if (name === 'rentalReimbursement' && value !== 'yes') {
      nextForm.rentalReimbursementDailyLimit = '';
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, accidents, violations));
    }
  };

  const updateAccident = (index, field, value) => {
    const nextAccidents = accidents.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    ));

    setAccidents(nextAccidents);

    if (hasSubmitted) {
      setErrors(validate(formData, nextAccidents, violations));
    }
  };

  const addAccident = () => {
    const nextAccidents = [...accidents, { ...initialAccident }];
    setAccidents(nextAccidents);
    if (hasSubmitted) {
      setErrors(validate(formData, nextAccidents, violations));
    }
  };

  const removeAccident = (index) => {
    if (accidents.length <= 1) {
      return;
    }
    const nextAccidents = accidents.filter((_, rowIndex) => rowIndex !== index);
    setAccidents(nextAccidents);
    if (hasSubmitted) {
      setErrors(validate(formData, nextAccidents, violations));
    }
  };

  const updateViolation = (index, field, value) => {
    const nextViolations = violations.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: value } : row
    ));

    setViolations(nextViolations);

    if (hasSubmitted) {
      setErrors(validate(formData, accidents, nextViolations));
    }
  };

  const addViolation = () => {
    const nextViolations = [...violations, { ...initialViolation }];
    setViolations(nextViolations);
    if (hasSubmitted) {
      setErrors(validate(formData, accidents, nextViolations));
    }
  };

  const removeViolation = (index) => {
    if (violations.length <= 1) {
      return;
    }
    const nextViolations = violations.filter((_, rowIndex) => rowIndex !== index);
    setViolations(nextViolations);
    if (hasSubmitted) {
      setErrors(validate(formData, accidents, nextViolations));
    }
  };

  const handleValidate = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData, accidents, violations);
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

      <h3>Commercial Auto Insurance</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Commercial auto requires full business, vehicle, driver, and coverage details.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Business Information</h4>
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
            <span className="quote-request__field-label">Federal EIN (Tax ID) <span className="quote-request__required-mark">*</span></span>
            <input name="federalEin" value={formData.federalEin} onChange={handleChange} placeholder="XX-XXXXXXX" className={fieldError('federalEin') ? 'quote-request__input--invalid' : ''} />
            {fieldError('federalEin') ? <span className="quote-request__validation-message">{fieldError('federalEin')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Business Street Address (Principal Location) <span className="quote-request__required-mark">*</span></span>
            <input name="businessStreetAddress" value={formData.businessStreetAddress} onChange={handleChange} className={fieldError('businessStreetAddress') ? 'quote-request__input--invalid' : ''} />
            {fieldError('businessStreetAddress') ? <span className="quote-request__validation-message">{fieldError('businessStreetAddress')}</span> : null}
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
            <span className="quote-request__field-label">Year Business Established <span className="quote-request__required-mark">*</span></span>
            <input name="yearBusinessEstablished" value={formData.yearBusinessEstablished} onChange={handleChange} placeholder="YYYY" inputMode="numeric" maxLength={4} pattern="\d{4}" className={fieldError('yearBusinessEstablished') ? 'quote-request__input--invalid' : ''} />
            {fieldError('yearBusinessEstablished') ? <span className="quote-request__validation-message">{fieldError('yearBusinessEstablished')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Industry / Type of Business <span className="quote-request__required-mark">*</span></span>
            <select name="industryType" value={formData.industryType} onChange={handleChange} className={fieldError('industryType') ? 'quote-request__input--invalid' : ''}>
              {INDUSTRY_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('industryType') ? <span className="quote-request__validation-message">{fieldError('industryType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">NAICS Code</span>
            <input name="naicsCode" value={formData.naicsCode} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Business Website URL</span>
            <input name="businessWebsiteUrl" value={formData.businessWebsiteUrl} onChange={handleChange} placeholder="https://" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Primary Business Contact Name <span className="quote-request__required-mark">*</span></span>
            <input name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} className={fieldError('primaryContactName') ? 'quote-request__input--invalid' : ''} />
            {fieldError('primaryContactName') ? <span className="quote-request__validation-message">{fieldError('primaryContactName')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Primary Business Contact Phone <span className="quote-request__required-mark">*</span></span>
            <input name="primaryContactPhone" value={formData.primaryContactPhone} onChange={handleChange} placeholder="(XXX) XXX XXXX" className={fieldError('primaryContactPhone') ? 'quote-request__input--invalid' : ''} />
            {fieldError('primaryContactPhone') ? <span className="quote-request__validation-message">{fieldError('primaryContactPhone')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Primary Business Contact Email <span className="quote-request__required-mark">*</span></span>
            <input name="primaryContactEmail" value={formData.primaryContactEmail} onChange={handleChange} type="email" pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}" className={fieldError('primaryContactEmail') ? 'quote-request__input--invalid' : ''} />
            {fieldError('primaryContactEmail') ? <span className="quote-request__validation-message">{fieldError('primaryContactEmail')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Vehicle Information (Vehicle 1)</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Vehicles to Insure <span className="quote-request__required-mark">*</span></span>
            <input name="numberOfVehiclesToInsure" value={formData.numberOfVehiclesToInsure} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('numberOfVehiclesToInsure') ? 'quote-request__input--invalid' : ''} />
            {fieldError('numberOfVehiclesToInsure') ? <span className="quote-request__validation-message">{fieldError('numberOfVehiclesToInsure')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Year <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleYear" value={formData.vehicleYear} onChange={handleChange} placeholder="YYYY" inputMode="numeric" maxLength={4} pattern="\d{4}" className={fieldError('vehicleYear') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleYear') ? <span className="quote-request__validation-message">{fieldError('vehicleYear')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Make <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} className={fieldError('vehicleMake') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleMake') ? <span className="quote-request__validation-message">{fieldError('vehicleMake')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Model <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className={fieldError('vehicleModel') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleModel') ? <span className="quote-request__validation-message">{fieldError('vehicleModel')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - VIN <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleVin" value={formData.vehicleVin} onChange={handleChange} placeholder="17-character VIN" className={fieldError('vehicleVin') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleVin') ? <span className="quote-request__validation-message">{fieldError('vehicleVin')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - GVWR <span className="quote-request__required-mark">*</span></span>
            <select name="vehicleGvwr" value={formData.vehicleGvwr} onChange={handleChange} className={fieldError('vehicleGvwr') ? 'quote-request__input--invalid' : ''}>
              {GVWR_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('vehicleGvwr') ? <span className="quote-request__validation-message">{fieldError('vehicleGvwr')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Primary Use <span className="quote-request__required-mark">*</span></span>
            <select name="vehiclePrimaryUse" value={formData.vehiclePrimaryUse} onChange={handleChange} className={fieldError('vehiclePrimaryUse') ? 'quote-request__input--invalid' : ''}>
              {PRIMARY_USE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('vehiclePrimaryUse') ? <span className="quote-request__validation-message">{fieldError('vehiclePrimaryUse')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Radius of Operation <span className="quote-request__required-mark">*</span></span>
            <select name="vehicleRadiusOfOperation" value={formData.vehicleRadiusOfOperation} onChange={handleChange} className={fieldError('vehicleRadiusOfOperation') ? 'quote-request__input--invalid' : ''}>
              {RADIUS_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('vehicleRadiusOfOperation') ? <span className="quote-request__validation-message">{fieldError('vehicleRadiusOfOperation')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Annual Mileage <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleAnnualMileage" value={formData.vehicleAnnualMileage} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" className={fieldError('vehicleAnnualMileage') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleAnnualMileage') ? <span className="quote-request__validation-message">{fieldError('vehicleAnnualMileage')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Garaging ZIP Code <span className="quote-request__required-mark">*</span></span>
            <input name="vehicleGaragingZip" value={formData.vehicleGaragingZip} onChange={handleChange} className={fieldError('vehicleGaragingZip') ? 'quote-request__input--invalid' : ''} />
            {fieldError('vehicleGaragingZip') ? <span className="quote-request__validation-message">{fieldError('vehicleGaragingZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Lienholder / Lessor Name</span>
            <input name="vehicleLienholderLessorName" value={formData.vehicleLienholderLessorName} onChange={handleChange} />
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Vehicle 1 - Lienholder / Lessor Address</span>
            <input name="vehicleLienholderLessorAddress" value={formData.vehicleLienholderLessorAddress} onChange={handleChange} />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Vehicle 1 - Current Market Value / Cost New</span>
            <input name="vehicleCurrentMarketValue" value={formData.vehicleCurrentMarketValue} onChange={handleChange} placeholder="0.00" inputMode="decimal" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">DOT Number (If Applicable)</span>
            <input name="dotNumber" value={formData.dotNumber} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('dotNumber') ? 'quote-request__input--invalid' : ''} />
            {fieldError('dotNumber') ? <span className="quote-request__validation-message">{fieldError('dotNumber')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">MC Number (Motor Carrier)</span>
            <input name="mcNumber" value={formData.mcNumber} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('mcNumber') ? 'quote-request__input--invalid' : ''} />
            {fieldError('mcNumber') ? <span className="quote-request__validation-message">{fieldError('mcNumber')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Driver Information (Driver 1)</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - Full Legal Name <span className="quote-request__required-mark">*</span></span>
            <input name="driverFullLegalName" value={formData.driverFullLegalName} onChange={handleChange} className={fieldError('driverFullLegalName') ? 'quote-request__input--invalid' : ''} />
            {fieldError('driverFullLegalName') ? <span className="quote-request__validation-message">{fieldError('driverFullLegalName')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - Date of Birth <span className="quote-request__required-mark">*</span></span>
            <input name="driverDateOfBirth" type="date" value={formData.driverDateOfBirth} onChange={handleChange} className={fieldError('driverDateOfBirth') ? 'quote-request__input--invalid' : ''} />
            {fieldError('driverDateOfBirth') ? <span className="quote-request__validation-message">{fieldError('driverDateOfBirth')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - Driver License Number <span className="quote-request__required-mark">*</span></span>
            <input name="driverLicenseNumber" value={formData.driverLicenseNumber} onChange={handleChange} className={fieldError('driverLicenseNumber') ? 'quote-request__input--invalid' : ''} />
            {fieldError('driverLicenseNumber') ? <span className="quote-request__validation-message">{fieldError('driverLicenseNumber')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - License State <span className="quote-request__required-mark">*</span></span>
            <select name="driverLicenseState" value={formData.driverLicenseState} onChange={handleChange} className={fieldError('driverLicenseState') ? 'quote-request__input--invalid' : ''}>
              {LICENSE_STATE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('driverLicenseState') ? <span className="quote-request__validation-message">{fieldError('driverLicenseState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - Years Licensed in US <span className="quote-request__required-mark">*</span></span>
            <input name="driverYearsLicensedUs" value={formData.driverYearsLicensedUs} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('driverYearsLicensedUs') ? 'quote-request__input--invalid' : ''} />
            {fieldError('driverYearsLicensedUs') ? <span className="quote-request__validation-message">{fieldError('driverYearsLicensedUs')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - CDL Holder?</span>
            <select name="driverCdlHolder" value={formData.driverCdlHolder} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Driver 1 - SR-22 Required?</span>
            <select name="driverSr22Required" value={formData.driverSr22Required} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>

        <div className="quote-request__subsection" style={{ marginTop: 20 }}>
          <h5 className="quote-request__subsection-title" style={{ marginBottom: 12 }}>Driver 1 - Accidents (Past 5 Years) <span className="quote-request__required-mark">*</span></h5>
          {accidents.map((row, index) => (
            <div className="quote-request__claim-row" key={`accident-${index}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Date</span>
                <input
                  name={`accidentDate${index}`}
                  type="date"
                  value={row.date}
                  onChange={(event) => updateAccident(index, 'date', event.target.value)}
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">At-Fault</span>
                <select
                  name={`accidentAtFault${index}`}
                  value={row.atFault}
                  onChange={(event) => updateAccident(index, 'atFault', event.target.value)}
                >
                  {ACCIDENT_AT_FAULT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>
              <label className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Description</span>
                <input
                  name={`accidentDescription${index}`}
                  value={row.description}
                  onChange={(event) => updateAccident(index, 'description', event.target.value)}
                  placeholder="Describe accident details"
                />
              </label>
              {accidents.length > 1 ? (
                <button
                  className="quote-request__inline-secondary"
                  type="button"
                  onClick={() => removeAccident(index)}
                >
                  Remove Row
                </button>
              ) : null}
              {fieldError(`accident${index}`) ? <span className="quote-request__validation-message">{fieldError(`accident${index}`)}</span> : null}
            </div>
          ))}
          <button className="quote-request__inline-secondary" type="button" onClick={addAccident}>Add Another Accident</button>
        </div>

        <div className="quote-request__subsection" style={{ marginTop: 20 }}>
          <h5 className="quote-request__subsection-title" style={{ marginBottom: 12 }}>Driver 1 - Violations (Past 5 Years) <span className="quote-request__required-mark">*</span></h5>
          {violations.map((row, index) => (
            <div className="quote-request__claim-row" key={`violation-${index}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Date</span>
                <input
                  name={`violationDate${index}`}
                  type="date"
                  value={row.date}
                  onChange={(event) => updateViolation(index, 'date', event.target.value)}
                />
              </label>
              <label className="quote-request__field">
                <span className="quote-request__field-label">Type</span>
                <select
                  name={`violationType${index}`}
                  value={row.type}
                  onChange={(event) => updateViolation(index, 'type', event.target.value)}
                >
                  {VIOLATION_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
                </select>
              </label>
              <label className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Description</span>
                <input
                  name={`violationDescription${index}`}
                  value={row.description}
                  onChange={(event) => updateViolation(index, 'description', event.target.value)}
                  placeholder="Describe violation details"
                />
              </label>
              {violations.length > 1 ? (
                <button
                  className="quote-request__inline-secondary"
                  type="button"
                  onClick={() => removeViolation(index)}
                >
                  Remove Row
                </button>
              ) : null}
              {fieldError(`violation${index}`) ? <span className="quote-request__validation-message">{fieldError(`violation${index}`)}</span> : null}
            </div>
          ))}
          <button className="quote-request__inline-secondary" type="button" onClick={addViolation}>Add Another Violation</button>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage Selection</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Bodily Injury Liability Limits <span className="quote-request__required-mark">*</span></span>
            <select name="bodilyInjuryLiabilityLimits" value={formData.bodilyInjuryLiabilityLimits} onChange={handleChange} className={fieldError('bodilyInjuryLiabilityLimits') ? 'quote-request__input--invalid' : ''}>
              {BI_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('bodilyInjuryLiabilityLimits') ? <span className="quote-request__validation-message">{fieldError('bodilyInjuryLiabilityLimits')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Property Damage Liability <span className="quote-request__required-mark">*</span></span>
            <select name="propertyDamageLiability" value={formData.propertyDamageLiability} onChange={handleChange} className={fieldError('propertyDamageLiability') ? 'quote-request__input--invalid' : ''}>
              {PD_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('propertyDamageLiability') ? <span className="quote-request__validation-message">{fieldError('propertyDamageLiability')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Uninsured / Underinsured Motorist <span className="quote-request__required-mark">*</span></span>
            <select name="uninsuredUnderinsuredMotorist" value={formData.uninsuredUnderinsuredMotorist} onChange={handleChange} className={fieldError('uninsuredUnderinsuredMotorist') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('uninsuredUnderinsuredMotorist') ? <span className="quote-request__validation-message">{fieldError('uninsuredUnderinsuredMotorist')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Medical Payments / PIP</span>
            <select name="medicalPaymentsPip" value={formData.medicalPaymentsPip} onChange={handleChange}>
              {MED_PAY_PIP_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Comprehensive Coverage (Per Vehicle)?</span>
            <select name="comprehensiveCoverage" value={formData.comprehensiveCoverage} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.comprehensiveCoverage === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Comprehensive Deductible <span className="quote-request__required-mark">*</span></span>
              <select name="comprehensiveDeductible" value={formData.comprehensiveDeductible} onChange={handleChange} className={fieldError('comprehensiveDeductible') ? 'quote-request__input--invalid' : ''}>
                {DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
              </select>
              {fieldError('comprehensiveDeductible') ? <span className="quote-request__validation-message">{fieldError('comprehensiveDeductible')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Collision Coverage (Per Vehicle)?</span>
            <select name="collisionCoverage" value={formData.collisionCoverage} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.collisionCoverage === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Collision Deductible <span className="quote-request__required-mark">*</span></span>
              <select name="collisionDeductible" value={formData.collisionDeductible} onChange={handleChange} className={fieldError('collisionDeductible') ? 'quote-request__input--invalid' : ''}>
                {DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
              </select>
              {fieldError('collisionDeductible') ? <span className="quote-request__validation-message">{fieldError('collisionDeductible')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Rental Reimbursement?</span>
            <select name="rentalReimbursement" value={formData.rentalReimbursement} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.rentalReimbursement === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Rental Reimbursement Daily Limit <span className="quote-request__required-mark">*</span></span>
              <input name="rentalReimbursementDailyLimit" value={formData.rentalReimbursementDailyLimit} onChange={handleChange} placeholder="0.00" inputMode="decimal" className={fieldError('rentalReimbursementDailyLimit') ? 'quote-request__input--invalid' : ''} />
              {fieldError('rentalReimbursementDailyLimit') ? <span className="quote-request__validation-message">{fieldError('rentalReimbursementDailyLimit')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Towing and Roadside Assistance?</span>
            <select name="towingRoadsideAssistance" value={formData.towingRoadsideAssistance} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Hired and Non-Owned Auto Coverage? <span className="quote-request__required-mark">*</span></span>
            <select name="hiredNonOwnedAutoCoverage" value={formData.hiredNonOwnedAutoCoverage} onChange={handleChange} className={fieldError('hiredNonOwnedAutoCoverage') ? 'quote-request__input--invalid' : ''}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('hiredNonOwnedAutoCoverage') ? <span className="quote-request__validation-message">{fieldError('hiredNonOwnedAutoCoverage')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">MCS-90 Endorsement Required?</span>
            <select name="mcs90EndorsementRequired" value={formData.mcs90EndorsementRequired} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Effective Date <span className="quote-request__required-mark">*</span></span>
            <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleValidate}>Validate Commercial Auto Form</button>
      </div>
    </section>
  );
}

export default CommercialAutoForm;
