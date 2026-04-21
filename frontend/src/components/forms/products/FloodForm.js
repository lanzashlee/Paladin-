import React, { useRef, useState } from 'react';

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

const requiredFields = [
  'propertyAddress',
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

function FloodForm({ onBack }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = (nextForm) => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const firstErrorField = requiredFields.find((field) => nextErrors[field]);
    if (!firstErrorField) {
      return;
    }

    requestAnimationFrame(() => {
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
    const normalizedValue = currencyFields.has(name) ? formatCurrencyInput(value) : value;
    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'priorFloodClaims' && value !== 'yes') {
      nextForm.priorFloodClaimsDetails = '';
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm));
    }
  };

  const handleContinue = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData);
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

      <h3>Flood Insurance</h3>
      <p className="quote-request__form-intro">
        Complete required NFIP/private flood intake fields below. Optional fields improve eligibility and pricing accuracy.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Property and Flood Risk Profile</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">
              Property Address <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              placeholder="Street, city, state, ZIP"
              className={fieldError('propertyAddress') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('propertyAddress') ? <span className="quote-request__validation-message">{fieldError('propertyAddress')}</span> : null}
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
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Prior Flood Claim Details</span>
              <input
                name="priorFloodClaimsDetails"
                value={formData.priorFloodClaimsDetails}
                onChange={handleChange}
                placeholder="Repeat date, amount paid, and claim notes"
              />
            </label>
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
        <button type="button" onClick={handleContinue}>Validate Flood Form</button>
      </div>
    </section>
  );
}

export default FloodForm;
