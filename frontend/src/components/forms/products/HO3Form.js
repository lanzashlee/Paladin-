import React, { useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const PROPERTY_OWNERSHIP_OPTIONS = [
  { value: '', label: 'Select ownership status' },
  { value: 'owner-occupied', label: 'Owner-Occupied' },
  { value: 'owner-renter-occupied', label: 'Owner / Renter-Occupied' },
  { value: 'investment-rental', label: 'Investment / Rental' },
];

const OCCUPANCY_TYPE_OPTIONS = [
  { value: '', label: 'Select occupancy type' },
  { value: 'primary-residence', label: 'Primary Residence' },
  { value: 'secondary-vacation-home', label: 'Secondary / Vacation Home' },
  { value: 'seasonal', label: 'Seasonal' },
];

const STORIES_OPTIONS = [
  { value: '', label: 'Select number of stories' },
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '3+', label: '3+' },
];

const FOUNDATION_OPTIONS = [
  { value: '', label: 'Select foundation type' },
  { value: 'slab', label: 'Slab' },
  { value: 'crawlspace', label: 'Crawlspace' },
  { value: 'basement', label: 'Basement' },
  { value: 'raised-pier', label: 'Raised / Pier' },
  { value: 'hillside-stilts', label: 'Hillside / Stilts' },
];

const CONSTRUCTION_OPTIONS = [
  { value: '', label: 'Select construction type' },
  { value: 'frame-wood', label: 'Frame / Wood' },
  { value: 'masonry-stucco', label: 'Masonry / Stucco' },
  { value: 'brick-veneer', label: 'Brick Veneer' },
  { value: 'log', label: 'Log' },
  { value: 'superior', label: 'Superior' },
];

const EXTERIOR_WALL_OPTIONS = [
  { value: '', label: 'Select exterior wall material' },
  { value: 'wood-siding', label: 'Wood Siding' },
  { value: 'stucco', label: 'Stucco' },
  { value: 'brick', label: 'Brick' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'fiber-cement', label: 'Fiber Cement' },
  { value: 'other', label: 'Other' },
];

const ROOF_TYPE_OPTIONS = [
  { value: '', label: 'Select roof type' },
  { value: 'composition-asphalt-shingle', label: 'Composition / Asphalt Shingle' },
  { value: 'tile', label: 'Tile' },
  { value: 'metal', label: 'Metal' },
  { value: 'flat-tar', label: 'Flat / Tar' },
  { value: 'wood-shake', label: 'Wood Shake' },
  { value: 'slate', label: 'Slate' },
];

const ROOF_SHAPE_OPTIONS = [
  { value: '', label: 'Select roof shape' },
  { value: 'gable', label: 'Gable' },
  { value: 'hip', label: 'Hip' },
  { value: 'flat', label: 'Flat' },
  { value: 'gambrel', label: 'Gambrel' },
  { value: 'other', label: 'Other' },
];

const ROOF_CONDITION_OPTIONS = [
  { value: '', label: 'Select roof condition' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const BATHROOM_OPTIONS = [
  { value: '', label: 'Select number of bathrooms' },
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '3+', label: '3+' },
];

const GARAGE_TYPE_OPTIONS = [
  { value: '', label: 'Select garage type' },
  { value: 'attached', label: 'Attached' },
  { value: 'detached', label: 'Detached' },
  { value: 'carport', label: 'Carport' },
  { value: 'none', label: 'None' },
];

const GARAGE_CAPACITY_OPTIONS = [
  { value: '', label: 'Select garage capacity' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3+', label: '3+' },
];

const POOL_TYPE_OPTIONS = [
  { value: '', label: 'Select pool type' },
  { value: 'in-ground', label: 'In-Ground' },
  { value: 'above-ground', label: 'Above-Ground' },
];

const WOODSTOVE_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'none', label: 'None' },
  { value: 'masonry-fireplace', label: 'Masonry Fireplace' },
  { value: 'insert', label: 'Insert' },
  { value: 'woodstove', label: 'Woodstove' },
  { value: 'pellet-stove', label: 'Pellet Stove' },
];

const UNIT_OPTIONS = [
  { value: '', label: 'Select number of units' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
];

const ALARM_OPTIONS = [
  { value: '', label: 'Select alarm type' },
  { value: 'none', label: 'None' },
  { value: 'local', label: 'Local' },
  { value: 'central-station-monitored', label: 'Central Station Monitored' },
];

const SPRINKLER_OPTIONS = [
  { value: '', label: 'Select sprinkler system type' },
  { value: 'none', label: 'None' },
  { value: 'partial', label: 'Partial' },
  { value: 'full', label: 'Full' },
];

const LIABILITY_OPTIONS = [
  { value: '', label: 'Select liability coverage' },
  { value: '100000', label: '$100,000' },
  { value: '200000', label: '$200,000' },
  { value: '300000', label: '$300,000' },
  { value: '500000', label: '$500,000' },
];

const MED_PAY_OPTIONS = [
  { value: '', label: 'Select medical payments amount' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
  { value: '5000', label: '$5,000' },
];

const ALL_PERIL_OPTIONS = [
  { value: '', label: 'Select all-peril deductible' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
  { value: '2500', label: '$2,500' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
];

const WIND_HAIL_OPTIONS = [
  { value: '', label: 'Select wind/hail deductible' },
  { value: '1-percent-a', label: '1% of Coverage A' },
  { value: '2-percent-a', label: '2% of Coverage A' },
  { value: '5-percent-a', label: '5% of Coverage A' },
  { value: 'flat-dollar', label: 'Flat Dollar Amount' },
];

const ORDINANCE_OPTIONS = [
  { value: '', label: 'Select ordinance/law coverage' },
  { value: 'none', label: 'None' },
  { value: '10-percent-a', label: '10% of Coverage A' },
  { value: '25-percent-a', label: '25% of Coverage A' },
  { value: '50-percent-a', label: '50% of Coverage A' },
];

const initialForm = {
  insuredStreet: '',
  insuredCity: '',
  insuredState: '',
  insuredZip: '',
  county: '',
  propertyOwnershipStatus: '',
  occupancyType: '',
  yearsOwned: '',
  purchaseDate: '',
  purchasePrice: '',
  yearBuilt: '',
  squareFootage: '',
  numberOfStories: '',
  foundationType: '',
  constructionType: '',
  exteriorWallMaterial: '',
  roofTypeMaterial: '',
  roofShape: '',
  roofAge: '',
  roofCondition: '',
  numberOfBathrooms: '',
  garageType: '',
  garageCapacity: '',
  poolOnProperty: '',
  poolType: '',
  poolFencedSecured: '',
  trampolineOnProperty: '',
  dogsOnProperty: '',
  dogBreedAndNumber: '',
  priorDogBiteHistory: '',
  businessConductedOnPremises: '',
  typeOfBusiness: '',
  woodstoveFireplace: '',
  oilTankOnProperty: '',
  solarPanelsInstalled: '',
  numberOfUnitsOnProperty: '',
  centralBurglarAlarm: '',
  centralFireAlarm: '',
  smokeDetectors: '',
  sprinklerSystem: '',
  deadboltLocks: '',
  gatedCommunity: '',
  fireExtinguisherOnPremises: '',
  stormShuttersHurricaneClips: '',
  femaFloodZoneClassification: '',
  wildfireRiskZone: '',
  requestedDwellingCoverage: '',
  useBuiltInReplacementCostEstimator: '',
  otherStructuresCoverage: '',
  personalPropertyCoverage: '',
  lossOfUseCoverage: '',
  liabilityCoverage: '',
  medicalPayments: '',
  allPerilDeductible: '',
  windHailDeductible: '',
  waterBackupSewerEndorsement: '',
  equipmentBreakdownCoverage: '',
  scheduledPersonalProperty: '',
  identityTheftCoverage: '',
  serviceLineCoverage: '',
  inflationGuardCoverage: '',
  ordinanceLawCoverage: '',
  earthquakeCoverage: '',
  floodCoverage: '',
  mortgageLenderName: '',
  mortgageLenderLoanNumber: '',
  mortgageLenderAddress: '',
  effectiveDateRequested: '',
};

const requiredFields = [
  'insuredStreet',
  'insuredCity',
  'insuredState',
  'insuredZip',
  'county',
  'propertyOwnershipStatus',
  'occupancyType',
  'yearBuilt',
  'squareFootage',
  'numberOfStories',
  'foundationType',
  'constructionType',
  'exteriorWallMaterial',
  'roofTypeMaterial',
  'roofAge',
  'numberOfBathrooms',
  'poolOnProperty',
  'trampolineOnProperty',
  'dogsOnProperty',
  'priorDogBiteHistory',
  'businessConductedOnPremises',
  'numberOfUnitsOnProperty',
  'requestedDwellingCoverage',
  'liabilityCoverage',
  'allPerilDeductible',
  'effectiveDateRequested',
];

const isBlank = (value) => String(value ?? '').trim() === '';
const isFourDigitYear = (value) => /^\d{4}$/.test(String(value || '').trim());
const isDigitsOnly = (value) => /^\d+$/.test(String(value || '').trim());

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

const normalizeUsZipDigits = (value = '') => String(value).replace(/\D/g, '').slice(0, 9);
const formatUsZipDisplay = (value = '') => {
  const digits = normalizeUsZipDigits(value);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};
const isValidUsZipFormat = (value = '') => /^\d{5}(-\d{4})?$/.test(String(value || '').trim());

const getTodayIsoDate = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

function HO3Form({ onBack }) {
  const todayIsoDate = getTodayIsoDate();
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

    if (nextForm.insuredZip && !isValidUsZipFormat(nextForm.insuredZip)) {
      nextErrors.insuredZip = 'Please enter a valid US ZIP (12345 or 12345-6789).';
    }

    if (nextForm.yearBuilt && !isFourDigitYear(nextForm.yearBuilt)) {
      nextErrors.yearBuilt = 'Please enter a valid 4-digit year.';
    }

    if (nextForm.squareFootage && !isDigitsOnly(nextForm.squareFootage)) {
      nextErrors.squareFootage = 'Please enter numbers only.';
    }

    if (nextForm.roofAge && !isFourDigitYear(nextForm.roofAge)) {
      nextErrors.roofAge = 'Please enter a valid 4-digit year.';
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
      'purchasePrice',
      'requestedDwellingCoverage',
      'otherStructuresCoverage',
      'personalPropertyCoverage',
      'lossOfUseCoverage',
    ].includes(name)) {
      normalizedValue = formatCurrencyInput(value);
    } else if (name === 'yearsOwned') {
      normalizedValue = String(value).replace(/\D/g, '');
    } else if (name === 'insuredZip') {
      normalizedValue = formatUsZipDisplay(value);
    } else if (['yearBuilt', 'squareFootage', 'roofAge'].includes(name)) {
      normalizedValue = String(value).replace(/\D/g, '');
    }

    const nextForm = {
      ...formData,
      [name]: normalizedValue,
    };

    if (name === 'poolOnProperty' && value !== 'yes') {
      nextForm.poolType = '';
      nextForm.poolFencedSecured = '';
    }

    if (name === 'businessConductedOnPremises' && value !== 'yes') {
      nextForm.typeOfBusiness = '';
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

      <h3>Homeowners Insurance (HO3) - Single-Family Home</h3>
      <p className="quote-request__form-intro">
        Complete all required fields below. Optional fields improve quote accuracy and reduce follow-up calls.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Property and Occupancy</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Insured Property Street Address <span className="quote-request__required-mark">*</span></span>
            <input name="insuredStreet" value={formData.insuredStreet} onChange={handleChange} placeholder="Street address" className={fieldError('insuredStreet') ? 'quote-request__input--invalid' : ''} />
            {fieldError('insuredStreet') ? <span className="quote-request__validation-message">{fieldError('insuredStreet')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">City <span className="quote-request__required-mark">*</span></span>
            <input name="insuredCity" value={formData.insuredCity} onChange={handleChange} placeholder="City" className={fieldError('insuredCity') ? 'quote-request__input--invalid' : ''} />
            {fieldError('insuredCity') ? <span className="quote-request__validation-message">{fieldError('insuredCity')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">State <span className="quote-request__required-mark">*</span></span>
            <input name="insuredState" value={formData.insuredState} onChange={handleChange} placeholder="State" className={fieldError('insuredState') ? 'quote-request__input--invalid' : ''} />
            {fieldError('insuredState') ? <span className="quote-request__validation-message">{fieldError('insuredState')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">ZIP <span className="quote-request__required-mark">*</span></span>
            <input name="insuredZip" value={formData.insuredZip} onChange={handleChange} placeholder="ZIP" inputMode="numeric" maxLength={10} pattern="\d{5}(-\d{4})?" className={fieldError('insuredZip') ? 'quote-request__input--invalid' : ''} />
            {fieldError('insuredZip') ? <span className="quote-request__validation-message">{fieldError('insuredZip')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">County <span className="quote-request__required-mark">*</span></span>
            <input name="county" value={formData.county} onChange={handleChange} placeholder="County" className={fieldError('county') ? 'quote-request__input--invalid' : ''} />
            {fieldError('county') ? <span className="quote-request__validation-message">{fieldError('county')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Property Ownership Status <span className="quote-request__required-mark">*</span></span>
            <select name="propertyOwnershipStatus" value={formData.propertyOwnershipStatus} onChange={handleChange} className={fieldError('propertyOwnershipStatus') ? 'quote-request__input--invalid' : ''}>
              {PROPERTY_OWNERSHIP_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('propertyOwnershipStatus') ? <span className="quote-request__validation-message">{fieldError('propertyOwnershipStatus')}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Occupancy Type <span className="quote-request__required-mark">*</span></span>
            <select name="occupancyType" value={formData.occupancyType} onChange={handleChange} className={fieldError('occupancyType') ? 'quote-request__input--invalid' : ''}>
              {OCCUPANCY_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}
            </select>
            {fieldError('occupancyType') ? <span className="quote-request__validation-message">{fieldError('occupancyType')}</span> : null}
          </label>

          <label className="quote-request__field"><span className="quote-request__field-label">Years Owned</span><input name="yearsOwned" value={formData.yearsOwned} onChange={handleChange} placeholder="Years owned" inputMode="numeric" pattern="\d*" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Purchase Date</span><input name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} max={todayIsoDate} /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Purchase Price</span><input name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} placeholder="0.00" inputMode="decimal" /></label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Construction Details</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field"><span className="quote-request__field-label">Year Built <span className="quote-request__required-mark">*</span></span><input name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} placeholder="YYYY" inputMode="numeric" maxLength={4} pattern="\d{4}" className={fieldError('yearBuilt') ? 'quote-request__input--invalid' : ''} />{fieldError('yearBuilt') ? <span className="quote-request__validation-message">{fieldError('yearBuilt')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Square Footage (Heated) <span className="quote-request__required-mark">*</span></span><input name="squareFootage" value={formData.squareFootage} onChange={handleChange} placeholder="Square footage" inputMode="numeric" pattern="\d+" className={fieldError('squareFootage') ? 'quote-request__input--invalid' : ''} />{fieldError('squareFootage') ? <span className="quote-request__validation-message">{fieldError('squareFootage')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Number of Stories <span className="quote-request__required-mark">*</span></span><select name="numberOfStories" value={formData.numberOfStories} onChange={handleChange} className={fieldError('numberOfStories') ? 'quote-request__input--invalid' : ''}>{STORIES_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('numberOfStories') ? <span className="quote-request__validation-message">{fieldError('numberOfStories')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Foundation Type <span className="quote-request__required-mark">*</span></span><select name="foundationType" value={formData.foundationType} onChange={handleChange} className={fieldError('foundationType') ? 'quote-request__input--invalid' : ''}>{FOUNDATION_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('foundationType') ? <span className="quote-request__validation-message">{fieldError('foundationType')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Construction Type / Frame <span className="quote-request__required-mark">*</span></span><select name="constructionType" value={formData.constructionType} onChange={handleChange} className={fieldError('constructionType') ? 'quote-request__input--invalid' : ''}>{CONSTRUCTION_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('constructionType') ? <span className="quote-request__validation-message">{fieldError('constructionType')}</span> : null}</label>

          <label className="quote-request__field"><span className="quote-request__field-label">Exterior Wall Material <span className="quote-request__required-mark">*</span></span><select name="exteriorWallMaterial" value={formData.exteriorWallMaterial} onChange={handleChange} className={fieldError('exteriorWallMaterial') ? 'quote-request__input--invalid' : ''}>{EXTERIOR_WALL_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('exteriorWallMaterial') ? <span className="quote-request__validation-message">{fieldError('exteriorWallMaterial')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Roof Type (Material) <span className="quote-request__required-mark">*</span></span><select name="roofTypeMaterial" value={formData.roofTypeMaterial} onChange={handleChange} className={fieldError('roofTypeMaterial') ? 'quote-request__input--invalid' : ''}>{ROOF_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('roofTypeMaterial') ? <span className="quote-request__validation-message">{fieldError('roofTypeMaterial')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Roof Shape</span><select name="roofShape" value={formData.roofShape} onChange={handleChange}>{ROOF_SHAPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Roof Age (Year Last Replaced) <span className="quote-request__required-mark">*</span></span><input name="roofAge" value={formData.roofAge} onChange={handleChange} placeholder="YYYY" inputMode="numeric" maxLength={4} pattern="\d{4}" className={fieldError('roofAge') ? 'quote-request__input--invalid' : ''} />{fieldError('roofAge') ? <span className="quote-request__validation-message">{fieldError('roofAge')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Roof Condition</span><select name="roofCondition" value={formData.roofCondition} onChange={handleChange}>{ROOF_CONDITION_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Number of Bathrooms <span className="quote-request__required-mark">*</span></span><select name="numberOfBathrooms" value={formData.numberOfBathrooms} onChange={handleChange} className={fieldError('numberOfBathrooms') ? 'quote-request__input--invalid' : ''}>{BATHROOM_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('numberOfBathrooms') ? <span className="quote-request__validation-message">{fieldError('numberOfBathrooms')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Garage Type</span><select name="garageType" value={formData.garageType} onChange={handleChange}>{GARAGE_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Garage Capacity (# of Cars)</span><select name="garageCapacity" value={formData.garageCapacity} onChange={handleChange}>{GARAGE_CAPACITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Liability and Property Exposures</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field"><span className="quote-request__field-label">Pool on Property? <span className="quote-request__required-mark">*</span></span><select name="poolOnProperty" value={formData.poolOnProperty} onChange={handleChange} className={fieldError('poolOnProperty') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('poolOnProperty') ? <span className="quote-request__validation-message">{fieldError('poolOnProperty')}</span> : null}</label>
          {formData.poolOnProperty === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Pool Type</span><select name="poolType" value={formData.poolType} onChange={handleChange}>{POOL_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label> : null}
          {formData.poolOnProperty === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Pool Fenced / Secured?</span><select name="poolFencedSecured" value={formData.poolFencedSecured} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label> : null}

          <label className="quote-request__field"><span className="quote-request__field-label">Trampoline on Property? <span className="quote-request__required-mark">*</span></span><select name="trampolineOnProperty" value={formData.trampolineOnProperty} onChange={handleChange} className={fieldError('trampolineOnProperty') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('trampolineOnProperty') ? <span className="quote-request__validation-message">{fieldError('trampolineOnProperty')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Dogs on Property? <span className="quote-request__required-mark">*</span></span><select name="dogsOnProperty" value={formData.dogsOnProperty} onChange={handleChange} className={fieldError('dogsOnProperty') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('dogsOnProperty') ? <span className="quote-request__validation-message">{fieldError('dogsOnProperty')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Dog Breed(s) and Number</span><input name="dogBreedAndNumber" value={formData.dogBreedAndNumber} onChange={handleChange} placeholder="Breed(s) and count" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Prior Dog Bite History? <span className="quote-request__required-mark">*</span></span><select name="priorDogBiteHistory" value={formData.priorDogBiteHistory} onChange={handleChange} className={fieldError('priorDogBiteHistory') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorDogBiteHistory') ? <span className="quote-request__validation-message">{fieldError('priorDogBiteHistory')}</span> : null}</label>

          <label className="quote-request__field"><span className="quote-request__field-label">Business Conducted on Premises? <span className="quote-request__required-mark">*</span></span><select name="businessConductedOnPremises" value={formData.businessConductedOnPremises} onChange={handleChange} className={fieldError('businessConductedOnPremises') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('businessConductedOnPremises') ? <span className="quote-request__validation-message">{fieldError('businessConductedOnPremises')}</span> : null}</label>
          {formData.businessConductedOnPremises === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Type of Business</span><input name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange} placeholder="Business type" /></label> : null}

          <label className="quote-request__field"><span className="quote-request__field-label">Woodstove / Fireplace?</span><select name="woodstoveFireplace" value={formData.woodstoveFireplace} onChange={handleChange}>{WOODSTOVE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Oil Tank on Property?</span><select name="oilTankOnProperty" value={formData.oilTankOnProperty} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Solar Panels Installed?</span><select name="solarPanelsInstalled" value={formData.solarPanelsInstalled} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Number of Units on Property <span className="quote-request__required-mark">*</span></span><select name="numberOfUnitsOnProperty" value={formData.numberOfUnitsOnProperty} onChange={handleChange} className={fieldError('numberOfUnitsOnProperty') ? 'quote-request__input--invalid' : ''}>{UNIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('numberOfUnitsOnProperty') ? <span className="quote-request__validation-message">{fieldError('numberOfUnitsOnProperty')}</span> : null}</label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Protection and Hazard Details</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field"><span className="quote-request__field-label">Central Burglar Alarm?</span><select name="centralBurglarAlarm" value={formData.centralBurglarAlarm} onChange={handleChange}>{ALARM_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Central Fire Alarm?</span><select name="centralFireAlarm" value={formData.centralFireAlarm} onChange={handleChange}>{ALARM_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Smoke Detectors?</span><select name="smokeDetectors" value={formData.smokeDetectors} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Sprinkler System?</span><select name="sprinklerSystem" value={formData.sprinklerSystem} onChange={handleChange}>{SPRINKLER_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Deadbolt Locks?</span><select name="deadboltLocks" value={formData.deadboltLocks} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Gated Community?</span><select name="gatedCommunity" value={formData.gatedCommunity} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Fire Extinguisher on Premises?</span><select name="fireExtinguisherOnPremises" value={formData.fireExtinguisherOnPremises} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Storm Shutters / Hurricane Clips?</span><select name="stormShuttersHurricaneClips" value={formData.stormShuttersHurricaneClips} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">FEMA Flood Zone Classification</span><input name="femaFloodZoneClassification" value={formData.femaFloodZoneClassification} onChange={handleChange} placeholder="e.g., X, AE, VE" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Wildfire Risk Zone (CA)</span><input name="wildfireRiskZone" value={formData.wildfireRiskZone} onChange={handleChange} placeholder="e.g., Low, Moderate, High" /></label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Coverage and Deductibles</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field"><span className="quote-request__field-label">Requested Dwelling Coverage (A) <span className="quote-request__required-mark">*</span></span><input name="requestedDwellingCoverage" value={formData.requestedDwellingCoverage} onChange={handleChange} placeholder="0.00" inputMode="decimal" className={fieldError('requestedDwellingCoverage') ? 'quote-request__input--invalid' : ''} />{fieldError('requestedDwellingCoverage') ? <span className="quote-request__validation-message">{fieldError('requestedDwellingCoverage')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Use Built-In Replacement Cost Estimator?</span><select name="useBuiltInReplacementCostEstimator" value={formData.useBuiltInReplacementCostEstimator} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Other Structures Coverage (B)</span><input name="otherStructuresCoverage" value={formData.otherStructuresCoverage} onChange={handleChange} placeholder="0.00 or % of A" inputMode="decimal" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Personal Property Coverage (C)</span><input name="personalPropertyCoverage" value={formData.personalPropertyCoverage} onChange={handleChange} placeholder="0.00 or % of A" inputMode="decimal" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Loss of Use Coverage (D)</span><input name="lossOfUseCoverage" value={formData.lossOfUseCoverage} onChange={handleChange} placeholder="0.00 or % of A" inputMode="decimal" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Liability Coverage (E) <span className="quote-request__required-mark">*</span></span><select name="liabilityCoverage" value={formData.liabilityCoverage} onChange={handleChange} className={fieldError('liabilityCoverage') ? 'quote-request__input--invalid' : ''}>{LIABILITY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('liabilityCoverage') ? <span className="quote-request__validation-message">{fieldError('liabilityCoverage')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Medical Payments (F)</span><select name="medicalPayments" value={formData.medicalPayments} onChange={handleChange}>{MED_PAY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">All-Peril Deductible <span className="quote-request__required-mark">*</span></span><select name="allPerilDeductible" value={formData.allPerilDeductible} onChange={handleChange} className={fieldError('allPerilDeductible') ? 'quote-request__input--invalid' : ''}>{ALL_PERIL_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('allPerilDeductible') ? <span className="quote-request__validation-message">{fieldError('allPerilDeductible')}</span> : null}</label>
          <label className="quote-request__field"><span className="quote-request__field-label">Wind / Hail Deductible (If Separate)</span><select name="windHailDeductible" value={formData.windHailDeductible} onChange={handleChange}>{WIND_HAIL_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Water Backup / Sewer Endorsement?</span><select name="waterBackupSewerEndorsement" value={formData.waterBackupSewerEndorsement} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Equipment Breakdown Coverage?</span><select name="equipmentBreakdownCoverage" value={formData.equipmentBreakdownCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Scheduled Personal Property?</span><select name="scheduledPersonalProperty" value={formData.scheduledPersonalProperty} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Identity Theft Coverage?</span><select name="identityTheftCoverage" value={formData.identityTheftCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Service Line Coverage?</span><select name="serviceLineCoverage" value={formData.serviceLineCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Inflation Guard / Guaranteed Replacement Cost?</span><select name="inflationGuardCoverage" value={formData.inflationGuardCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Ordinance or Law Coverage?</span><select name="ordinanceLawCoverage" value={formData.ordinanceLawCoverage} onChange={handleChange}>{ORDINANCE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Earthquake Coverage (Separate Policy / Endorsement)?</span><select name="earthquakeCoverage" value={formData.earthquakeCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Flood Coverage (Separate Policy)?</span><select name="floodCoverage" value={formData.floodCoverage} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Mortgage Lender Name</span><input name="mortgageLenderName" value={formData.mortgageLenderName} onChange={handleChange} placeholder="Lender name" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Mortgage Lender Loan Number</span><input name="mortgageLenderLoanNumber" value={formData.mortgageLenderLoanNumber} onChange={handleChange} placeholder="Loan number" /></label>
          <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Mortgage Lender Address</span><input name="mortgageLenderAddress" value={formData.mortgageLenderAddress} onChange={handleChange} placeholder="Lender address" /></label>
          <label className="quote-request__field"><span className="quote-request__field-label">Effective Date Requested <span className="quote-request__required-mark">*</span></span><input name="effectiveDateRequested" type="date" value={formData.effectiveDateRequested} onChange={handleChange} className={fieldError('effectiveDateRequested') ? 'quote-request__input--invalid' : ''} />{fieldError('effectiveDateRequested') ? <span className="quote-request__validation-message">{fieldError('effectiveDateRequested')}</span> : null}</label>
        </div>
      </div>

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleContinue}>Validate HO3 Form</button>
      </div>
    </section>
  );
}

export default HO3Form;
