import React, { useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Select property type' },
  { value: 'single-family-ho3', label: 'Single-Family (HO3)' },
  { value: 'condo-ho6', label: 'Condo (HO6)' },
  { value: 'renters-ho4', label: 'Renters (HO4)' },
  { value: 'mobile-home', label: 'Mobile Home' },
  { value: 'commercial', label: 'Commercial' },
];

const STORIES_OPTIONS = [
  { value: '', label: 'Select stories / height' },
  { value: '1-story', label: '1 story' },
  { value: '2-story', label: '2 stories' },
  { value: '3-story', label: '3 stories' },
  { value: '4-plus-story', label: '4+ stories' },
  { value: 'mid-rise', label: 'Mid-rise building' },
  { value: 'high-rise', label: 'High-rise building' },
];

const CONSTRUCTION_TYPE_OPTIONS = [
  { value: '', label: 'Select construction type' },
  { value: 'wood-frame', label: 'Wood Frame' },
  { value: 'masonry-unreinforced', label: 'Masonry (Unreinforced)' },
  { value: 'masonry-reinforced', label: 'Masonry (Reinforced)' },
  { value: 'concrete-tilt-up', label: 'Concrete Tilt-Up' },
  { value: 'concrete-moment-frame', label: 'Concrete Moment Frame' },
  { value: 'steel-frame', label: 'Steel Frame' },
];

const FOUNDATION_TYPE_OPTIONS = [
  { value: '', label: 'Select foundation type' },
  { value: 'slab-on-grade', label: 'Slab-on-Grade' },
  { value: 'raised-cripple-wall', label: 'Raised / Cripple Wall' },
  { value: 'basement', label: 'Basement' },
  { value: 'hillside-soft-story', label: 'Hillside / Soft-Story' },
  { value: 'pile-pier', label: 'Pile / Pier' },
  { value: 'post-and-beam', label: 'Post-and-Beam' },
];

const RETROFIT_TYPE_OPTIONS = [
  { value: '', label: 'Select retrofit type' },
  { value: 'cripple-wall-bracing', label: 'Cripple Wall Bracing' },
  { value: 'slab-bolting', label: 'Slab Bolting' },
  { value: 'both', label: 'Both' },
  { value: 'other', label: 'Other' },
];

const DEDUCTIBLE_OPTIONS = [
  { value: '', label: 'Select deductible' },
  { value: '5-percent', label: '5%' },
  { value: '10-percent', label: '10%' },
  { value: '15-percent', label: '15%' },
  { value: '20-percent', label: '20%' },
  { value: '25-percent', label: '25%' },
];

const LOSS_OF_USE_DEDUCTIBLE_OPTIONS = [
  { value: '', label: 'Select waiting period' },
  { value: '0-days', label: '0 days' },
  { value: '7-days', label: '7 days' },
  { value: '14-days', label: '14 days' },
];

const initialForm = {
  propertyAddress: '',
  propertyType: '',
  yearBuilt: '',
  storiesBuildingHeight: '',
  constructionType: '',
  foundationType: '',
  hasSeismicRetrofit: '',
  retrofitType: '',
  hillsideProperty: '',
  yearOfLastMajorRenovation: '',
  softStoryBuilding: '',
  dwellingReplacementCostCoverageA: '',
  personalPropertyCoverage: '',
  buildingCodeUpgradeCoverage: '',
  additionalLivingExpenseLossOfUse: '',
  deductiblePercentCoverageA: '',
  lossOfUseDeductible: '',
  effectiveDate: '',
};

const requiredFields = [
  'propertyAddress',
  'propertyType',
  'yearBuilt',
  'storiesBuildingHeight',
  'constructionType',
  'foundationType',
  'hasSeismicRetrofit',
  'hillsideProperty',
  'dwellingReplacementCostCoverageA',
  'deductiblePercentCoverageA',
  'effectiveDate',
];

const currencyFields = new Set([
  'dwellingReplacementCostCoverageA',
  'personalPropertyCoverage',
  'buildingCodeUpgradeCoverage',
  'additionalLivingExpenseLossOfUse',
]);

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

function EarthquakeForm({ onBack }) {
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

    if (name === 'hasSeismicRetrofit' && value !== 'yes') {
      nextForm.retrofitType = '';
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

      <h3>Earthquake Insurance</h3>
      <p className="quote-request__form-intro">
        Complete the required fields for earthquake underwriting. Optional fields help improve pricing and carrier fit.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Property and Seismic Profile</h4>
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
            <span className="quote-request__field-label">
              Stories / Building Height <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="storiesBuildingHeight"
              value={formData.storiesBuildingHeight}
              onChange={handleChange}
              className={fieldError('storiesBuildingHeight') ? 'quote-request__input--invalid' : ''}
            >
              {STORIES_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('storiesBuildingHeight') ? <span className="quote-request__validation-message">{fieldError('storiesBuildingHeight')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Construction Type <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="constructionType"
              value={formData.constructionType}
              onChange={handleChange}
              className={fieldError('constructionType') ? 'quote-request__input--invalid' : ''}
            >
              {CONSTRUCTION_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('constructionType') ? <span className="quote-request__validation-message">{fieldError('constructionType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Foundation Type <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="foundationType"
              value={formData.foundationType}
              onChange={handleChange}
              className={fieldError('foundationType') ? 'quote-request__input--invalid' : ''}
            >
              {FOUNDATION_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('foundationType') ? <span className="quote-request__validation-message">{fieldError('foundationType')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Has the Property Been Seismically Retrofitted? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="hasSeismicRetrofit"
              value={formData.hasSeismicRetrofit}
              onChange={handleChange}
              className={fieldError('hasSeismicRetrofit') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('hasSeismicRetrofit') ? <span className="quote-request__validation-message">{fieldError('hasSeismicRetrofit')}</span> : null}
          </label>

          {formData.hasSeismicRetrofit === 'yes' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Retrofit Type (if yes)</span>
              <select name="retrofitType" value={formData.retrofitType} onChange={handleChange}>
                {RETROFIT_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
              </select>
            </label>
          ) : null}

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Hillside Property? <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="hillsideProperty"
              value={formData.hillsideProperty}
              onChange={handleChange}
              className={fieldError('hillsideProperty') ? 'quote-request__input--invalid' : ''}
            >
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('hillsideProperty') ? <span className="quote-request__validation-message">{fieldError('hillsideProperty')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Year of Last Major Renovation</span>
            <input
              name="yearOfLastMajorRenovation"
              value={formData.yearOfLastMajorRenovation}
              onChange={handleChange}
              placeholder="YYYY"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Soft-Story Building?</span>
            <select name="softStoryBuilding" value={formData.softStoryBuilding} onChange={handleChange}>
              {YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage and Deductibles</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Dwelling Replacement Cost (Coverage A) <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="dwellingReplacementCostCoverageA"
              value={formData.dwellingReplacementCostCoverageA}
              onChange={handleChange}
              placeholder="0.00"
              inputMode="decimal"
              className={fieldError('dwellingReplacementCostCoverageA') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('dwellingReplacementCostCoverageA') ? <span className="quote-request__validation-message">{fieldError('dwellingReplacementCostCoverageA')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Personal Property Coverage</span>
            <input
              name="personalPropertyCoverage"
              value={formData.personalPropertyCoverage}
              onChange={handleChange}
              placeholder="0.00"
              inputMode="decimal"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Building Code Upgrade Coverage</span>
            <input
              name="buildingCodeUpgradeCoverage"
              value={formData.buildingCodeUpgradeCoverage}
              onChange={handleChange}
              placeholder="0.00 or coverage selection"
              inputMode="decimal"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Additional Living Expense / Loss of Use</span>
            <input
              name="additionalLivingExpenseLossOfUse"
              value={formData.additionalLivingExpenseLossOfUse}
              onChange={handleChange}
              placeholder="0.00 or coverage selection"
              inputMode="decimal"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Deductible (% of Coverage A) <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="deductiblePercentCoverageA"
              value={formData.deductiblePercentCoverageA}
              onChange={handleChange}
              className={fieldError('deductiblePercentCoverageA') ? 'quote-request__input--invalid' : ''}
            >
              {DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('deductiblePercentCoverageA') ? <span className="quote-request__validation-message">{fieldError('deductiblePercentCoverageA')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Loss of Use Deductible</span>
            <select name="lossOfUseDeductible" value={formData.lossOfUseDeductible} onChange={handleChange}>
              {LOSS_OF_USE_DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
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
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleContinue}>Validate Earthquake Form</button>
      </div>
    </section>
  );
}

export default EarthquakeForm;
