import React, { useEffect, useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const RENTAL_UNIT_TYPE_OPTIONS = [
  { value: '', label: 'Select rental unit type' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
  { value: 'mobile-home', label: 'Mobile Home' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Other' },
];

const CONSTRUCTION_TYPE_OPTIONS = [
  { value: '', label: 'Select construction type' },
  { value: 'wood-frame', label: 'Wood Frame' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'mixed', label: 'Mixed' },
];

const LIABILITY_OPTIONS = [
  { value: '', label: 'Select liability coverage' },
  { value: '100000', label: '$100,000' },
  { value: '300000', label: '$300,000' },
  { value: '500000', label: '$500,000' },
];

const MEDICAL_PAYMENTS_OPTIONS = [
  { value: '', label: 'Select medical payments' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
  { value: '5000', label: '$5,000' },
];

const DEDUCTIBLE_OPTIONS = [
  { value: '', label: 'Select deductible' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
];

const initialForm = {
  rentalStreetAddress: '',
  rentalCity: '',
  rentalState: '',
  rentalZip: '',
  rentalUnitNumber: '',
  typeOfRentalUnit: '',
  yearBuildingBuilt: '',
  floorOfUnit: '',
  buildingConstructionType: '',
  monthlyRentAmount: '',
  personalPropertyCoverage: '',
  lossOfUseCoverage: '',
  liabilityCoverage: '',
  medicalPaymentsToOthers: '',
  deductible: '',
  highValueItemsToSchedule: '',
  waterBackupEndorsement: '',
  identityTheftCoverage: '',
  petInUnit: '',
  petBreedDetails: '',
  effectiveDate: '',
};

const requiredFields = [
  'rentalStreetAddress',
  'rentalCity',
  'rentalState',
  'rentalZip',
  'rentalUnitNumber',
  'typeOfRentalUnit',
  'personalPropertyCoverage',
  'liabilityCoverage',
  'deductible',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';
const isFourDigitYear = (value) => /^\d{4}$/.test(String(value || '').trim());
const isDigitsOnly = (value) => /^\d+$/.test(String(value || '').trim());
const normalizeUsZipDigits = (value = '') => String(value).replace(/\D/g, '').slice(0, 9);
const formatUsZipDisplay = (value = '') => {
  const digits = normalizeUsZipDigits(value);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};
const isValidUsZipFormat = (value = '') => /^\d{5}(-\d{4})?$/.test(String(value || '').trim());

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

function HO4Form({ onBack, onFormChange, onValidityChange }) {
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

    if (nextForm.yearBuildingBuilt && !isFourDigitYear(nextForm.yearBuildingBuilt)) {
      nextErrors.yearBuildingBuilt = 'Please enter a valid 4-digit year.';
    }

    if (nextForm.floorOfUnit && !isDigitsOnly(nextForm.floorOfUnit)) {
      nextErrors.floorOfUnit = 'Please enter numbers only.';
    }

    if (nextForm.rentalZip && !isValidUsZipFormat(nextForm.rentalZip)) {
      nextErrors.rentalZip = 'Please enter a valid US ZIP (12345 or 12345-6789).';
    }

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
    let normalizedValue = value;

    if ([
      'monthlyRentAmount',
      'personalPropertyCoverage',
      'lossOfUseCoverage',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    } else if (name === 'yearBuildingBuilt' || name === 'floorOfUnit') {
      normalizedValue = String(value).replace(/\D/g, '');
    } else if (name === 'rentalZip') {
      normalizedValue = formatUsZipDisplay(value);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'petInUnit' && value !== 'yes') {
      nextForm.petBreedDetails = '';
    }

    setFormData(nextForm);

    if (hasSubmitted) {
      setErrors(validate(nextForm));
    }
  };

  const handleValidate = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
    }
  };

  const fieldError = (name) => errors[name];

  useEffect(() => {
    if (typeof onFormChange === 'function') {
      onFormChange(formData);
    }

    if (typeof onValidityChange === 'function') {
      onValidityChange(Object.keys(validate(formData)).length === 0);
    }
  }, [formData, onFormChange, onValidityChange]);

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>Renters Insurance (HO4) - Tenant / Renter</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Optional fields improve quote accuracy and coverage matching.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Rental Property Details</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Street Address <span className="quote-request__required-mark">*</span></span>
            <input name="rentalStreetAddress" value={formData.rentalStreetAddress} onChange={handleChange} placeholder="Street address" className={fieldError('rentalStreetAddress') ? 'quote-request__input--invalid' : ''} />
            {fieldError('rentalStreetAddress') ? <span className="quote-request__validation-message">{fieldError('rentalStreetAddress')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Unit Number <span className="quote-request__required-mark">*</span></span>
            <input name="rentalUnitNumber" value={formData.rentalUnitNumber} onChange={handleChange} placeholder="Unit / Apt #" className={fieldError('rentalUnitNumber') ? 'quote-request__input--invalid' : ''} />
            {fieldError('rentalUnitNumber') ? <span className="quote-request__validation-message">{fieldError('rentalUnitNumber')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">City <span className="quote-request__required-mark">*</span></span>
            <input name="rentalCity" value={formData.rentalCity} onChange={handleChange} placeholder="City" className={fieldError('rentalCity') ? 'quote-request__input--invalid' : ''} />
            {fieldError('rentalCity') ? <span className="quote-request__validation-message">{fieldError('rentalCity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">State <span className="quote-request__required-mark">*</span></span>
            <input name="rentalState" value={formData.rentalState} onChange={handleChange} placeholder="State" className={fieldError('rentalState') ? 'quote-request__input--invalid' : ''} />
            {fieldError('rentalState') ? <span className="quote-request__validation-message">{fieldError('rentalState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">ZIP <span className="quote-request__required-mark">*</span></span>
            <input name="rentalZip" value={formData.rentalZip} onChange={handleChange} placeholder="ZIP" inputMode="numeric" maxLength={10} pattern="\d{5}(-\d{4})?" className={fieldError('rentalZip') ? 'quote-request__input--invalid' : ''} />
            {fieldError('rentalZip') ? <span className="quote-request__validation-message">{fieldError('rentalZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Type of Rental Unit <span className="quote-request__required-mark">*</span></span>
            <select name="typeOfRentalUnit" value={formData.typeOfRentalUnit} onChange={handleChange} className={fieldError('typeOfRentalUnit') ? 'quote-request__input--invalid' : ''}>
              {RENTAL_UNIT_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('typeOfRentalUnit') ? <span className="quote-request__validation-message">{fieldError('typeOfRentalUnit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Year Building Built</span>
            <input name="yearBuildingBuilt" value={formData.yearBuildingBuilt} onChange={handleChange} placeholder="YYYY" inputMode="numeric" maxLength={4} pattern="\d{4}" className={fieldError('yearBuildingBuilt') ? 'quote-request__input--invalid' : ''} />
            {fieldError('yearBuildingBuilt') ? <span className="quote-request__validation-message">{fieldError('yearBuildingBuilt')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Floor of Unit</span>
            <input name="floorOfUnit" value={formData.floorOfUnit} onChange={handleChange} placeholder="Floor number" inputMode="numeric" pattern="\d+" className={fieldError('floorOfUnit') ? 'quote-request__input--invalid' : ''} />
            {fieldError('floorOfUnit') ? <span className="quote-request__validation-message">{fieldError('floorOfUnit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Building Construction Type</span>
            <select name="buildingConstructionType" value={formData.buildingConstructionType} onChange={handleChange}>
              {CONSTRUCTION_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Monthly Rent Amount</span>
            <input name="monthlyRentAmount" value={formData.monthlyRentAmount} onChange={handleChange} placeholder="0.00" inputMode="decimal" />
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage and Endorsements</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Personal Property Coverage (Coverage C) <span className="quote-request__required-mark">*</span></span>
            <input name="personalPropertyCoverage" value={formData.personalPropertyCoverage} onChange={handleChange} placeholder="0.00" inputMode="decimal" className={fieldError('personalPropertyCoverage') ? 'quote-request__input--invalid' : ''} />
            {fieldError('personalPropertyCoverage') ? <span className="quote-request__validation-message">{fieldError('personalPropertyCoverage')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Loss of Use / Additional Living Expense</span>
            <input name="lossOfUseCoverage" value={formData.lossOfUseCoverage} onChange={handleChange} placeholder="0.00 or % of Coverage C" inputMode="decimal" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Liability Coverage (Coverage E) <span className="quote-request__required-mark">*</span></span>
            <select name="liabilityCoverage" value={formData.liabilityCoverage} onChange={handleChange} className={fieldError('liabilityCoverage') ? 'quote-request__input--invalid' : ''}>
              {LIABILITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('liabilityCoverage') ? <span className="quote-request__validation-message">{fieldError('liabilityCoverage')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Medical Payments to Others</span>
            <select name="medicalPaymentsToOthers" value={formData.medicalPaymentsToOthers} onChange={handleChange}>
              {MEDICAL_PAYMENTS_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Deductible <span className="quote-request__required-mark">*</span></span>
            <select name="deductible" value={formData.deductible} onChange={handleChange} className={fieldError('deductible') ? 'quote-request__input--invalid' : ''}>
              {DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('deductible') ? <span className="quote-request__validation-message">{fieldError('deductible')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">High-Value Items to Schedule?</span>
            <select name="highValueItemsToSchedule" value={formData.highValueItemsToSchedule} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Water Backup Endorsement?</span>
            <select name="waterBackupEndorsement" value={formData.waterBackupEndorsement} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Identity Theft Coverage?</span>
            <select name="identityTheftCoverage" value={formData.identityTheftCoverage} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Pet in Unit?</span>
            <select name="petInUnit" value={formData.petInUnit} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.petInUnit === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Pet Breed and Details</span>
              <input name="petBreedDetails" value={formData.petBreedDetails} onChange={handleChange} placeholder="Breed, number, and details" />
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Effective Date <span className="quote-request__required-mark">*</span></span>
            <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleValidate}>Validate HO4 Form</button>
      </div>
    </section>
  );
}

export default HO4Form;
