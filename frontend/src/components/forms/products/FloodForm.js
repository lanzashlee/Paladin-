import React, { useEffect, useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const FLOOD_ZONE_OPTIONS = [
  { value: '', label: 'Select FEMA flood zone' },
  { value: 'x', label: 'Zone X' },
  { value: 'ae', label: 'Zone AE' },
  { value: 'ao', label: 'Zone AO' },
  { value: 've', label: 'Zone VE' },
  { value: 'a', label: 'Zone A' },
  { value: 'other', label: 'Other' },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Select property type' },
  { value: 'single-family', label: 'Single Family' },
  { value: '2-4-unit-condo-ho6', label: '2-4 Unit / Condo (HO6)' },
  { value: 'renters', label: 'Renters' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

const FLOOR_OPTIONS = [
  { value: '', label: 'Select number of floors' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4+', label: '4+' },
];

const BASEMENT_TYPE_OPTIONS = [
  { value: '', label: 'Select basement type' },
  { value: 'finished', label: 'Finished' },
  { value: 'unfinished', label: 'Unfinished' },
];

const DEDUCTIBLE_BUILDING_OPTIONS = [
  { value: '', label: 'Select building deductible' },
  { value: '1000', label: '$1,000' },
  { value: '2000', label: '$2,000' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '50000', label: '$50,000' },
];

const DEDUCTIBLE_CONTENTS_OPTIONS = [
  { value: '', label: 'Select contents deductible' },
  { value: '1000', label: '$1,000' },
  { value: '2000', label: '$2,000' },
  { value: '5000', label: '$5,000' },
];

const FLOOD_MARKET_OPTIONS = [
  { value: '', label: 'Select market preference' },
  { value: 'nfip', label: 'NFIP' },
  { value: 'private', label: 'Private Market' },
  { value: 'either', label: 'Either (best fit)' },
];

const PREFERRED_RISK_OPTIONS = [
  { value: '', label: 'Select preferred risk status' },
  { value: 'preferred-risk', label: 'Preferred Risk' },
  { value: 'not-preferred-risk', label: 'Not Preferred Risk' },
  { value: 'unknown', label: 'Unknown' },
];

const initialForm = {
  propertyStreetAddress: '',
  propertyUnitNumber: '',
  propertyCity: '',
  propertyState: '',
  propertyZip: '',
  propertyAddress: '',
  femaFloodZone: '',
  baseFloodElevation: '',
  elevationCertificateAvailable: '',
  firstFloorElevationAboveBFE: '',
  communityNfipParticipationStatus: '',
  propertyType: '',
  yearBuilt: '',
  numberOfFloors: '',
  basement: '',
  basementType: '',
  enclosureBelowElevatedBuilding: '',
  buildingCoverage: '',
  contentsCoverage: '',
  deductibleBuilding: '',
  deductibleContents: '',
  nfipOrPrivateFlood: '',
  preferredRiskEligibility: '',
  priorFloodClaims: '',
  priorFloodClaimsDetails: '',
  effectiveDate: '',
};

const initialPriorClaim = {
  date: '',
  amountPaid: '',
};

const requiredFields = [
  'propertyStreetAddress',
  'propertyCity',
  'propertyState',
  'propertyZip',
  'femaFloodZone',
  'propertyType',
  'yearBuilt',
  'basement',
  'buildingCoverage',
  'deductibleBuilding',
  'nfipOrPrivateFlood',
  'priorFloodClaims',
  'effectiveDate',
];

const currencyFields = new Set(['buildingCoverage', 'contentsCoverage']);

const isBlank = (value) => String(value ?? '').trim() === '';
const isFourDigitYear = (value) => /^\d{4}$/.test(String(value ?? '').trim());
const getTodayIsoDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const buildAddressSummary = ({ streetAddress, unitNumber, city, state, zip }) => (
  [streetAddress, unitNumber, city, state, zip]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(', ')
);

function FloodForm({ onBack, onFormChange, onValidityChange, onPreviewRequest }) {
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

    if (!isBlank(nextForm.propertyZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.propertyZip)) {
      nextErrors.propertyZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (!isBlank(nextForm.yearBuilt) && !isFourDigitYear(nextForm.yearBuilt)) {
      nextErrors.yearBuilt = 'Enter a valid 4-digit year.';
    }

    if (nextForm.basement === 'yes' && isBlank(nextForm.basementType)) {
      nextErrors.basementType = REQUIRED_MESSAGE;
    }

    if (nextForm.priorFloodClaims === 'yes') {
      const todayIsoDate = getTodayIsoDate();
      const hasRequiredClaimData = !isBlank(nextPriorClaims[0].date) || !isBlank(nextPriorClaims[0].amountPaid);
      if (!hasRequiredClaimData) {
        nextErrors.priorClaim0 = 'At least one prior flood claim is required.';
      }

      nextPriorClaims.forEach((row, index) => {
        const hasAny = !isBlank(row.date) || !isBlank(row.amountPaid);
        const hasAll = !isBlank(row.date) && !isBlank(row.amountPaid);
        if (hasAny && !hasAll) {
          nextErrors[`priorClaim${index}`] = 'Complete claim date and amount paid for this row.';
          return;
        }

        if (!isBlank(row.date) && row.date > todayIsoDate) {
          nextErrors[`priorClaim${index}`] = 'Claim date cannot be in the future.';
        }
      });
    }

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [
      ...requiredFields,
      'basementType',
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
    let normalizedValue = currencyFields.has(name) ? formatCurrencyInput(value) : value;

    if (name === 'yearBuilt') {
      normalizedValue = String(value ?? '').replace(/\D/g, '').slice(0, 4);
    }

    if (['baseFloodElevation', 'firstFloorElevationAboveBFE'].includes(name)) {
      normalizedValue = formatWholeNumberWithCommas(value);
    }

    if (name === 'propertyZip') {
      normalizedValue = formatZipCode(value);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'priorFloodClaims' && value !== 'yes') {
      nextForm.priorFloodClaimsDetails = '';
    }

    if (name === 'basement' && value !== 'yes') {
      nextForm.basementType = '';
    }

    if ([
      'propertyStreetAddress',
      'propertyUnitNumber',
      'propertyCity',
      'propertyState',
      'propertyZip',
    ].includes(name)) {
      nextForm.propertyAddress = buildAddressSummary({
        streetAddress: name === 'propertyStreetAddress' ? normalizedValue : formData.propertyStreetAddress,
        unitNumber: name === 'propertyUnitNumber' ? normalizedValue : formData.propertyUnitNumber,
        city: name === 'propertyCity' ? normalizedValue : formData.propertyCity,
        state: name === 'propertyState' ? normalizedValue : formData.propertyState,
        zip: name === 'propertyZip' ? normalizedValue : formData.propertyZip,
      });
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm, priorClaims));
    }
  };

  const updatePriorClaim = (index, field, value) => {
    const normalized = field === 'amountPaid' ? formatCurrencyInput(value) : value;
    const nextPriorClaims = priorClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setPriorClaims(nextPriorClaims);
    if (hasSubmitted) {
      setErrors(validate(formData, nextPriorClaims));
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
    if (hasSubmitted) {
      setErrors(validate(formData, nextPriorClaims));
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
  const todayIsoDate = getTodayIsoDate();

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>Flood Insurance</h3>
      <p className="quote-request__form-intro">
        Complete required NFIP/private flood intake fields below. Optional fields improve eligibility and pricing accuracy.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Property and Flood Risk Profile</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">
              Property Street Address <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="propertyStreetAddress"
              value={formData.propertyStreetAddress}
              onChange={handleChange}
              className={fieldError('propertyStreetAddress') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('propertyStreetAddress') ? <span className="quote-request__validation-message">{fieldError('propertyStreetAddress')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Property Unit Number</span>
            <input
              name="propertyUnitNumber"
              value={formData.propertyUnitNumber}
              onChange={handleChange}
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Property City <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="propertyCity"
              value={formData.propertyCity}
              onChange={handleChange}
              className={fieldError('propertyCity') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('propertyCity') ? <span className="quote-request__validation-message">{fieldError('propertyCity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Property State <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="propertyState"
              value={formData.propertyState}
              onChange={handleChange}
              className={fieldError('propertyState') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('propertyState') ? <span className="quote-request__validation-message">{fieldError('propertyState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Property ZIP <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="propertyZip"
              value={formData.propertyZip}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              className={fieldError('propertyZip') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('propertyZip') ? <span className="quote-request__validation-message">{fieldError('propertyZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              FEMA Flood Zone <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="femaFloodZone"
              value={formData.femaFloodZone}
              onChange={handleChange}
              className={fieldError('femaFloodZone') ? 'quote-request__input--invalid' : ''}
            >
              {FLOOD_ZONE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('femaFloodZone') ? <span className="quote-request__validation-message">{fieldError('femaFloodZone')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Base Flood Elevation (BFE)</span>
            <input
              name="baseFloodElevation"
              value={formData.baseFloodElevation}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[\d,]+"
              placeholder="Feet above sea level"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Elevation Certificate Available?</span>
            <select name="elevationCertificateAvailable" value={formData.elevationCertificateAvailable} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">First Floor Elevation (above BFE)</span>
            <input
              name="firstFloorElevationAboveBFE"
              value={formData.firstFloorElevationAboveBFE}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[\d,]+"
              placeholder="Feet above BFE"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Community NFIP Participation Status</span>
            <input
              name="communityNfipParticipationStatus"
              value={formData.communityNfipParticipationStatus}
              onChange={handleChange}
              placeholder="Participating / Non-participating / Unknown"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Property Type <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={fieldError('propertyType') ? 'quote-request__input--invalid' : ''}
            >
              {PROPERTY_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('propertyType') ? <span className="quote-request__validation-message">{fieldError('propertyType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Year Built <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              placeholder="YYYY"
              inputMode="numeric"
              maxLength={4}
              pattern="\d{4}"
              className={fieldError('yearBuilt') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('yearBuilt') ? <span className="quote-request__validation-message">{fieldError('yearBuilt')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Floors</span>
            <select name="numberOfFloors" value={formData.numberOfFloors} onChange={handleChange}>
              {FLOOR_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Basement? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="basement"
              value={formData.basement}
              onChange={handleChange}
              className={fieldError('basement') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('basement') ? <span className="quote-request__validation-message">{fieldError('basement')}</span> : null}
          </label>

          {formData.basement === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">
                Basement Type <span className="quote-request__required-mark">*</span>
              </span>
              <select
                name="basementType"
                value={formData.basementType}
                onChange={handleChange}
                className={fieldError('basementType') ? 'quote-request__input--invalid' : ''}
              >
                {BASEMENT_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
              </select>
              {fieldError('basementType') ? <span className="quote-request__validation-message">{fieldError('basementType')}</span> : null}
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Enclosure Below Elevated Building?</span>
            <select name="enclosureBelowElevatedBuilding" value={formData.enclosureBelowElevatedBuilding} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage and Program Selection</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Building Coverage <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="buildingCoverage"
              value={formData.buildingCoverage}
              onChange={handleChange}
              placeholder="0.00"
              inputMode="decimal"
              className={fieldError('buildingCoverage') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('buildingCoverage') ? <span className="quote-request__validation-message">{fieldError('buildingCoverage')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Contents Coverage</span>
            <input
              name="contentsCoverage"
              value={formData.contentsCoverage}
              onChange={handleChange}
              placeholder="0.00"
              inputMode="decimal"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Deductible (Building) <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="deductibleBuilding"
              value={formData.deductibleBuilding}
              onChange={handleChange}
              className={fieldError('deductibleBuilding') ? 'quote-request__input--invalid' : ''}
            >
              {DEDUCTIBLE_BUILDING_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('deductibleBuilding') ? <span className="quote-request__validation-message">{fieldError('deductibleBuilding')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Deductible (Contents)</span>
            <select name="deductibleContents" value={formData.deductibleContents} onChange={handleChange}>
              {DEDUCTIBLE_CONTENTS_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              NFIP or Private Flood? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="nfipOrPrivateFlood"
              value={formData.nfipOrPrivateFlood}
              onChange={handleChange}
              className={fieldError('nfipOrPrivateFlood') ? 'quote-request__input--invalid' : ''}
            >
              {FLOOD_MARKET_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('nfipOrPrivateFlood') ? <span className="quote-request__validation-message">{fieldError('nfipOrPrivateFlood')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Preferred Risk Eligibility?</span>
            <select name="preferredRiskEligibility" value={formData.preferredRiskEligibility} onChange={handleChange}>
              {PREFERRED_RISK_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Prior Flood Claims (NFIP or private)? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="priorFloodClaims"
              value={formData.priorFloodClaims}
              onChange={handleChange}
              className={fieldError('priorFloodClaims') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('priorFloodClaims') ? <span className="quote-request__validation-message">{fieldError('priorFloodClaims')}</span> : null}
          </label>

          {formData.priorFloodClaims === 'yes' ? (
            <div className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Prior Flood Claims (Date and Amount Paid) <span className="quote-request__required-mark">*</span></span>
              {priorClaims.map((row, index) => (
                <div className="quote-request__claim-row" key={`prior-claim-${index}`}>
                  <label className="quote-request__field">
                    <span className="quote-request__field-label">Claim Date</span>
                    <input
                      name={`priorClaimDate${index}`}
                      type="date"
                      value={row.date}
                      onChange={(event) => updatePriorClaim(index, 'date', event.target.value)}
                      max={todayIsoDate}
                    />
                  </label>
                  <label className="quote-request__field">
                    <span className="quote-request__field-label">Amount Paid</span>
                    <input
                      name={`priorClaimAmountPaid${index}`}
                      value={row.amountPaid}
                      onChange={(event) => updatePriorClaim(index, 'amountPaid', event.target.value)}
                      placeholder="0.00"
                      inputMode="decimal"
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
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button className="quote-request__preview-trigger" type="button" onClick={handleContinue}>Preview Form</button>
      </div>
    </section>
  );
}

export default FloodForm;
