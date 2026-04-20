import React, { useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const CONSTRUCTION_TYPE_OPTIONS = [
  { value: '', label: 'Select construction type' },
  { value: 'wood-frame', label: 'Wood Frame' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'steel-frame', label: 'Steel Frame' },
];

const UNIT_OWNERSHIP_OPTIONS = [
  { value: '', label: 'Select unit ownership status' },
  { value: 'owner-occupied', label: 'Owner-Occupied' },
  { value: 'rented-to-others', label: 'Rented to Others' },
  { value: 'vacant', label: 'Vacant' },
];

const HOA_MASTER_POLICY_OPTIONS = [
  { value: '', label: 'Select HOA master policy type' },
  { value: 'bare-walls-in', label: 'Bare Walls-In' },
  { value: 'single-entity-all-in', label: 'Single Entity (All-In)' },
  { value: 'all-in-with-betterments', label: 'All-In with Betterments' },
];

const FLOORING_TYPE_OPTIONS = [
  { value: '', label: 'Select flooring type' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'hardwood', label: 'Hardwood' },
  { value: 'tile', label: 'Tile' },
  { value: 'luxury-vinyl', label: 'Luxury Vinyl' },
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
  { value: '5000', label: '$5,000' },
];

const initialForm = {
  condoUnitAddress: '',
  buildingComplexName: '',
  yearBuildingBuilt: '',
  floorNumberOfUnit: '',
  totalFloorsInBuilding: '',
  constructionTypeOfBuilding: '',
  squareFootageOfUnit: '',
  numberOfRooms: '',
  unitOwnershipStatus: '',
  hoaMasterPolicyCoverageType: '',
  hoaMasterPolicyDeductible: '',
  hoaMasterPolicyCarrierPolicyNumber: '',
  unitFullyRenovated: '',
  yearOfLastRenovation: '',
  kitchenRenovation: '',
  kitchenRenovationDescription: '',
  bathroomRenovation: '',
  bathroomRenovationDescription: '',
  flooringType: '',
  specialUpgradesBetterments: '',
  dwellingCoverageA: '',
  personalPropertyCoverageC: '',
  lossOfUseCoverageD: '',
  liabilityCoverageE: '',
  medicalPaymentsCoverageF: '',
  deductible: '',
  lossAssessmentCoverage: '',
  waterBackupEndorsement: '',
  scheduledPersonalProperty: '',
  earthquakeEndorsement: '',
  mortgageLenderLienholder: '',
  effectiveDate: '',
};

const requiredFields = [
  'condoUnitAddress',
  'yearBuildingBuilt',
  'constructionTypeOfBuilding',
  'squareFootageOfUnit',
  'unitOwnershipStatus',
  'hoaMasterPolicyCoverageType',
  'dwellingCoverageA',
  'personalPropertyCoverageC',
  'liabilityCoverageE',
  'deductible',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';

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

function HO6Form({ onBack }) {
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
    let normalizedValue = value;

    if ([
      'hoaMasterPolicyDeductible',
      'dwellingCoverageA',
      'personalPropertyCoverageC',
      'lossOfUseCoverageD',
      'lossAssessmentCoverage',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'kitchenRenovation' && value !== 'yes') {
      nextForm.kitchenRenovationDescription = '';
    }

    if (name === 'bathroomRenovation' && value !== 'yes') {
      nextForm.bathroomRenovationDescription = '';
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

  return (
    <section className="quote-request__form quote-request__product-form" ref={formRef}>
      <div className="quote-request__actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
        <button className="quote-request__inline-secondary" type="button" onClick={onBack}>
          Back to Insurance Selection
        </button>
      </div>

      <h3>Condo Owners Insurance (HO6) - Condominium Unit</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Optional fields improve condo rating accuracy and coverage matching.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Condo and Building Profile</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Condo / Unit Address (Including Unit Number) <span className="quote-request__required-mark">*</span></span>
            <input name="condoUnitAddress" value={formData.condoUnitAddress} onChange={handleChange} placeholder="Full address and unit number" className={fieldError('condoUnitAddress') ? 'quote-request__input--invalid' : ''} />
            {fieldError('condoUnitAddress') ? <span className="quote-request__validation-message">{fieldError('condoUnitAddress')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Building / Complex Name</span>
            <input name="buildingComplexName" value={formData.buildingComplexName} onChange={handleChange} placeholder="Building or complex name" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Year Building Built <span className="quote-request__required-mark">*</span></span>
            <input name="yearBuildingBuilt" value={formData.yearBuildingBuilt} onChange={handleChange} placeholder="YYYY" className={fieldError('yearBuildingBuilt') ? 'quote-request__input--invalid' : ''} />
            {fieldError('yearBuildingBuilt') ? <span className="quote-request__validation-message">{fieldError('yearBuildingBuilt')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Floor Number of Unit</span>
            <input name="floorNumberOfUnit" value={formData.floorNumberOfUnit} onChange={handleChange} placeholder="Floor number" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Total Floors in Building</span>
            <input name="totalFloorsInBuilding" value={formData.totalFloorsInBuilding} onChange={handleChange} placeholder="Total floors" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Construction Type of Building <span className="quote-request__required-mark">*</span></span>
            <select name="constructionTypeOfBuilding" value={formData.constructionTypeOfBuilding} onChange={handleChange} className={fieldError('constructionTypeOfBuilding') ? 'quote-request__input--invalid' : ''}>
              {CONSTRUCTION_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('constructionTypeOfBuilding') ? <span className="quote-request__validation-message">{fieldError('constructionTypeOfBuilding')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Square Footage of Unit <span className="quote-request__required-mark">*</span></span>
            <input name="squareFootageOfUnit" value={formData.squareFootageOfUnit} onChange={handleChange} placeholder="Square footage" className={fieldError('squareFootageOfUnit') ? 'quote-request__input--invalid' : ''} />
            {fieldError('squareFootageOfUnit') ? <span className="quote-request__validation-message">{fieldError('squareFootageOfUnit')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Number of Rooms</span>
            <input name="numberOfRooms" value={formData.numberOfRooms} onChange={handleChange} placeholder="Number of rooms" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Unit Ownership Status <span className="quote-request__required-mark">*</span></span>
            <select name="unitOwnershipStatus" value={formData.unitOwnershipStatus} onChange={handleChange} className={fieldError('unitOwnershipStatus') ? 'quote-request__input--invalid' : ''}>
              {UNIT_OWNERSHIP_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('unitOwnershipStatus') ? <span className="quote-request__validation-message">{fieldError('unitOwnershipStatus')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">HOA Master Policy Coverage Type <span className="quote-request__required-mark">*</span></span>
            <select name="hoaMasterPolicyCoverageType" value={formData.hoaMasterPolicyCoverageType} onChange={handleChange} className={fieldError('hoaMasterPolicyCoverageType') ? 'quote-request__input--invalid' : ''}>
              {HOA_MASTER_POLICY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('hoaMasterPolicyCoverageType') ? <span className="quote-request__validation-message">{fieldError('hoaMasterPolicyCoverageType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">HOA Master Policy Deductible</span>
            <input name="hoaMasterPolicyDeductible" value={formData.hoaMasterPolicyDeductible} onChange={handleChange} placeholder="0.00" inputMode="decimal" />
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">HOA Master Policy Carrier / Policy Number</span>
            <input name="hoaMasterPolicyCarrierPolicyNumber" value={formData.hoaMasterPolicyCarrierPolicyNumber} onChange={handleChange} placeholder="Carrier and policy number" />
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Unit Renovation and Interior Details</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Unit Fully Renovated?</span>
            <select name="unitFullyRenovated" value={formData.unitFullyRenovated} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Year of Last Renovation</span>
            <input name="yearOfLastRenovation" value={formData.yearOfLastRenovation} onChange={handleChange} placeholder="YYYY" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Kitchen Renovation?</span>
            <select name="kitchenRenovation" value={formData.kitchenRenovation} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.kitchenRenovation === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Kitchen Renovation Description</span>
              <textarea name="kitchenRenovationDescription" value={formData.kitchenRenovationDescription} onChange={handleChange} rows={3} placeholder="Describe upgrades and finishes" />
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Bathroom Renovation?</span>
            <select name="bathroomRenovation" value={formData.bathroomRenovation} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          {formData.bathroomRenovation === 'yes' ? (
            <label className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Bathroom Renovation Description</span>
              <textarea name="bathroomRenovationDescription" value={formData.bathroomRenovationDescription} onChange={handleChange} rows={3} placeholder="Describe fixtures and finishes" />
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">Flooring Type</span>
            <select name="flooringType" value={formData.flooringType} onChange={handleChange}>
              {FLOORING_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Special Upgrades / Betterments</span>
            <textarea name="specialUpgradesBetterments" value={formData.specialUpgradesBetterments} onChange={handleChange} rows={3} placeholder="Describe upgrades and estimated value" />
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage and Endorsements</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">Dwelling Coverage / Walls-In (Coverage A) <span className="quote-request__required-mark">*</span></span>
            <input name="dwellingCoverageA" value={formData.dwellingCoverageA} onChange={handleChange} placeholder="0.00" inputMode="decimal" className={fieldError('dwellingCoverageA') ? 'quote-request__input--invalid' : ''} />
            {fieldError('dwellingCoverageA') ? <span className="quote-request__validation-message">{fieldError('dwellingCoverageA')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Personal Property Coverage (Coverage C) <span className="quote-request__required-mark">*</span></span>
            <input name="personalPropertyCoverageC" value={formData.personalPropertyCoverageC} onChange={handleChange} placeholder="0.00" inputMode="decimal" className={fieldError('personalPropertyCoverageC') ? 'quote-request__input--invalid' : ''} />
            {fieldError('personalPropertyCoverageC') ? <span className="quote-request__validation-message">{fieldError('personalPropertyCoverageC')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Loss of Use / ALE (Coverage D)</span>
            <input name="lossOfUseCoverageD" value={formData.lossOfUseCoverageD} onChange={handleChange} placeholder="0.00 or % of A" inputMode="decimal" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Liability Coverage (Coverage E) <span className="quote-request__required-mark">*</span></span>
            <select name="liabilityCoverageE" value={formData.liabilityCoverageE} onChange={handleChange} className={fieldError('liabilityCoverageE') ? 'quote-request__input--invalid' : ''}>
              {LIABILITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('liabilityCoverageE') ? <span className="quote-request__validation-message">{fieldError('liabilityCoverageE')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Medical Payments (Coverage F)</span>
            <select name="medicalPaymentsCoverageF" value={formData.medicalPaymentsCoverageF} onChange={handleChange}>
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
            <span className="quote-request__field-label">Loss Assessment Coverage</span>
            <input name="lossAssessmentCoverage" value={formData.lossAssessmentCoverage} onChange={handleChange} placeholder="0.00" inputMode="decimal" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Water Backup Endorsement?</span>
            <select name="waterBackupEndorsement" value={formData.waterBackupEndorsement} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Scheduled Personal Property?</span>
            <select name="scheduledPersonalProperty" value={formData.scheduledPersonalProperty} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Earthquake Endorsement?</span>
            <select name="earthquakeEndorsement" value={formData.earthquakeEndorsement} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Mortgage Lender / Lienholder</span>
            <input name="mortgageLenderLienholder" value={formData.mortgageLenderLienholder} onChange={handleChange} placeholder="Lender and address details" />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Effective Date <span className="quote-request__required-mark">*</span></span>
            <input name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} className={fieldError('effectiveDate') ? 'quote-request__input--invalid' : ''} />
            {fieldError('effectiveDate') ? <span className="quote-request__validation-message">{fieldError('effectiveDate')}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleValidate}>Validate HO6 Form</button>
      </div>
    </section>
  );
}

export default HO6Form;
