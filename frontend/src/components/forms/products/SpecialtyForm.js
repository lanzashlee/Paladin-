import React, { useMemo, useRef, useState } from 'react';

const REQUIRED_MESSAGE = 'This field is required.';

const YES_NO_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const SPECIALTY_TYPE_OPTIONS = [
  { value: '', label: 'Select specialty product' },
  { value: 'cyber', label: 'Cyber Liability' },
  { value: 'eo', label: 'Professional Liability (E&O)' },
  { value: 'inland-marine', label: 'Inland Marine' },
  { value: 'surety-bond', label: 'Surety Bond' },
  { value: 'pet', label: 'Pet Insurance' },
];

const initialForm = {
  specialtyType: '',
  legalBusinessName: '',
  industryBusinessType: '',
  annualRevenue: '',
  recordsContainingPii: '',
  typesOfDataStored: '',
  annualItSecurityBudget: '',
  mfaImplemented: '',
  edrSoftware: '',
  dataBackupProcedures: '',
  encryptionSensitiveData: '',
  priorCyberIncidentsClaims: '',
  priorCyberIncidentsDetails: '',
  annualRansomwareDemandLimit: '',
  businessName: '',
  professionServiceType: '',
  yearsInPractice: '',
  numberLicensedProfessionals: '',
  annualRevenueProfessionalServices: '',
  priorEoClaims: '',
  priorEoClaimsDetails: '',
  servicesProvidedOutsideUs: '',
  retroactiveDateRequested: '',
  equipmentPropertyType: '',
  scheduleOfItems: '',
  totalInsuredValue: '',
  storageLocations: '',
  inTransitOrStored: '',
  priorInlandMarineClaims: '',
  bondTypeRequested: '',
  obligeeName: '',
  bondAmountPenalSum: '',
  purposeOfBond: '',
  bondTermDuration: '',
  principalPersonalCreditScore: '',
  businessFinancialStatements: '',
  priorBondClaimsDefault: '',
  petName: '',
  petSpecies: '',
  petBreed: '',
  petAge: '',
  petGender: '',
  petWeight: '',
  petColorMarkings: '',
  microchipped: '',
  priorVeterinaryConditions: '',
  priorVeterinaryConditionsDetails: '',
  coverageType: '',
  annualDeductible: '',
  reimbursementPercentage: '',
  annualBenefitLimit: '',
  veterinarianClinic: '',
};

const requiredBySpecialty = {
  cyber: [
    'legalBusinessName',
    'industryBusinessType',
    'annualRevenue',
    'recordsContainingPii',
    'typesOfDataStored',
    'mfaImplemented',
    'dataBackupProcedures',
    'encryptionSensitiveData',
    'priorCyberIncidentsClaims',
  ],
  eo: [
    'businessName',
    'professionServiceType',
    'yearsInPractice',
    'numberLicensedProfessionals',
    'annualRevenueProfessionalServices',
    'priorEoClaims',
    'retroactiveDateRequested',
  ],
  'inland-marine': [
    'equipmentPropertyType',
    'scheduleOfItems',
    'totalInsuredValue',
    'storageLocations',
    'inTransitOrStored',
  ],
  'surety-bond': [
    'bondTypeRequested',
    'obligeeName',
    'bondAmountPenalSum',
    'purposeOfBond',
    'bondTermDuration',
    'principalPersonalCreditScore',
    'priorBondClaimsDefault',
  ],
  pet: [
    'petName',
    'petSpecies',
    'petBreed',
    'petAge',
    'petGender',
    'priorVeterinaryConditions',
    'coverageType',
    'annualDeductible',
    'reimbursementPercentage',
    'annualBenefitLimit',
  ],
};

const currencyFields = new Set([
  'annualRevenue',
  'annualItSecurityBudget',
  'annualRansomwareDemandLimit',
  'annualRevenueProfessionalServices',
  'totalInsuredValue',
  'bondAmountPenalSum',
  'annualBenefitLimit',
]);

const isBlank = (value) => String(value ?? '').trim() === '';

const formatCurrencyInput = (rawValue) => {
  const sanitized = String(rawValue ?? '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '');
  if (!sanitized) return '';

  const hasDecimalPoint = sanitized.includes('.');
  const [integerRaw = '', ...decimalParts] = sanitized.split('.');
  const decimalRaw = decimalParts.join('').slice(0, 2);
  const normalizedInteger = integerRaw.replace(/^0+(?=\d)/, '');
  const integerPart = normalizedInteger || (hasDecimalPoint ? '0' : '');
  const formattedInteger = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

  if (!hasDecimalPoint) return formattedInteger;
  return `${formattedInteger || '0'}.${decimalRaw}`;
};

function SpecialtyForm({ onBack }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const activeRequiredFields = useMemo(() => {
    const specialtyRequired = requiredBySpecialty[formData.specialtyType] || [];
    return ['specialtyType', ...specialtyRequired];
  }, [formData.specialtyType]);

  const validate = (nextForm) => {
    const nextErrors = {};
    activeRequiredFields.forEach((field) => {
      if (isBlank(nextForm[field])) {
        nextErrors[field] = REQUIRED_MESSAGE;
      }
    });
    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const firstErrorField = activeRequiredFields.find((field) => nextErrors[field]);
    if (!firstErrorField) return;

    requestAnimationFrame(() => {
      const node = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      if (!node) return;
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.focus({ preventScroll: true });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = currencyFields.has(name) ? formatCurrencyInput(value) : value;
    const nextForm = { ...formData, [name]: normalizedValue };

    if (name === 'specialtyType') {
      setErrors({});
      setHasSubmitted(false);
    }

    if (name === 'priorCyberIncidentsClaims' && value !== 'yes') nextForm.priorCyberIncidentsDetails = '';
    if (name === 'priorEoClaims' && value !== 'yes') nextForm.priorEoClaimsDetails = '';
    if (name === 'priorVeterinaryConditions' && value !== 'yes') nextForm.priorVeterinaryConditionsDetails = '';

    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
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

      <h3>Specialty Products</h3>
      <p className="quote-request__form-intro">
        Select a specialty product, then complete required intake fields for that product line.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Specialty Product Selection</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">
              Specialty Product Type <span className="quote-request__required-mark">*</span>
            </span>
            <select
              name="specialtyType"
              value={formData.specialtyType}
              onChange={handleChange}
              className={fieldError('specialtyType') ? 'quote-request__input--invalid' : ''}
            >
              {SPECIALTY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {fieldError('specialtyType') ? <span className="quote-request__validation-message">{fieldError('specialtyType')}</span> : null}
          </label>
        </div>
      </div>

      {formData.specialtyType === 'cyber' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Cyber Liability Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Legal Business Name <span className="quote-request__required-mark">*</span></span><input name="legalBusinessName" value={formData.legalBusinessName} onChange={handleChange} className={fieldError('legalBusinessName') ? 'quote-request__input--invalid' : ''} />{fieldError('legalBusinessName') ? <span className="quote-request__validation-message">{fieldError('legalBusinessName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Industry / Business Type <span className="quote-request__required-mark">*</span></span><input name="industryBusinessType" value={formData.industryBusinessType} onChange={handleChange} className={fieldError('industryBusinessType') ? 'quote-request__input--invalid' : ''} />{fieldError('industryBusinessType') ? <span className="quote-request__validation-message">{fieldError('industryBusinessType')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Revenue <span className="quote-request__required-mark">*</span></span><input name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} inputMode="decimal" className={fieldError('annualRevenue') ? 'quote-request__input--invalid' : ''} />{fieldError('annualRevenue') ? <span className="quote-request__validation-message">{fieldError('annualRevenue')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Records Containing PII <span className="quote-request__required-mark">*</span></span><input name="recordsContainingPii" value={formData.recordsContainingPii} onChange={handleChange} className={fieldError('recordsContainingPii') ? 'quote-request__input--invalid' : ''} />{fieldError('recordsContainingPii') ? <span className="quote-request__validation-message">{fieldError('recordsContainingPii')}</span> : null}</label>
            <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Types of Data Stored <span className="quote-request__required-mark">*</span></span><input name="typesOfDataStored" value={formData.typesOfDataStored} onChange={handleChange} placeholder="PII, PHI, Financial Data, etc." className={fieldError('typesOfDataStored') ? 'quote-request__input--invalid' : ''} />{fieldError('typesOfDataStored') ? <span className="quote-request__validation-message">{fieldError('typesOfDataStored')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual IT Security Budget</span><input name="annualItSecurityBudget" value={formData.annualItSecurityBudget} onChange={handleChange} inputMode="decimal" /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">MFA Implemented? <span className="quote-request__required-mark">*</span></span><select name="mfaImplemented" value={formData.mfaImplemented} onChange={handleChange} className={fieldError('mfaImplemented') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('mfaImplemented') ? <span className="quote-request__validation-message">{fieldError('mfaImplemented')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">EDR Software?</span><select name="edrSoftware" value={formData.edrSoftware} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Data Backup Procedures <span className="quote-request__required-mark">*</span></span><input name="dataBackupProcedures" value={formData.dataBackupProcedures} onChange={handleChange} placeholder="No backup / Partial / Full daily / Offline-air gapped" className={fieldError('dataBackupProcedures') ? 'quote-request__input--invalid' : ''} />{fieldError('dataBackupProcedures') ? <span className="quote-request__validation-message">{fieldError('dataBackupProcedures')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Encryption of Sensitive Data at Rest? <span className="quote-request__required-mark">*</span></span><select name="encryptionSensitiveData" value={formData.encryptionSensitiveData} onChange={handleChange} className={fieldError('encryptionSensitiveData') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('encryptionSensitiveData') ? <span className="quote-request__validation-message">{fieldError('encryptionSensitiveData')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Cyber Incidents or Claims? <span className="quote-request__required-mark">*</span></span><select name="priorCyberIncidentsClaims" value={formData.priorCyberIncidentsClaims} onChange={handleChange} className={fieldError('priorCyberIncidentsClaims') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorCyberIncidentsClaims') ? <span className="quote-request__validation-message">{fieldError('priorCyberIncidentsClaims')}</span> : null}</label>
            {formData.priorCyberIncidentsClaims === 'yes' ? <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Prior Cyber Incident Details</span><input name="priorCyberIncidentsDetails" value={formData.priorCyberIncidentsDetails} onChange={handleChange} placeholder="Description, costs, resolution" /></label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Ransomware Demand Limit Requested</span><input name="annualRansomwareDemandLimit" value={formData.annualRansomwareDemandLimit} onChange={handleChange} inputMode="decimal" placeholder="$250K / $500K / $1M / $2M / $5M" /></label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'eo' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Professional Liability (E&O) Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Business Name <span className="quote-request__required-mark">*</span></span><input name="businessName" value={formData.businessName} onChange={handleChange} className={fieldError('businessName') ? 'quote-request__input--invalid' : ''} />{fieldError('businessName') ? <span className="quote-request__validation-message">{fieldError('businessName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Profession / Service Type <span className="quote-request__required-mark">*</span></span><input name="professionServiceType" value={formData.professionServiceType} onChange={handleChange} placeholder="IT, Consulting, Legal, Financial, etc." className={fieldError('professionServiceType') ? 'quote-request__input--invalid' : ''} />{fieldError('professionServiceType') ? <span className="quote-request__validation-message">{fieldError('professionServiceType')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Years in Practice <span className="quote-request__required-mark">*</span></span><input name="yearsInPractice" value={formData.yearsInPractice} onChange={handleChange} className={fieldError('yearsInPractice') ? 'quote-request__input--invalid' : ''} />{fieldError('yearsInPractice') ? <span className="quote-request__validation-message">{fieldError('yearsInPractice')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Number of Licensed Professionals <span className="quote-request__required-mark">*</span></span><input name="numberLicensedProfessionals" value={formData.numberLicensedProfessionals} onChange={handleChange} className={fieldError('numberLicensedProfessionals') ? 'quote-request__input--invalid' : ''} />{fieldError('numberLicensedProfessionals') ? <span className="quote-request__validation-message">{fieldError('numberLicensedProfessionals')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Revenue from Professional Services <span className="quote-request__required-mark">*</span></span><input name="annualRevenueProfessionalServices" value={formData.annualRevenueProfessionalServices} onChange={handleChange} inputMode="decimal" className={fieldError('annualRevenueProfessionalServices') ? 'quote-request__input--invalid' : ''} />{fieldError('annualRevenueProfessionalServices') ? <span className="quote-request__validation-message">{fieldError('annualRevenueProfessionalServices')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior E&O Claims? <span className="quote-request__required-mark">*</span></span><select name="priorEoClaims" value={formData.priorEoClaims} onChange={handleChange} className={fieldError('priorEoClaims') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorEoClaims') ? <span className="quote-request__validation-message">{fieldError('priorEoClaims')}</span> : null}</label>
            {formData.priorEoClaims === 'yes' ? <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Prior E&O Claim Details</span><input name="priorEoClaimsDetails" value={formData.priorEoClaimsDetails} onChange={handleChange} placeholder="Date, amount, status" /></label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Services Provided Outside US?</span><select name="servicesProvidedOutsideUs" value={formData.servicesProvidedOutsideUs} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Retroactive Date Requested <span className="quote-request__required-mark">*</span></span><input name="retroactiveDateRequested" type="date" value={formData.retroactiveDateRequested} onChange={handleChange} className={fieldError('retroactiveDateRequested') ? 'quote-request__input--invalid' : ''} />{fieldError('retroactiveDateRequested') ? <span className="quote-request__validation-message">{fieldError('retroactiveDateRequested')}</span> : null}</label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'inland-marine' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Inland Marine Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Type of Equipment or Property <span className="quote-request__required-mark">*</span></span><input name="equipmentPropertyType" value={formData.equipmentPropertyType} onChange={handleChange} placeholder="Contractor equipment, medical, electronics, etc." className={fieldError('equipmentPropertyType') ? 'quote-request__input--invalid' : ''} />{fieldError('equipmentPropertyType') ? <span className="quote-request__validation-message">{fieldError('equipmentPropertyType')}</span> : null}</label>
            <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Schedule of Items <span className="quote-request__required-mark">*</span></span><input name="scheduleOfItems" value={formData.scheduleOfItems} onChange={handleChange} placeholder="Description, year, make/model, serial number, value" className={fieldError('scheduleOfItems') ? 'quote-request__input--invalid' : ''} />{fieldError('scheduleOfItems') ? <span className="quote-request__validation-message">{fieldError('scheduleOfItems')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Total Insured Value <span className="quote-request__required-mark">*</span></span><input name="totalInsuredValue" value={formData.totalInsuredValue} onChange={handleChange} inputMode="decimal" className={fieldError('totalInsuredValue') ? 'quote-request__input--invalid' : ''} />{fieldError('totalInsuredValue') ? <span className="quote-request__validation-message">{fieldError('totalInsuredValue')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Storage Location(s) <span className="quote-request__required-mark">*</span></span><input name="storageLocations" value={formData.storageLocations} onChange={handleChange} className={fieldError('storageLocations') ? 'quote-request__input--invalid' : ''} />{fieldError('storageLocations') ? <span className="quote-request__validation-message">{fieldError('storageLocations')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Primarily In-Transit or Stored? <span className="quote-request__required-mark">*</span></span><input name="inTransitOrStored" value={formData.inTransitOrStored} onChange={handleChange} placeholder="Primarily stored / frequently in-transit / both" className={fieldError('inTransitOrStored') ? 'quote-request__input--invalid' : ''} />{fieldError('inTransitOrStored') ? <span className="quote-request__validation-message">{fieldError('inTransitOrStored')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Inland Marine Claims?</span><select name="priorInlandMarineClaims" value={formData.priorInlandMarineClaims} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'surety-bond' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Surety Bond Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Type Requested <span className="quote-request__required-mark">*</span></span><input name="bondTypeRequested" value={formData.bondTypeRequested} onChange={handleChange} placeholder="License & Permit, Contract, Court/Judicial, etc." className={fieldError('bondTypeRequested') ? 'quote-request__input--invalid' : ''} />{fieldError('bondTypeRequested') ? <span className="quote-request__validation-message">{fieldError('bondTypeRequested')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Obligee Name <span className="quote-request__required-mark">*</span></span><input name="obligeeName" value={formData.obligeeName} onChange={handleChange} className={fieldError('obligeeName') ? 'quote-request__input--invalid' : ''} />{fieldError('obligeeName') ? <span className="quote-request__validation-message">{fieldError('obligeeName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Amount (Penal Sum) <span className="quote-request__required-mark">*</span></span><input name="bondAmountPenalSum" value={formData.bondAmountPenalSum} onChange={handleChange} inputMode="decimal" className={fieldError('bondAmountPenalSum') ? 'quote-request__input--invalid' : ''} />{fieldError('bondAmountPenalSum') ? <span className="quote-request__validation-message">{fieldError('bondAmountPenalSum')}</span> : null}</label>
            <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Purpose of Bond <span className="quote-request__required-mark">*</span></span><input name="purposeOfBond" value={formData.purposeOfBond} onChange={handleChange} className={fieldError('purposeOfBond') ? 'quote-request__input--invalid' : ''} />{fieldError('purposeOfBond') ? <span className="quote-request__validation-message">{fieldError('purposeOfBond')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Term / Duration <span className="quote-request__required-mark">*</span></span><input name="bondTermDuration" value={formData.bondTermDuration} onChange={handleChange} placeholder="1 year, 2 years, continuous" className={fieldError('bondTermDuration') ? 'quote-request__input--invalid' : ''} />{fieldError('bondTermDuration') ? <span className="quote-request__validation-message">{fieldError('bondTermDuration')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Principal Personal Credit Score (approx.) <span className="quote-request__required-mark">*</span></span><input name="principalPersonalCreditScore" value={formData.principalPersonalCreditScore} onChange={handleChange} placeholder="Excellent / Good / Fair / Poor" className={fieldError('principalPersonalCreditScore') ? 'quote-request__input--invalid' : ''} />{fieldError('principalPersonalCreditScore') ? <span className="quote-request__validation-message">{fieldError('principalPersonalCreditScore')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Business Financial Statements?</span><select name="businessFinancialStatements" value={formData.businessFinancialStatements} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Bond Claims or Default? <span className="quote-request__required-mark">*</span></span><select name="priorBondClaimsDefault" value={formData.priorBondClaimsDefault} onChange={handleChange} className={fieldError('priorBondClaimsDefault') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorBondClaimsDefault') ? <span className="quote-request__validation-message">{fieldError('priorBondClaimsDefault')}</span> : null}</label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'pet' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Pet Insurance Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Name <span className="quote-request__required-mark">*</span></span><input name="petName" value={formData.petName} onChange={handleChange} className={fieldError('petName') ? 'quote-request__input--invalid' : ''} />{fieldError('petName') ? <span className="quote-request__validation-message">{fieldError('petName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Species <span className="quote-request__required-mark">*</span></span><input name="petSpecies" value={formData.petSpecies} onChange={handleChange} placeholder="Dog, Cat, Bird, Exotic" className={fieldError('petSpecies') ? 'quote-request__input--invalid' : ''} />{fieldError('petSpecies') ? <span className="quote-request__validation-message">{fieldError('petSpecies')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Breed <span className="quote-request__required-mark">*</span></span><input name="petBreed" value={formData.petBreed} onChange={handleChange} className={fieldError('petBreed') ? 'quote-request__input--invalid' : ''} />{fieldError('petBreed') ? <span className="quote-request__validation-message">{fieldError('petBreed')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Age <span className="quote-request__required-mark">*</span></span><input name="petAge" value={formData.petAge} onChange={handleChange} placeholder="Years / months" className={fieldError('petAge') ? 'quote-request__input--invalid' : ''} />{fieldError('petAge') ? <span className="quote-request__validation-message">{fieldError('petAge')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Gender <span className="quote-request__required-mark">*</span></span><input name="petGender" value={formData.petGender} onChange={handleChange} placeholder="Male/Female + neuter status" className={fieldError('petGender') ? 'quote-request__input--invalid' : ''} />{fieldError('petGender') ? <span className="quote-request__validation-message">{fieldError('petGender')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Weight</span><input name="petWeight" value={formData.petWeight} onChange={handleChange} placeholder="lbs" /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Color / Markings</span><input name="petColorMarkings" value={formData.petColorMarkings} onChange={handleChange} /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Microchipped?</span><select name="microchipped" value={formData.microchipped} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Veterinary Conditions? <span className="quote-request__required-mark">*</span></span><select name="priorVeterinaryConditions" value={formData.priorVeterinaryConditions} onChange={handleChange} className={fieldError('priorVeterinaryConditions') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorVeterinaryConditions') ? <span className="quote-request__validation-message">{fieldError('priorVeterinaryConditions')}</span> : null}</label>
            {formData.priorVeterinaryConditions === 'yes' ? <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Prior Veterinary Condition Details</span><input name="priorVeterinaryConditionsDetails" value={formData.priorVeterinaryConditionsDetails} onChange={handleChange} placeholder="Condition, diagnosis date, treatment cost" /></label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Coverage Type <span className="quote-request__required-mark">*</span></span><input name="coverageType" value={formData.coverageType} onChange={handleChange} placeholder="Accident-only / Accident & illness / Comprehensive" className={fieldError('coverageType') ? 'quote-request__input--invalid' : ''} />{fieldError('coverageType') ? <span className="quote-request__validation-message">{fieldError('coverageType')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Deductible <span className="quote-request__required-mark">*</span></span><input name="annualDeductible" value={formData.annualDeductible} onChange={handleChange} placeholder="$100 / $250 / $500 / $1,000" className={fieldError('annualDeductible') ? 'quote-request__input--invalid' : ''} />{fieldError('annualDeductible') ? <span className="quote-request__validation-message">{fieldError('annualDeductible')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Reimbursement Percentage <span className="quote-request__required-mark">*</span></span><input name="reimbursementPercentage" value={formData.reimbursementPercentage} onChange={handleChange} placeholder="70% / 80% / 90% / 100%" className={fieldError('reimbursementPercentage') ? 'quote-request__input--invalid' : ''} />{fieldError('reimbursementPercentage') ? <span className="quote-request__validation-message">{fieldError('reimbursementPercentage')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Benefit Limit <span className="quote-request__required-mark">*</span></span><input name="annualBenefitLimit" value={formData.annualBenefitLimit} onChange={handleChange} inputMode="decimal" placeholder="$5,000 / $10,000 / $15,000 / Unlimited" className={fieldError('annualBenefitLimit') ? 'quote-request__input--invalid' : ''} />{fieldError('annualBenefitLimit') ? <span className="quote-request__validation-message">{fieldError('annualBenefitLimit')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Veterinarian Name & Clinic</span><input name="veterinarianClinic" value={formData.veterinarianClinic} onChange={handleChange} /></label>
          </div>
        </div>
      ) : null}

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleContinue}>Validate Specialty Form</button>
      </div>
    </section>
  );
}

export default SpecialtyForm;
