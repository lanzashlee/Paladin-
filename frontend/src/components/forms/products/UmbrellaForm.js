import React, { useEffect, useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const UMBRELLA_TYPE_OPTIONS = [
  { value: '', label: 'Select umbrella type' },
  { value: 'personal-umbrella', label: 'Personal Umbrella' },
  { value: 'commercial-umbrella', label: 'Commercial Umbrella' },
  { value: 'excess-liability', label: 'Excess Liability' },
];

const AUTO_LIMIT_OPTIONS = [
  { value: '', label: 'Select auto BI/PD limits' },
  { value: '100-300', label: '100/300' },
  { value: '250-500', label: '250/500' },
  { value: '300-csl', label: '300 CSL' },
  { value: '500-csl', label: '500 CSL' },
];

const GL_LIMIT_OPTIONS = [
  { value: '', label: 'Select GL limits' },
  { value: '1m', label: '$1M' },
  { value: '2m', label: '$2M' },
];

const UMBRELLA_LIMIT_OPTIONS = [
  { value: '', label: 'Select umbrella limit' },
  { value: '1m', label: '$1M' },
  { value: '2m', label: '$2M' },
  { value: '3m', label: '$3M' },
  { value: '5m', label: '$5M' },
  { value: '10m', label: '$10M' },
];

const SIR_OPTIONS = [
  { value: '', label: 'Select self-insured retention' },
  { value: '0', label: '$0' },
  { value: '250', label: '$250' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
];

const initialForm = {
  fullNameOrBusinessName: '',
  dateOfBirthOrEin: '',
  addressStreet: '',
  addressUnit: '',
  addressCity: '',
  addressState: '',
  addressZip: '',
  address: '',
  umbrellaPolicyType: '',
  underlyingHomeownersPolicyCarrier: '',
  underlyingHomeownersPolicyNumber: '',
  underlyingHomeownersLiabilityLimit: '',
  underlyingAutoPolicyCarrier: '',
  underlyingAutoPolicyNumber: '',
  underlyingAutoBiPdLimits: '',
  underlyingGlPolicyCarrier: '',
  underlyingGlLimits: '',
  underlyingCommercialAutoPolicy: '',
  underlyingWcPolicy: '',
  watercraftOwned: '',
  watercraftDetails: '',
  recreationalVehiclesAtvs: '',
  recreationalVehiclesAtvsDetails: '',
  rentalPropertiesOwned: '',
  rentalPropertiesCount: '',
  numberOfDriversInHousehold: '',
  youngDriversUnder25: '',
  duiOrSeriousViolationsAnyDriver: '',
  priorUmbrellaClaimsPast5Years: '',
  priorUmbrellaClaimsDetails: '',
  swimmingPool: '',
  trampoline: '',
  dogsBreedAndCount: '',
  boardMemberships: '',
  boardMembershipsDetails: '',
  homeBasedBusiness: '',
  homeBasedBusinessDetails: '',
  umbrellaLimit: '',
  effectiveDate: '',
  selfInsuredRetentionSir: '',
};

const initialPriorClaim = {
  date: '',
  amount: '',
  description: '',
};

const requiredFields = [
  'fullNameOrBusinessName',
  'dateOfBirthOrEin',
  'addressStreet',
  'addressCity',
  'addressState',
  'addressZip',
  'umbrellaPolicyType',
  'duiOrSeriousViolationsAnyDriver',
  'priorUmbrellaClaimsPast5Years',
  'umbrellaLimit',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';

const formatZipCode = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const buildAddressSummary = ({ street, unit, city, state, zip }) => (
  [street, unit, city, state, zip]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(', ')
);

const formatCurrencyInput = (rawValue) => {
  const sanitized = String(rawValue ?? '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '');

  if (!sanitized) {
    return '';
  }

  const hasDecimalPoint = sanitized.includes('.');
  const [integerRaw = '', ...decimalParts] = sanitized.split('.');
  const decimalRaw = decimalParts.join('').slice(0, 2);
  const normalizedInteger = integerRaw.replace(/^0+(?=\d)/, '');
  const integerPart = normalizedInteger || (hasDecimalPoint ? '0' : '');
  const formattedInteger = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';

  if (!hasDecimalPoint) {
    return formattedInteger;
  }

  return `${formattedInteger || '0'}.${decimalRaw}`;
};

const formatWholeNumberWithCommas = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const buildPriorClaimsSummary = (claims) => claims
  .map((row) => {
    const date = String(row.date ?? '').trim();
    const amount = String(row.amount ?? '').trim();
    const description = String(row.description ?? '').trim();
    const parts = [];
    if (date) {
      parts.push(`Date: ${date}`);
    }
    if (amount) {
      parts.push(`Amount: ${amount}`);
    }
    if (description) {
      parts.push(`Description: ${description}`);
    }
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

function UmbrellaForm({ onBack, onFormChange, onValidityChange, onPreviewRequest }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [priorClaims, setPriorClaims] = useState([{ ...initialPriorClaim }]);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (nextForm, nextPriorClaims) => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    if (!isBlank(nextForm.addressZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.addressZip)) {
      nextErrors.addressZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (nextForm.priorUmbrellaClaimsPast5Years === 'yes') {
      const hasRequiredClaimData = !isBlank(nextPriorClaims[0].date) || !isBlank(nextPriorClaims[0].amount) || !isBlank(nextPriorClaims[0].description);
      if (!hasRequiredClaimData) {
        nextErrors.priorClaim0 = 'At least one prior umbrella claim is required.';
      }

      nextPriorClaims.forEach((row, index) => {
        const hasAny = !isBlank(row.date) || !isBlank(row.amount) || !isBlank(row.description);
        const hasAll = !isBlank(row.date) && !isBlank(row.amount) && !isBlank(row.description);
        if (hasAny && !hasAll) {
          nextErrors[`priorClaim${index}`] = 'Complete date, amount, and description for this claim row.';
        }
      });
    }

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [
      ...requiredFields,
      'priorClaim0',
    ];
    const firstErrorField = orderedKeys.find((field) => nextErrors[field]);
    if (!firstErrorField) {
      return;
    }

    requestAnimationFrame(() => {
      if (firstErrorField.startsWith('priorClaim')) {
        const node = formRef.current?.querySelector('[name="priorClaimDate0"]');
        if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          node.focus({ preventScroll: true });
        }
        return;
      }

      const node = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
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

    if (name === 'addressZip') {
      normalizedValue = formatZipCode(value);
    }

    if (name === 'underlyingHomeownersLiabilityLimit') {
      normalizedValue = formatCurrencyInput(value);
    }

    if (['rentalPropertiesCount', 'numberOfDriversInHousehold'].includes(name)) {
      normalizedValue = formatWholeNumberWithCommas(value);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'watercraftOwned' && value !== 'yes') {
      nextForm.watercraftDetails = '';
    }

    if (name === 'recreationalVehiclesAtvs' && value !== 'yes') {
      nextForm.recreationalVehiclesAtvsDetails = '';
    }

    if (name === 'rentalPropertiesOwned' && value !== 'yes') {
      nextForm.rentalPropertiesCount = '';
    }

    if (name === 'priorUmbrellaClaimsPast5Years' && value !== 'yes') {
      nextForm.priorUmbrellaClaimsDetails = '';
    }

    if (name === 'boardMemberships' && value !== 'yes') {
      nextForm.boardMembershipsDetails = '';
    }

    if (name === 'homeBasedBusiness' && value !== 'yes') {
      nextForm.homeBasedBusinessDetails = '';
    }

    if (name === 'priorUmbrellaClaimsPast5Years') {
      if (value !== 'yes') {
        nextForm.priorUmbrellaClaimsDetails = '';
      } else {
        nextForm.priorUmbrellaClaimsDetails = buildPriorClaimsSummary(priorClaims);
      }
    }

    if ([
      'addressStreet',
      'addressUnit',
      'addressCity',
      'addressState',
      'addressZip',
    ].includes(name)) {
      nextForm.address = buildAddressSummary({
        street: name === 'addressStreet' ? normalizedValue : formData.addressStreet,
        unit: name === 'addressUnit' ? normalizedValue : formData.addressUnit,
        city: name === 'addressCity' ? normalizedValue : formData.addressCity,
        state: name === 'addressState' ? normalizedValue : formData.addressState,
        zip: name === 'addressZip' ? normalizedValue : formData.addressZip,
      });
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, priorClaims));
    }
  };

  const updatePriorClaim = (index, field, value) => {
    const normalized = field === 'amount' ? formatCurrencyInput(value) : value;
    const nextPriorClaims = priorClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setPriorClaims(nextPriorClaims);

    const nextForm = {
      ...formData,
      priorUmbrellaClaimsDetails: buildPriorClaimsSummary(nextPriorClaims),
    };
    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, nextPriorClaims));
    }
  };

  const addPriorClaim = () => {
    const nextPriorClaims = [...priorClaims, { ...initialPriorClaim }];
    setPriorClaims(nextPriorClaims);
    if (hasSubmitted) {
      setErrors(validate(formData, nextPriorClaims));
    }
  };

  const removePriorClaim = (index) => {
    if (priorClaims.length <= 1) {
      return;
    }
    const nextPriorClaims = priorClaims.filter((_, rowIndex) => rowIndex !== index);
    setPriorClaims(nextPriorClaims);

    const nextForm = {
      ...formData,
      priorUmbrellaClaimsDetails: buildPriorClaimsSummary(nextPriorClaims),
    };
    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, nextPriorClaims));
    }
  };

  const handleContinue = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData, priorClaims);
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
        priorClaims,
      });
    }
    if (typeof onValidityChange === 'function') {
      onValidityChange(Object.keys(validate(formData, priorClaims)).length === 0);
    }
  }, [formData, priorClaims, onFormChange, onValidityChange]);

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>Umbrella / Excess Liability Insurance</h3>
      <p className="quote-request__form-intro">
        Complete required fields first. Add optional underlying policy and exposure details to improve underwriting fit.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Applicant and Policy Type</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Full Name (Personal) or Business Name (Commercial) <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="fullNameOrBusinessName"
              value={formData.fullNameOrBusinessName}
              onChange={handleChange}
              placeholder="Full name or legal business name"
              className={fieldError('fullNameOrBusinessName') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('fullNameOrBusinessName') ? <span className="quote-request__validation-message">{fieldError('fullNameOrBusinessName')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Date of Birth (Personal) or EIN (Commercial) <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="dateOfBirthOrEin"
              value={formData.dateOfBirthOrEin}
              onChange={handleChange}
              placeholder="MM/DD/YYYY or EIN"
              className={fieldError('dateOfBirthOrEin') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('dateOfBirthOrEin') ? <span className="quote-request__validation-message">{fieldError('dateOfBirthOrEin')}</span> : null}
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">
              Address - Street <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="addressStreet"
              value={formData.addressStreet}
              onChange={handleChange}
              className={fieldError('addressStreet') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('addressStreet') ? <span className="quote-request__validation-message">{fieldError('addressStreet')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Address - Unit Number</span>
            <input
              name="addressUnit"
              value={formData.addressUnit}
              onChange={handleChange}
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Address - City <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="addressCity"
              value={formData.addressCity}
              onChange={handleChange}
              className={fieldError('addressCity') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('addressCity') ? <span className="quote-request__validation-message">{fieldError('addressCity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Address - State <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="addressState"
              value={formData.addressState}
              onChange={handleChange}
              className={fieldError('addressState') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('addressState') ? <span className="quote-request__validation-message">{fieldError('addressState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Address - ZIP <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="addressZip"
              value={formData.addressZip}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              className={fieldError('addressZip') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('addressZip') ? <span className="quote-request__validation-message">{fieldError('addressZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Type of Umbrella Policy <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="umbrellaPolicyType"
              value={formData.umbrellaPolicyType}
              onChange={handleChange}
              className={fieldError('umbrellaPolicyType') ? 'quote-request__input--invalid' : ''}
            >
              {UMBRELLA_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('umbrellaPolicyType') ? <span className="quote-request__validation-message">{fieldError('umbrellaPolicyType')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Underlying Policy Information (Optional)</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Homeowners Policy Carrier</span><input name="underlyingHomeownersPolicyCarrier" value={formData.underlyingHomeownersPolicyCarrier} onChange={handleChange} placeholder="Carrier name" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Homeowners Policy Number</span><input name="underlyingHomeownersPolicyNumber" value={formData.underlyingHomeownersPolicyNumber} onChange={handleChange} placeholder="Policy number" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Homeowners Liability Limit</span><input name="underlyingHomeownersLiabilityLimit" value={formData.underlyingHomeownersLiabilityLimit} onChange={handleChange} placeholder="0.00" inputMode="decimal" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Auto Policy Carrier</span><input name="underlyingAutoPolicyCarrier" value={formData.underlyingAutoPolicyCarrier} onChange={handleChange} placeholder="Carrier name" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Auto Policy Number</span><input name="underlyingAutoPolicyNumber" value={formData.underlyingAutoPolicyNumber} onChange={handleChange} placeholder="Policy number" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Auto BI/PD Limits</span><select name="underlyingAutoBiPdLimits" value={formData.underlyingAutoBiPdLimits} onChange={handleChange}>{AUTO_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying GL Policy Carrier</span><input name="underlyingGlPolicyCarrier" value={formData.underlyingGlPolicyCarrier} onChange={handleChange} placeholder="Carrier name" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying GL Limits</span><select name="underlyingGlLimits" value={formData.underlyingGlLimits} onChange={handleChange}>{GL_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Commercial Auto Policy (if applicable)</span><input name="underlyingCommercialAutoPolicy" value={formData.underlyingCommercialAutoPolicy} onChange={handleChange} placeholder="Carrier / policy details" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying WC Policy (if applicable)</span><input name="underlyingWcPolicy" value={formData.underlyingWcPolicy} onChange={handleChange} placeholder="Carrier / policy details" /></label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Exposure and Risk Triggers</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Watercraft Owned?</span>
            <select name="watercraftOwned" value={formData.watercraftOwned} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          {formData.watercraftOwned === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Watercraft Details</span><input name="watercraftDetails" value={formData.watercraftDetails} onChange={handleChange} placeholder="Boat length / horsepower" /></label> : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Recreational Vehicles / ATVs?</span>
            <select name="recreationalVehiclesAtvs" value={formData.recreationalVehiclesAtvs} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          {formData.recreationalVehiclesAtvs === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Recreational Vehicle / ATV Details</span><input name="recreationalVehiclesAtvsDetails" value={formData.recreationalVehiclesAtvsDetails} onChange={handleChange} placeholder="Vehicle type and count" /></label> : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Rental Properties Owned?</span>
            <select name="rentalPropertiesOwned" value={formData.rentalPropertiesOwned} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          {formData.rentalPropertiesOwned === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Number of Rental Units</span><input name="rentalPropertiesCount" value={formData.rentalPropertiesCount} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" placeholder="Number of units" /></label> : null}

          <label className="quote-request__field"><span className="quote-request__field-label">Number of Drivers in Household (Personal)</span><input name="numberOfDriversInHousehold" value={formData.numberOfDriversInHousehold} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" placeholder="Driver count" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Young Drivers (under 25) in Household?</span><select name="youngDriversUnder25" value={formData.youngDriversUnder25} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              DUI or Serious Violations - Any Driver? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="duiOrSeriousViolationsAnyDriver"
              value={formData.duiOrSeriousViolationsAnyDriver}
              onChange={handleChange}
              className={fieldError('duiOrSeriousViolationsAnyDriver') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('duiOrSeriousViolationsAnyDriver') ? <span className="quote-request__validation-message">{fieldError('duiOrSeriousViolationsAnyDriver')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Prior Umbrella Claims (past 5 years)? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="priorUmbrellaClaimsPast5Years"
              value={formData.priorUmbrellaClaimsPast5Years}
              onChange={handleChange}
              className={fieldError('priorUmbrellaClaimsPast5Years') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('priorUmbrellaClaimsPast5Years') ? <span className="quote-request__validation-message">{fieldError('priorUmbrellaClaimsPast5Years')}</span> : null}
          </label>
          {formData.priorUmbrellaClaimsPast5Years === 'yes' ? (
            <div className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Prior Umbrella Claim Details <span className="quote-request__required-mark">*</span></span>
              {priorClaims.map((row, index) => (
                <div className="quote-request__claim-row" key={`umbrella-prior-claim-${index}`}>
                  <label className="quote-request__field">
                    <span className="quote-request__field-label">Date</span>
                    <input
                      name={`priorClaimDate${index}`}
                      type="date"
                      value={row.date}
                      onChange={(event) => updatePriorClaim(index, 'date', event.target.value)}
                    />
                  </label>
                  <label className="quote-request__field">
                    <span className="quote-request__field-label">Amount</span>
                    <input
                      name={`priorClaimAmount${index}`}
                      value={row.amount}
                      onChange={(event) => updatePriorClaim(index, 'amount', event.target.value)}
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  </label>
                  <label className="quote-request__field quote-request__field--full">
                    <span className="quote-request__field-label">Description</span>
                    <input
                      name={`priorClaimDescription${index}`}
                      value={row.description}
                      onChange={(event) => updatePriorClaim(index, 'description', event.target.value)}
                      placeholder="Claim details"
                    />
                  </label>
                  {priorClaims.length > 1 ? (
                    <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removePriorClaim(index)}>
                      Remove Row
                    </button>
                  ) : null}
                  {fieldError(`priorClaim${index}`) ? <span className="quote-request__validation-message">{fieldError(`priorClaim${index}`)}</span> : null}
                </div>
              ))}
              <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addPriorClaim}>Add Another Claim</button>
            </div>
          ) : null}

          <label className="quote-request__field"><span className="quote-request__field-label">Swimming Pool?</span><select name="swimmingPool" value={formData.swimmingPool} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Trampoline?</span><select name="trampoline" value={formData.trampoline} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Dogs (breed and count)?</span><input name="dogsBreedAndCount" value={formData.dogsBreedAndCount} onChange={handleChange} placeholder="Breed(s) and count" /></label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Board Memberships?</span>
            <select name="boardMemberships" value={formData.boardMemberships} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          {formData.boardMemberships === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Board Membership Details</span><input name="boardMembershipsDetails" value={formData.boardMembershipsDetails} onChange={handleChange} placeholder="Organization names" /></label> : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Home-Based Business?</span>
            <select name="homeBasedBusiness" value={formData.homeBasedBusiness} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
          {formData.homeBasedBusiness === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Home-Based Business Details</span><input name="homeBasedBusinessDetails" value={formData.homeBasedBusinessDetails} onChange={handleChange} placeholder="Business description" /></label> : null}
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Limit and Effective Date</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Umbrella Limit <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="umbrellaLimit"
              value={formData.umbrellaLimit}
              onChange={handleChange}
              className={fieldError('umbrellaLimit') ? 'quote-request__input--invalid' : ''}
            >
              {UMBRELLA_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('umbrellaLimit') ? <span className="quote-request__validation-message">{fieldError('umbrellaLimit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Effective Date <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={handleChange}
              className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Self-Insured Retention (SIR)</span>
            <select name="selfInsuredRetentionSir" value={formData.selfInsuredRetentionSir} onChange={handleChange}>
              {SIR_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleContinue}>Preview Form</button>
      </div>
    </section>
  );
}

export default UmbrellaForm;
