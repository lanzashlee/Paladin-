import React, { useRef, useState } from 'react';

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
  { value: '1m-2m', label: '$1M / $2M' },
  { value: '2m-2m', label: '$2M / $2M' },
  { value: 'other', label: 'Other' },
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

const requiredFields = [
  'fullNameOrBusinessName',
  'dateOfBirthOrEin',
  'address',
  'umbrellaPolicyType',
  'duiOrSeriousViolationsAnyDriver',
  'priorUmbrellaClaimsPast5Years',
  'umbrellaLimit',
  'effectiveDate',
];

const isBlank = (value) => String(value ?? '').trim() === '';

function UmbrellaForm({ onBack }) {
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
    const nextForm = {
      ...formData,
      [name]: value,
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
              Address <span className="quote-request__required-mark">*</span>
            </span>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, city, state, ZIP"
              className={fieldError('address') ? 'quote-request__input--invalid' : ''}
            />
            {fieldError('address') ? <span className="quote-request__validation-message">{fieldError('address')}</span> : null}
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
          <label className="quote-request__field"><span className="quote-request__field-label">Underlying Homeowners Liability Limit</span><input name="underlyingHomeownersLiabilityLimit" value={formData.underlyingHomeownersLiabilityLimit} onChange={handleChange} placeholder="e.g., 300,000 or 500,000" /></label>
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
          {formData.rentalPropertiesOwned === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Number of Rental Units</span><input name="rentalPropertiesCount" value={formData.rentalPropertiesCount} onChange={handleChange} placeholder="Number of units" /></label> : null}

          <label className="quote-request__field"><span className="quote-request__field-label">Number of Drivers in Household (Personal)</span><input name="numberOfDriversInHousehold" value={formData.numberOfDriversInHousehold} onChange={handleChange} placeholder="Driver count" /></label>
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
          {formData.priorUmbrellaClaimsPast5Years === 'yes' ? <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Prior Umbrella Claim Details</span><input name="priorUmbrellaClaimsDetails" value={formData.priorUmbrellaClaimsDetails} onChange={handleChange} placeholder="Date, amount, and description" /></label> : null}

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
        <button type="button" onClick={handleContinue}>Validate Umbrella Form</button>
      </div>
    </section>
  );
}

export default UmbrellaForm;
