import React, { useEffect, useMemo, useRef, useState } from 'react';

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

const CYBER_INDUSTRY_OPTIONS = [
  { value: '', label: 'Select industry / business type' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'retail-ecommerce', label: 'Retail / E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const CYBER_DATA_STORED_OPTIONS = [
  { value: 'pii', label: 'PII' },
  { value: 'financial-data', label: 'Financial Data' },
  { value: 'health-phi', label: 'Health/PHI' },
  { value: 'credit-card-pci', label: 'Credit Card (PCI)' },
  { value: 'trade-secrets', label: 'Trade Secrets' },
];

const CYBER_BACKUP_PROCEDURE_OPTIONS = [
  { value: '', label: 'Select backup procedure' },
  { value: 'no-backup', label: 'No Backup' },
  { value: 'partial', label: 'Partial' },
  { value: 'full-daily-backup', label: 'Full Daily Backup' },
  { value: 'offline-air-gapped-backup', label: 'Offline/Air-Gapped Backup' },
];

const CYBER_RANSOMWARE_LIMIT_OPTIONS = [
  { value: '', label: 'Select annual ransomware demand limit' },
  { value: '250000', label: '$250K' },
  { value: '500000', label: '$500K' },
  { value: '1000000', label: '$1M' },
  { value: '2000000', label: '$2M' },
  { value: '5000000', label: '$5M' },
];

const EO_PROFESSION_OPTIONS = [
  { value: '', label: 'Select profession / service type' },
  { value: 'it-tech', label: 'IT/Tech' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'other', label: 'Other' },
];

const INLAND_MARINE_EQUIPMENT_OPTIONS = [
  { value: '', label: 'Select equipment/property type' },
  { value: 'contractor-equipment', label: 'Contractor Equipment' },
  { value: 'medical-equipment', label: 'Medical Equipment' },
  { value: 'fine-art', label: 'Fine Art' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'collectibles', label: 'Collectibles' },
  { value: 'musical-instruments', label: 'Musical Instruments' },
  { value: 'other', label: 'Other' },
];

const INLAND_MARINE_TRANSIT_STORED_OPTIONS = [
  { value: '', label: 'Select in-transit/stored status' },
  { value: 'primarily-stored', label: 'Primarily Stored' },
  { value: 'frequently-in-transit', label: 'Frequently In Transit' },
  { value: 'both', label: 'Both' },
];

const SURETY_BOND_TYPE_OPTIONS = [
  { value: '', label: 'Select bond type requested' },
  { value: 'license-permit', label: 'License & Permit' },
  { value: 'contract-performance', label: 'Contract/Performance' },
  { value: 'court-judicial', label: 'Court/Judicial' },
  { value: 'fidelity-employee-dishonesty', label: 'Fidelity/Employee Dishonesty' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

const SURETY_BOND_TERM_OPTIONS = [
  { value: '', label: 'Select bond term/duration' },
  { value: '1-year', label: '1 year' },
  { value: '2-years', label: '2 years' },
  { value: 'continuous', label: 'continuous' },
];

const SURETY_CREDIT_SCORE_OPTIONS = [
  { value: '', label: "Select principal's personal credit score" },
  { value: 'excellent-720-plus', label: 'Excellent (720+)' },
  { value: 'good-660-719', label: 'Good (660-719)' },
  { value: 'fair-600-659', label: 'Fair (600-659)' },
  { value: 'poor-below-600', label: 'Poor (below 600)' },
];

const PET_SPECIES_OPTIONS = [
  { value: '', label: 'Select pet species' },
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'exotic', label: 'Exotic' },
];

const PET_COVERAGE_TYPE_OPTIONS = [
  { value: '', label: 'Select coverage type' },
  { value: 'accident-only', label: 'Accident-Only' },
  { value: 'accident-illness', label: 'Accident & Illness' },
  { value: 'comprehensive-wellness-addon', label: 'Comprehensive (Wellness add-on)' },
];

const PET_ANNUAL_DEDUCTIBLE_OPTIONS = [
  { value: '', label: 'Select annual deductible' },
  { value: '100', label: '$100' },
  { value: '250', label: '$250' },
  { value: '500', label: '$500' },
  { value: '1000', label: '$1,000' },
];

const PET_REIMBURSEMENT_PACKAGE_OPTIONS = [
  { value: '', label: 'Select reimbursement package' },
  { value: '70', label: '70%' },
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
  { value: '100', label: '100%' },
];

const PET_ANNUAL_BENEFIT_LIMIT_OPTIONS = [
  { value: '', label: 'Select annual benefit limit' },
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '15000', label: '$15,000' },
  { value: 'unlimited', label: 'Unlimited' },
];

const PET_GENDER_OPTIONS = [
  { value: '', label: 'Select pet gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'male-neutered', label: 'Male-Neutered' },
  { value: 'female-spayed', label: 'Female-Spayed' },
];

const initialForm = {
  specialtyType: '',
  legalBusinessName: '',
  industryBusinessType: '',
  industryBusinessTypeOther: '',
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
  professionServiceTypeOther: '',
  yearsInPractice: '',
  numberLicensedProfessionals: '',
  annualRevenueProfessionalServices: '',
  priorEoClaims: '',
  priorEoClaimsDetails: '',
  servicesProvidedOutsideUs: '',
  servicesProvidedOutsideUsCountries: '',
  retroactiveDateRequested: '',
  equipmentPropertyType: '',
  equipmentPropertyTypeOther: '',
  scheduleOfItems: '',
  totalInsuredValue: '',
  storageStreetAddress: '',
  storageUnitNumber: '',
  storageCity: '',
  storageState: '',
  storageZip: '',
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
  petAgeYears: '',
  petAgeMonths: '',
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

const initialCyberIncident = {
  date: '',
  description: '',
  costs: '',
  resolution: '',
};

const initialEoClaim = {
  date: '',
  amount: '',
  status: '',
};

const initialInlandMarineItem = {
  itemDescription: '',
  year: '',
  makeModel: '',
  serialNumber: '',
  value: '',
};

const initialInlandMarineClaim = {
  date: '',
  amount: '',
  description: '',
};

const initialPetVeterinaryCondition = {
  condition: '',
  diagnosisDate: '',
  treatmentCost: '',
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
    'storageStreetAddress',
    'storageCity',
    'storageState',
    'storageZip',
    'totalInsuredValue',
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
  'annualRevenueProfessionalServices',
  'totalInsuredValue',
  'bondAmountPenalSum',
  'annualBenefitLimit',
]);

const isBlank = (value) => String(value ?? '').trim() === '';
const isDigitsOnly = (value) => /^\d+$/.test(String(value ?? '').trim());

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

const buildCyberIncidentsSummary = (rows) => rows
  .map((row) => {
    const date = String(row.date ?? '').trim();
    const description = String(row.description ?? '').trim();
    const costs = String(row.costs ?? '').trim();
    const resolution = String(row.resolution ?? '').trim();
    const parts = [];
    if (date) parts.push(`Date: ${date}`);
    if (description) parts.push(`Description: ${description}`);
    if (costs) parts.push(`Costs: ${costs}`);
    if (resolution) parts.push(`Resolution: ${resolution}`);
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

const buildEoClaimsSummary = (rows) => rows
  .map((row) => {
    const date = String(row.date ?? '').trim();
    const amount = String(row.amount ?? '').trim();
    const status = String(row.status ?? '').trim();
    const parts = [];
    if (date) parts.push(`Date: ${date}`);
    if (amount) parts.push(`Amount: ${amount}`);
    if (status) parts.push(`Status: ${status}`);
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

const isFourDigitYear = (value) => /^\d{4}$/.test(String(value ?? '').trim());

const formatZipCode = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const buildAddressSummary = ({ streetAddress, unitNumber, city, state, zip }) => (
  [streetAddress, unitNumber, city, state, zip]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(', ')
);

const buildInlandMarineItemsSummary = (rows) => rows
  .map((row) => {
    const itemDescription = String(row.itemDescription ?? '').trim();
    const year = String(row.year ?? '').trim();
    const makeModel = String(row.makeModel ?? '').trim();
    const serialNumber = String(row.serialNumber ?? '').trim();
    const value = String(row.value ?? '').trim();
    const parts = [];
    if (itemDescription) parts.push(`Description: ${itemDescription}`);
    if (year) parts.push(`Year: ${year}`);
    if (makeModel) parts.push(`Make/Model: ${makeModel}`);
    if (serialNumber) parts.push(`Serial: ${serialNumber}`);
    if (value) parts.push(`Value: ${value}`);
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

const buildInlandMarineClaimsSummary = (rows) => rows
  .map((row) => {
    const date = String(row.date ?? '').trim();
    const amount = String(row.amount ?? '').trim();
    const description = String(row.description ?? '').trim();
    const parts = [];
    if (date) parts.push(`Date: ${date}`);
    if (amount) parts.push(`Amount: ${amount}`);
    if (description) parts.push(`Description: ${description}`);
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

const buildPetVeterinaryConditionsSummary = (rows) => rows
  .map((row) => {
    const condition = String(row.condition ?? '').trim();
    const diagnosisDate = String(row.diagnosisDate ?? '').trim();
    const treatmentCost = String(row.treatmentCost ?? '').trim();
    const parts = [];
    if (condition) parts.push(`Condition: ${condition}`);
    if (diagnosisDate) parts.push(`Diagnosis Date: ${diagnosisDate}`);
    if (treatmentCost) parts.push(`Treatment Cost: ${treatmentCost}`);
    return parts.join(', ');
  })
  .filter(Boolean)
  .join(' | ');

const toCurrencyNumber = (value) => {
  const sanitized = String(value ?? '').replace(/,/g, '').trim();
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateInlandMarineTotalValue = (rows) => {
  const total = rows.reduce((sum, row) => sum + toCurrencyNumber(row.value), 0);
  return formatCurrencyInput(String(total));
};

const formatWholeNumberWithCommas = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function SpecialtyForm({ onBack, onFormChange, onValidityChange, onPreviewRequest }) {
  const formRef = useRef(null);
  const suretyBusinessFinancialStatementFileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [cyberIncidents, setCyberIncidents] = useState([{ ...initialCyberIncident }]);
  const [eoClaims, setEoClaims] = useState([{ ...initialEoClaim }]);
  const [inlandMarineItems, setInlandMarineItems] = useState([{ ...initialInlandMarineItem }]);
  const [inlandMarineClaims, setInlandMarineClaims] = useState([{ ...initialInlandMarineClaim }]);
  const [petVeterinaryConditions, setPetVeterinaryConditions] = useState([{ ...initialPetVeterinaryCondition }]);
  const [suretyBusinessFinancialStatementFile, setSuretyBusinessFinancialStatementFile] = useState(null);
  const [suretyBusinessFinancialStatementAttachment, setSuretyBusinessFinancialStatementAttachment] = useState(null);
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

    if (!isBlank(nextForm.recordsContainingPii) && !isDigitsOnly(nextForm.recordsContainingPii)) {
      nextErrors.recordsContainingPii = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.yearsInPractice) && !isDigitsOnly(nextForm.yearsInPractice.replace(/,/g, ''))) {
      nextErrors.yearsInPractice = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.numberLicensedProfessionals) && !isDigitsOnly(nextForm.numberLicensedProfessionals.replace(/,/g, ''))) {
      nextErrors.numberLicensedProfessionals = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.petAgeYears) && !isDigitsOnly(nextForm.petAgeYears)) {
      nextErrors.petAgeYears = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.petAgeMonths) && !isDigitsOnly(nextForm.petAgeMonths)) {
      nextErrors.petAgeMonths = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.petWeight) && !isDigitsOnly(nextForm.petWeight.replace(/,/g, ''))) {
      nextErrors.petWeight = 'Enter numbers only.';
    }

    if (!isBlank(nextForm.storageZip) && !/^\d{5}(-\d{4})?$/.test(nextForm.storageZip)) {
      nextErrors.storageZip = 'Use ZIP format 12345 or 12345-6789.';
    }

    if (nextForm.specialtyType === 'cyber' && nextForm.industryBusinessType === 'other' && isBlank(nextForm.industryBusinessTypeOther)) {
      nextErrors.industryBusinessTypeOther = REQUIRED_MESSAGE;
    }

    if (nextForm.specialtyType === 'eo' && nextForm.professionServiceType === 'other' && isBlank(nextForm.professionServiceTypeOther)) {
      nextErrors.professionServiceTypeOther = REQUIRED_MESSAGE;
    }

    if (nextForm.specialtyType === 'eo' && nextForm.servicesProvidedOutsideUs === 'yes' && isBlank(nextForm.servicesProvidedOutsideUsCountries)) {
      nextErrors.servicesProvidedOutsideUsCountries = REQUIRED_MESSAGE;
    }

    if (nextForm.specialtyType === 'inland-marine' && nextForm.equipmentPropertyType === 'other' && isBlank(nextForm.equipmentPropertyTypeOther)) {
      nextErrors.equipmentPropertyTypeOther = REQUIRED_MESSAGE;
    }

    if (nextForm.specialtyType === 'cyber' && nextForm.priorCyberIncidentsClaims === 'yes') {
      const hasRequiredIncidentData = !isBlank(cyberIncidents[0].date)
        || !isBlank(cyberIncidents[0].description)
        || !isBlank(cyberIncidents[0].costs)
        || !isBlank(cyberIncidents[0].resolution);
      if (!hasRequiredIncidentData) {
        nextErrors.cyberIncident0 = 'At least one cyber incident row is required.';
      }

      cyberIncidents.forEach((row, index) => {
        const hasAny = !isBlank(row.date) || !isBlank(row.description) || !isBlank(row.costs) || !isBlank(row.resolution);
        const hasAll = !isBlank(row.date) && !isBlank(row.description) && !isBlank(row.costs) && !isBlank(row.resolution);
        if (hasAny && !hasAll) {
          nextErrors[`cyberIncident${index}`] = 'Complete date, description, costs, and resolution for this row.';
        }
      });
    }

    if (nextForm.specialtyType === 'eo' && nextForm.priorEoClaims === 'yes') {
      const hasRequiredClaimData = !isBlank(eoClaims[0].date) || !isBlank(eoClaims[0].amount) || !isBlank(eoClaims[0].status);
      if (!hasRequiredClaimData) {
        nextErrors.eoClaim0 = 'At least one E&O claim row is required.';
      }

      eoClaims.forEach((row, index) => {
        const hasAny = !isBlank(row.date) || !isBlank(row.amount) || !isBlank(row.status);
        const hasAll = !isBlank(row.date) && !isBlank(row.amount) && !isBlank(row.status);
        if (hasAny && !hasAll) {
          nextErrors[`eoClaim${index}`] = 'Complete date, amount, and status for this row.';
        }
      });
    }

    if (nextForm.specialtyType === 'inland-marine') {
      const hasRequiredItemData = !isBlank(inlandMarineItems[0].itemDescription)
        || !isBlank(inlandMarineItems[0].year)
        || !isBlank(inlandMarineItems[0].makeModel)
        || !isBlank(inlandMarineItems[0].serialNumber)
        || !isBlank(inlandMarineItems[0].value);
      if (!hasRequiredItemData) {
        nextErrors.inlandMarineItem0 = 'At least one schedule item is required.';
      }

      inlandMarineItems.forEach((row, index) => {
        const hasAny = !isBlank(row.itemDescription) || !isBlank(row.year) || !isBlank(row.makeModel) || !isBlank(row.serialNumber) || !isBlank(row.value);
        const hasAll = !isBlank(row.itemDescription) && !isBlank(row.year) && !isBlank(row.makeModel) && !isBlank(row.serialNumber) && !isBlank(row.value);
        if (hasAny && !hasAll) {
          nextErrors[`inlandMarineItem${index}`] = 'Complete description, year, make/model, serial number, and value for this row.';
          return;
        }
        if (!isBlank(row.year) && !isFourDigitYear(row.year)) {
          nextErrors[`inlandMarineItem${index}`] = 'Year must be a valid 4-digit year.';
        }
      });

      if (nextForm.priorInlandMarineClaims === 'yes') {
        const hasRequiredClaimData = !isBlank(inlandMarineClaims[0].date) || !isBlank(inlandMarineClaims[0].amount) || !isBlank(inlandMarineClaims[0].description);
        if (!hasRequiredClaimData) {
          nextErrors.inlandMarineClaim0 = 'At least one prior inland marine claim is required.';
        }

        inlandMarineClaims.forEach((row, index) => {
          const hasAny = !isBlank(row.date) || !isBlank(row.amount) || !isBlank(row.description);
          const hasAll = !isBlank(row.date) && !isBlank(row.amount) && !isBlank(row.description);
          if (hasAny && !hasAll) {
            nextErrors[`inlandMarineClaim${index}`] = 'Complete date, amount, and description for this claim row.';
          }
        });
      }
    }

    if (nextForm.specialtyType === 'pet' && nextForm.priorVeterinaryConditions === 'yes') {
      const hasRequiredConditionData = !isBlank(petVeterinaryConditions[0].condition)
        || !isBlank(petVeterinaryConditions[0].diagnosisDate)
        || !isBlank(petVeterinaryConditions[0].treatmentCost);
      if (!hasRequiredConditionData) {
        nextErrors.petCondition0 = 'At least one veterinary condition row is required.';
      }

      petVeterinaryConditions.forEach((row, index) => {
        const hasAny = !isBlank(row.condition) || !isBlank(row.diagnosisDate) || !isBlank(row.treatmentCost);
        const hasAll = !isBlank(row.condition) && !isBlank(row.diagnosisDate) && !isBlank(row.treatmentCost);
        if (hasAny && !hasAll) {
          nextErrors[`petCondition${index}`] = 'Complete condition, diagnosis date, and treatment cost for this row.';
        }
      });
    }

    return nextErrors;
  };

  const focusFirstError = (nextErrors) => {
    const orderedKeys = [...activeRequiredFields, 'cyberIncident0', 'eoClaim0', 'inlandMarineItem0', 'inlandMarineClaim0', 'petCondition0', 'servicesProvidedOutsideUsCountries', 'professionServiceTypeOther', 'equipmentPropertyTypeOther'];
    const firstErrorField = orderedKeys.find((field) => nextErrors[field]);
    if (!firstErrorField) return;

    requestAnimationFrame(() => {
      if (firstErrorField.startsWith('cyberIncident')) {
        const node = formRef.current?.querySelector('[name="cyberIncidentDate0"]');
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
        return;
      }
      if (firstErrorField.startsWith('eoClaim')) {
        const node = formRef.current?.querySelector('[name="eoClaimDate0"]');
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
        return;
      }
      if (firstErrorField.startsWith('inlandMarineItem')) {
        const node = formRef.current?.querySelector('[name="inlandMarineItemDescription0"]');
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
        return;
      }
      if (firstErrorField.startsWith('inlandMarineClaim')) {
        const node = formRef.current?.querySelector('[name="inlandMarineClaimDate0"]');
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
        return;
      }
      if (firstErrorField.startsWith('petCondition')) {
        const node = formRef.current?.querySelector('[name="petConditionName0"]');
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.focus({ preventScroll: true });
        return;
      }
      const node = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      if (!node) return;
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.focus({ preventScroll: true });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let normalizedValue = currencyFields.has(name) ? formatCurrencyInput(value) : value;

    if (name === 'recordsContainingPii') {
      normalizedValue = String(value ?? '').replace(/\D/g, '');
    }

    if (['yearsInPractice', 'numberLicensedProfessionals'].includes(name)) {
      normalizedValue = formatWholeNumberWithCommas(value);
    }

    if (['petAgeYears', 'petAgeMonths'].includes(name)) {
      normalizedValue = String(value ?? '').replace(/\D/g, '');
    }

    if (name === 'petWeight') {
      normalizedValue = formatWholeNumberWithCommas(value);
    }

    if (name === 'storageZip') {
      normalizedValue = formatZipCode(value);
    }

    const nextForm = { ...formData, [name]: normalizedValue };

    if (name === 'specialtyType') {
      setErrors({});
      setHasSubmitted(false);
    }

    if (name === 'priorCyberIncidentsClaims') {
      if (value !== 'yes') {
        nextForm.priorCyberIncidentsDetails = '';
        setCyberIncidents([{ ...initialCyberIncident }]);
      } else {
        nextForm.priorCyberIncidentsDetails = buildCyberIncidentsSummary(cyberIncidents);
      }
    }
    if (name === 'priorEoClaims' && value !== 'yes') nextForm.priorEoClaimsDetails = '';
    if (name === 'priorVeterinaryConditions' && value !== 'yes') nextForm.priorVeterinaryConditionsDetails = '';
    if (name === 'industryBusinessType' && value !== 'other') nextForm.industryBusinessTypeOther = '';
    if (name === 'professionServiceType' && value !== 'other') nextForm.professionServiceTypeOther = '';
    if (name === 'servicesProvidedOutsideUs' && value !== 'yes') nextForm.servicesProvidedOutsideUsCountries = '';
    if (name === 'equipmentPropertyType' && value !== 'other') nextForm.equipmentPropertyTypeOther = '';
    if (name === 'priorVeterinaryConditions' && value !== 'yes') {
      nextForm.priorVeterinaryConditionsDetails = '';
      setPetVeterinaryConditions([{ ...initialPetVeterinaryCondition }]);
    }

    if (name === 'priorEoClaims') {
      if (value !== 'yes') {
        nextForm.priorEoClaimsDetails = '';
        setEoClaims([{ ...initialEoClaim }]);
      } else {
        nextForm.priorEoClaimsDetails = buildEoClaimsSummary(eoClaims);
      }
    }

    if ([
      'storageStreetAddress',
      'storageUnitNumber',
      'storageCity',
      'storageState',
      'storageZip',
    ].includes(name)) {
      nextForm.storageLocations = buildAddressSummary({
        streetAddress: name === 'storageStreetAddress' ? normalizedValue : formData.storageStreetAddress,
        unitNumber: name === 'storageUnitNumber' ? normalizedValue : formData.storageUnitNumber,
        city: name === 'storageCity' ? normalizedValue : formData.storageCity,
        state: name === 'storageState' ? normalizedValue : formData.storageState,
        zip: name === 'storageZip' ? normalizedValue : formData.storageZip,
      });
    }

    if (name === 'priorInlandMarineClaims') {
      if (value !== 'yes') {
        setInlandMarineClaims([{ ...initialInlandMarineClaim }]);
      }
      nextForm.priorInlandMarineClaimsDetails = value === 'yes'
        ? buildInlandMarineClaimsSummary(inlandMarineClaims)
        : '';
    }

    if (['petAgeYears', 'petAgeMonths'].includes(name)) {
      const years = name === 'petAgeYears' ? normalizedValue : formData.petAgeYears;
      const months = name === 'petAgeMonths' ? normalizedValue : formData.petAgeMonths;
      const parts = [];
      if (!isBlank(years)) parts.push(`${years} year(s)`);
      if (!isBlank(months)) parts.push(`${months} month(s)`);
      nextForm.petAge = parts.join(' ');
    }

    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const handleCyberDataStoredChange = (event) => {
    const { value, checked } = event.target;
    const selectedSet = new Set(
      formData.typesOfDataStored
        ? formData.typesOfDataStored.split(',').filter(Boolean)
        : [],
    );
    if (checked) {
      selectedSet.add(value);
    } else {
      selectedSet.delete(value);
    }
    const values = Array.from(selectedSet);
    const nextForm = {
      ...formData,
      typesOfDataStored: values.join(','),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const handleSuretyBusinessFinancialStatementFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSuretyBusinessFinancialStatementFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = String(reader.result || '');
        const base64Data = raw.includes(',') ? raw.split(',')[1] : '';
        setSuretyBusinessFinancialStatementAttachment(
          base64Data
            ? {
                filename: file.name,
                contentType: file.type || 'application/octet-stream',
                dataBase64: base64Data,
              }
            : null
        );
      };
      reader.onerror = () => {
        setSuretyBusinessFinancialStatementAttachment(null);
      };
      reader.readAsDataURL(file);
    } else {
      setSuretyBusinessFinancialStatementAttachment(null);
    }

    const nextForm = {
      ...formData,
      businessFinancialStatements: file ? file.name : '',
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const handleRemoveSuretyBusinessFinancialStatementFile = () => {
    setSuretyBusinessFinancialStatementFile(null);
    setSuretyBusinessFinancialStatementAttachment(null);

    if (suretyBusinessFinancialStatementFileInputRef.current) {
      suretyBusinessFinancialStatementFileInputRef.current.value = '';
    }

    const nextForm = {
      ...formData,
      businessFinancialStatements: '',
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const updatePetVeterinaryCondition = (index, field, value) => {
    const normalized = field === 'treatmentCost' ? formatCurrencyInput(value) : value;
    const nextConditions = petVeterinaryConditions.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setPetVeterinaryConditions(nextConditions);

    const nextForm = {
      ...formData,
      priorVeterinaryConditionsDetails: buildPetVeterinaryConditionsSummary(nextConditions),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const addPetVeterinaryCondition = () => {
    const nextConditions = [...petVeterinaryConditions, { ...initialPetVeterinaryCondition }];
    setPetVeterinaryConditions(nextConditions);
    if (hasSubmitted) setErrors(validate(formData));
  };

  const removePetVeterinaryCondition = (index) => {
    if (petVeterinaryConditions.length <= 1) {
      return;
    }
    const nextConditions = petVeterinaryConditions.filter((_, rowIndex) => rowIndex !== index);
    setPetVeterinaryConditions(nextConditions);

    const nextForm = {
      ...formData,
      priorVeterinaryConditionsDetails: buildPetVeterinaryConditionsSummary(nextConditions),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const updateCyberIncident = (index, field, value) => {
    const normalized = field === 'costs' ? formatCurrencyInput(value) : value;
    const nextCyberIncidents = cyberIncidents.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setCyberIncidents(nextCyberIncidents);

    const nextForm = {
      ...formData,
      priorCyberIncidentsDetails: buildCyberIncidentsSummary(nextCyberIncidents),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const addCyberIncident = () => {
    const nextCyberIncidents = [...cyberIncidents, { ...initialCyberIncident }];
    setCyberIncidents(nextCyberIncidents);
    if (hasSubmitted) setErrors(validate(formData));
  };

  const removeCyberIncident = (index) => {
    if (cyberIncidents.length <= 1) {
      return;
    }
    const nextCyberIncidents = cyberIncidents.filter((_, rowIndex) => rowIndex !== index);
    setCyberIncidents(nextCyberIncidents);

    const nextForm = {
      ...formData,
      priorCyberIncidentsDetails: buildCyberIncidentsSummary(nextCyberIncidents),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const updateEoClaim = (index, field, value) => {
    const normalized = field === 'amount' ? formatCurrencyInput(value) : value;
    const nextEoClaims = eoClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setEoClaims(nextEoClaims);

    const nextForm = {
      ...formData,
      priorEoClaimsDetails: buildEoClaimsSummary(nextEoClaims),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const addEoClaim = () => {
    const nextEoClaims = [...eoClaims, { ...initialEoClaim }];
    setEoClaims(nextEoClaims);
    if (hasSubmitted) setErrors(validate(formData));
  };

  const removeEoClaim = (index) => {
    if (eoClaims.length <= 1) {
      return;
    }
    const nextEoClaims = eoClaims.filter((_, rowIndex) => rowIndex !== index);
    setEoClaims(nextEoClaims);

    const nextForm = {
      ...formData,
      priorEoClaimsDetails: buildEoClaimsSummary(nextEoClaims),
    };
    setFormData(nextForm);

    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const updateInlandMarineItem = (index, field, value) => {
    const normalized = field === 'value'
      ? formatCurrencyInput(value)
      : (field === 'year' ? String(value ?? '').replace(/\D/g, '').slice(0, 4) : value);

    const nextItems = inlandMarineItems.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setInlandMarineItems(nextItems);
    const nextForm = {
      ...formData,
      scheduleOfItems: buildInlandMarineItemsSummary(nextItems),
      totalInsuredValue: calculateInlandMarineTotalValue(nextItems),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const addInlandMarineItem = () => {
    const nextItems = [...inlandMarineItems, { ...initialInlandMarineItem }];
    setInlandMarineItems(nextItems);
    const nextForm = {
      ...formData,
      totalInsuredValue: calculateInlandMarineTotalValue(nextItems),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const removeInlandMarineItem = (index) => {
    if (inlandMarineItems.length <= 1) return;
    const nextItems = inlandMarineItems.filter((_, rowIndex) => rowIndex !== index);
    setInlandMarineItems(nextItems);
    const nextForm = {
      ...formData,
      scheduleOfItems: buildInlandMarineItemsSummary(nextItems),
      totalInsuredValue: calculateInlandMarineTotalValue(nextItems),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const updateInlandMarineClaim = (index, field, value) => {
    const normalized = field === 'amount' ? formatCurrencyInput(value) : value;
    const nextClaims = inlandMarineClaims.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [field]: normalized } : row
    ));
    setInlandMarineClaims(nextClaims);
    const nextForm = {
      ...formData,
      priorInlandMarineClaimsDetails: buildInlandMarineClaimsSummary(nextClaims),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const addInlandMarineClaim = () => {
    const nextClaims = [...inlandMarineClaims, { ...initialInlandMarineClaim }];
    setInlandMarineClaims(nextClaims);
    if (hasSubmitted) setErrors(validate(formData));
  };

  const removeInlandMarineClaim = (index) => {
    if (inlandMarineClaims.length <= 1) return;
    const nextClaims = inlandMarineClaims.filter((_, rowIndex) => rowIndex !== index);
    setInlandMarineClaims(nextClaims);
    const nextForm = {
      ...formData,
      priorInlandMarineClaimsDetails: buildInlandMarineClaimsSummary(nextClaims),
    };
    setFormData(nextForm);
    if (hasSubmitted) setErrors(validate(nextForm));
  };

  const handleContinue = () => {
    setHasSubmitted(true);
    const nextErrors = validate(formData);
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
        cyberIncidents,
        eoClaims,
        inlandMarineItems,
        inlandMarineClaims,
        petVeterinaryConditions,
        suretyBusinessFinancialStatementFile: suretyBusinessFinancialStatementFile?.name || '',
        suretyBusinessFinancialStatementAttachment,
      });
    }
    if (typeof onValidityChange === 'function') {
      onValidityChange(Object.keys(validate(formData)).length === 0);
    }
  }, [
    formData,
    cyberIncidents,
    eoClaims,
    inlandMarineItems,
    inlandMarineClaims,
    petVeterinaryConditions,
    suretyBusinessFinancialStatementFile,
    suretyBusinessFinancialStatementAttachment,
    onFormChange,
    onValidityChange,
  ]);

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
            <label className="quote-request__field"><span className="quote-request__field-label">Industry / Business Type <span className="quote-request__required-mark">*</span></span><select name="industryBusinessType" value={formData.industryBusinessType} onChange={handleChange} className={fieldError('industryBusinessType') ? 'quote-request__input--invalid' : ''}>{CYBER_INDUSTRY_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('industryBusinessType') ? <span className="quote-request__validation-message">{fieldError('industryBusinessType')}</span> : null}</label>
            {formData.industryBusinessType === 'other' ? <label className="quote-request__field"><span className="quote-request__field-label">Industry / Business Type - Other <span className="quote-request__required-mark">*</span></span><input name="industryBusinessTypeOther" value={formData.industryBusinessTypeOther} onChange={handleChange} className={fieldError('industryBusinessTypeOther') ? 'quote-request__input--invalid' : ''} />{fieldError('industryBusinessTypeOther') ? <span className="quote-request__validation-message">{fieldError('industryBusinessTypeOther')}</span> : null}</label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Revenue <span className="quote-request__required-mark">*</span></span><input name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} inputMode="decimal" className={fieldError('annualRevenue') ? 'quote-request__input--invalid' : ''} />{fieldError('annualRevenue') ? <span className="quote-request__validation-message">{fieldError('annualRevenue')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Records Containing PII <span className="quote-request__required-mark">*</span></span><input name="recordsContainingPii" value={formData.recordsContainingPii} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('recordsContainingPii') ? 'quote-request__input--invalid' : ''} />{fieldError('recordsContainingPii') ? <span className="quote-request__validation-message">{fieldError('recordsContainingPii')}</span> : null}</label>
            <div className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Types of Data Stored <span className="quote-request__required-mark">*</span></span>
              <div className="quote-request__inline-buttons" role="group" aria-label="Types of data stored">
                {CYBER_DATA_STORED_OPTIONS.map((opt) => {
                  const selectedValues = formData.typesOfDataStored ? formData.typesOfDataStored.split(',').filter(Boolean) : [];
                  const checked = selectedValues.includes(opt.value);
                  return (
                    <label key={opt.value} className="quote-request__checkbox-row">
                      <input
                        type="checkbox"
                        name="typesOfDataStored"
                        value={opt.value}
                        checked={checked}
                        onChange={handleCyberDataStoredChange}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              {fieldError('typesOfDataStored') ? <span className="quote-request__validation-message">{fieldError('typesOfDataStored')}</span> : null}
            </div>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual IT Security Budget</span><input name="annualItSecurityBudget" value={formData.annualItSecurityBudget} onChange={handleChange} inputMode="decimal" /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">MFA Implemented? <span className="quote-request__required-mark">*</span></span><select name="mfaImplemented" value={formData.mfaImplemented} onChange={handleChange} className={fieldError('mfaImplemented') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('mfaImplemented') ? <span className="quote-request__validation-message">{fieldError('mfaImplemented')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">EDR Software?</span><select name="edrSoftware" value={formData.edrSoftware} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Data Backup Procedures <span className="quote-request__required-mark">*</span></span><select name="dataBackupProcedures" value={formData.dataBackupProcedures} onChange={handleChange} className={fieldError('dataBackupProcedures') ? 'quote-request__input--invalid' : ''}>{CYBER_BACKUP_PROCEDURE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('dataBackupProcedures') ? <span className="quote-request__validation-message">{fieldError('dataBackupProcedures')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Encryption of Sensitive Data at Rest? <span className="quote-request__required-mark">*</span></span><select name="encryptionSensitiveData" value={formData.encryptionSensitiveData} onChange={handleChange} className={fieldError('encryptionSensitiveData') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('encryptionSensitiveData') ? <span className="quote-request__validation-message">{fieldError('encryptionSensitiveData')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Cyber Incidents or Claims? <span className="quote-request__required-mark">*</span></span><select name="priorCyberIncidentsClaims" value={formData.priorCyberIncidentsClaims} onChange={handleChange} className={fieldError('priorCyberIncidentsClaims') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorCyberIncidentsClaims') ? <span className="quote-request__validation-message">{fieldError('priorCyberIncidentsClaims')}</span> : null}</label>
            {formData.priorCyberIncidentsClaims === 'yes' ? (
              <div className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Prior Cyber Incident Details <span className="quote-request__required-mark">*</span></span>
                {cyberIncidents.map((row, index) => (
                  <div className="quote-request__claim-row" key={`cyber-incident-${index}`}>
                    <label className="quote-request__field">
                      <span className="quote-request__field-label">Date</span>
                      <input
                        name={`cyberIncidentDate${index}`}
                        type="date"
                        value={row.date}
                        onChange={(event) => updateCyberIncident(index, 'date', event.target.value)}
                      />
                    </label>
                    <label className="quote-request__field">
                      <span className="quote-request__field-label">Costs</span>
                      <input
                        name={`cyberIncidentCosts${index}`}
                        value={row.costs}
                        onChange={(event) => updateCyberIncident(index, 'costs', event.target.value)}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </label>
                    <label className="quote-request__field quote-request__field--full">
                      <span className="quote-request__field-label">Description</span>
                      <input
                        name={`cyberIncidentDescription${index}`}
                        value={row.description}
                        onChange={(event) => updateCyberIncident(index, 'description', event.target.value)}
                        placeholder="Incident details"
                      />
                    </label>
                    <label className="quote-request__field quote-request__field--full">
                      <span className="quote-request__field-label">Resolution</span>
                      <input
                        name={`cyberIncidentResolution${index}`}
                        value={row.resolution}
                        onChange={(event) => updateCyberIncident(index, 'resolution', event.target.value)}
                        placeholder="How incident was resolved"
                      />
                    </label>
                    {cyberIncidents.length > 1 ? (
                      <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeCyberIncident(index)}>
                        Remove Row
                      </button>
                    ) : null}
                    {fieldError(`cyberIncident${index}`) ? <span className="quote-request__validation-message">{fieldError(`cyberIncident${index}`)}</span> : null}
                  </div>
                ))}
                <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addCyberIncident}>Add Another Incident</button>
              </div>
            ) : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Ransomware Demand Limit Requested</span><select name="annualRansomwareDemandLimit" value={formData.annualRansomwareDemandLimit} onChange={handleChange}>{CYBER_RANSOMWARE_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'eo' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Professional Liability (E&O) Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Business Name <span className="quote-request__required-mark">*</span></span><input name="businessName" value={formData.businessName} onChange={handleChange} className={fieldError('businessName') ? 'quote-request__input--invalid' : ''} />{fieldError('businessName') ? <span className="quote-request__validation-message">{fieldError('businessName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Profession / Service Type <span className="quote-request__required-mark">*</span></span><select name="professionServiceType" value={formData.professionServiceType} onChange={handleChange} className={fieldError('professionServiceType') ? 'quote-request__input--invalid' : ''}>{EO_PROFESSION_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('professionServiceType') ? <span className="quote-request__validation-message">{fieldError('professionServiceType')}</span> : null}</label>
            {formData.professionServiceType === 'other' ? <label className="quote-request__field"><span className="quote-request__field-label">Profession / Service Type - Other <span className="quote-request__required-mark">*</span></span><input name="professionServiceTypeOther" value={formData.professionServiceTypeOther} onChange={handleChange} className={fieldError('professionServiceTypeOther') ? 'quote-request__input--invalid' : ''} />{fieldError('professionServiceTypeOther') ? <span className="quote-request__validation-message">{fieldError('professionServiceTypeOther')}</span> : null}</label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Years in Practice <span className="quote-request__required-mark">*</span></span><input name="yearsInPractice" value={formData.yearsInPractice} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" className={fieldError('yearsInPractice') ? 'quote-request__input--invalid' : ''} />{fieldError('yearsInPractice') ? <span className="quote-request__validation-message">{fieldError('yearsInPractice')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Number of Licensed Professionals <span className="quote-request__required-mark">*</span></span><input name="numberLicensedProfessionals" value={formData.numberLicensedProfessionals} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" className={fieldError('numberLicensedProfessionals') ? 'quote-request__input--invalid' : ''} />{fieldError('numberLicensedProfessionals') ? <span className="quote-request__validation-message">{fieldError('numberLicensedProfessionals')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Revenue from Professional Services <span className="quote-request__required-mark">*</span></span><input name="annualRevenueProfessionalServices" value={formData.annualRevenueProfessionalServices} onChange={handleChange} inputMode="decimal" className={fieldError('annualRevenueProfessionalServices') ? 'quote-request__input--invalid' : ''} />{fieldError('annualRevenueProfessionalServices') ? <span className="quote-request__validation-message">{fieldError('annualRevenueProfessionalServices')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior E&O Claims? <span className="quote-request__required-mark">*</span></span><select name="priorEoClaims" value={formData.priorEoClaims} onChange={handleChange} className={fieldError('priorEoClaims') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorEoClaims') ? <span className="quote-request__validation-message">{fieldError('priorEoClaims')}</span> : null}</label>
            {formData.priorEoClaims === 'yes' ? (
              <div className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Prior E&O Claims <span className="quote-request__required-mark">*</span></span>
                {eoClaims.map((row, index) => (
                  <div className="quote-request__claim-row" key={`eo-claim-${index}`}>
                    <label className="quote-request__field">
                      <span className="quote-request__field-label">Date</span>
                      <input
                        name={`eoClaimDate${index}`}
                        type="date"
                        value={row.date}
                        onChange={(event) => updateEoClaim(index, 'date', event.target.value)}
                      />
                    </label>
                    <label className="quote-request__field">
                      <span className="quote-request__field-label">Amount</span>
                      <input
                        name={`eoClaimAmount${index}`}
                        value={row.amount}
                        onChange={(event) => updateEoClaim(index, 'amount', event.target.value)}
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </label>
                    <label className="quote-request__field">
                      <span className="quote-request__field-label">Status</span>
                      <input
                        name={`eoClaimStatus${index}`}
                        value={row.status}
                        onChange={(event) => updateEoClaim(index, 'status', event.target.value)}
                        placeholder="Open / Closed / Settled"
                      />
                    </label>
                    {eoClaims.length > 1 ? (
                      <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeEoClaim(index)}>
                        Remove Row
                      </button>
                    ) : null}
                    {fieldError(`eoClaim${index}`) ? <span className="quote-request__validation-message">{fieldError(`eoClaim${index}`)}</span> : null}
                  </div>
                ))}
                <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addEoClaim}>Add Another Claim</button>
              </div>
            ) : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Services Provided Outside US?</span><select name="servicesProvidedOutsideUs" value={formData.servicesProvidedOutsideUs} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            {formData.servicesProvidedOutsideUs === 'yes' ? <label className="quote-request__field"><span className="quote-request__field-label">Country / Countries Served Outside US <span className="quote-request__required-mark">*</span></span><input name="servicesProvidedOutsideUsCountries" value={formData.servicesProvidedOutsideUsCountries} onChange={handleChange} className={fieldError('servicesProvidedOutsideUsCountries') ? 'quote-request__input--invalid' : ''} />{fieldError('servicesProvidedOutsideUsCountries') ? <span className="quote-request__validation-message">{fieldError('servicesProvidedOutsideUsCountries')}</span> : null}</label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Retroactive Date Requested <span className="quote-request__required-mark">*</span></span><input name="retroactiveDateRequested" type="date" value={formData.retroactiveDateRequested} onChange={handleChange} className={fieldError('retroactiveDateRequested') ? 'quote-request__input--invalid' : ''} />{fieldError('retroactiveDateRequested') ? <span className="quote-request__validation-message">{fieldError('retroactiveDateRequested')}</span> : null}</label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'inland-marine' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Inland Marine Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Type of Equipment or Property <span className="quote-request__required-mark">*</span></span><select name="equipmentPropertyType" value={formData.equipmentPropertyType} onChange={handleChange} className={fieldError('equipmentPropertyType') ? 'quote-request__input--invalid' : ''}>{INLAND_MARINE_EQUIPMENT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('equipmentPropertyType') ? <span className="quote-request__validation-message">{fieldError('equipmentPropertyType')}</span> : null}</label>
            {formData.equipmentPropertyType === 'other' ? <label className="quote-request__field"><span className="quote-request__field-label">Type of Equipment or Property - Other <span className="quote-request__required-mark">*</span></span><input name="equipmentPropertyTypeOther" value={formData.equipmentPropertyTypeOther} onChange={handleChange} className={fieldError('equipmentPropertyTypeOther') ? 'quote-request__input--invalid' : ''} />{fieldError('equipmentPropertyTypeOther') ? <span className="quote-request__validation-message">{fieldError('equipmentPropertyTypeOther')}</span> : null}</label> : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Total Insured Value <span className="quote-request__required-mark">*</span></span><input name="totalInsuredValue" value={formData.totalInsuredValue} readOnly className={fieldError('totalInsuredValue') ? 'quote-request__input--invalid' : ''} />{fieldError('totalInsuredValue') ? <span className="quote-request__validation-message">{fieldError('totalInsuredValue')}</span> : null}</label>
            <div className="quote-request__field quote-request__field--full">
              <span className="quote-request__field-label">Schedule of Items <span className="quote-request__required-mark">*</span></span>
              {inlandMarineItems.map((row, index) => (
                <div className="quote-request__claim-row" key={`inland-item-${index}`}>
                  <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Item Description</span><input name={`inlandMarineItemDescription${index}`} value={row.itemDescription} onChange={(event) => updateInlandMarineItem(index, 'itemDescription', event.target.value)} /></label>
                  <label className="quote-request__field"><span className="quote-request__field-label">Year</span><input name={`inlandMarineItemYear${index}`} value={row.year} onChange={(event) => updateInlandMarineItem(index, 'year', event.target.value)} inputMode="numeric" maxLength={4} pattern="\d{4}" placeholder="YYYY" /></label>
                  <label className="quote-request__field"><span className="quote-request__field-label">Make/Model</span><input name={`inlandMarineItemMakeModel${index}`} value={row.makeModel} onChange={(event) => updateInlandMarineItem(index, 'makeModel', event.target.value)} /></label>
                  <label className="quote-request__field"><span className="quote-request__field-label">Serial Number</span><input name={`inlandMarineItemSerialNumber${index}`} value={row.serialNumber} onChange={(event) => updateInlandMarineItem(index, 'serialNumber', event.target.value)} /></label>
                  <label className="quote-request__field"><span className="quote-request__field-label">Value</span><input name={`inlandMarineItemValue${index}`} value={row.value} onChange={(event) => updateInlandMarineItem(index, 'value', event.target.value)} inputMode="decimal" placeholder="0.00" /></label>
                  {inlandMarineItems.length > 1 ? (
                    <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeInlandMarineItem(index)}>
                      Remove Row
                    </button>
                  ) : null}
                  {fieldError(`inlandMarineItem${index}`) ? <span className="quote-request__validation-message">{fieldError(`inlandMarineItem${index}`)}</span> : null}
                </div>
              ))}
              <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addInlandMarineItem}>Add Another Item</button>
            </div>
            <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Storage Street Address <span className="quote-request__required-mark">*</span></span><input name="storageStreetAddress" value={formData.storageStreetAddress} onChange={handleChange} className={fieldError('storageStreetAddress') ? 'quote-request__input--invalid' : ''} />{fieldError('storageStreetAddress') ? <span className="quote-request__validation-message">{fieldError('storageStreetAddress')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Storage Unit Number</span><input name="storageUnitNumber" value={formData.storageUnitNumber} onChange={handleChange} /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Storage City <span className="quote-request__required-mark">*</span></span><input name="storageCity" value={formData.storageCity} onChange={handleChange} className={fieldError('storageCity') ? 'quote-request__input--invalid' : ''} />{fieldError('storageCity') ? <span className="quote-request__validation-message">{fieldError('storageCity')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Storage State <span className="quote-request__required-mark">*</span></span><input name="storageState" value={formData.storageState} onChange={handleChange} className={fieldError('storageState') ? 'quote-request__input--invalid' : ''} />{fieldError('storageState') ? <span className="quote-request__validation-message">{fieldError('storageState')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Storage ZIP <span className="quote-request__required-mark">*</span></span><input name="storageZip" value={formData.storageZip} onChange={handleChange} inputMode="numeric" maxLength={10} className={fieldError('storageZip') ? 'quote-request__input--invalid' : ''} />{fieldError('storageZip') ? <span className="quote-request__validation-message">{fieldError('storageZip')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Primarily In-Transit or Stored? <span className="quote-request__required-mark">*</span></span><select name="inTransitOrStored" value={formData.inTransitOrStored} onChange={handleChange} className={fieldError('inTransitOrStored') ? 'quote-request__input--invalid' : ''}>{INLAND_MARINE_TRANSIT_STORED_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('inTransitOrStored') ? <span className="quote-request__validation-message">{fieldError('inTransitOrStored')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Inland Marine Claims?</span><select name="priorInlandMarineClaims" value={formData.priorInlandMarineClaims} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            {formData.priorInlandMarineClaims === 'yes' ? (
              <div className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Prior Inland Marine Claims</span>
                {inlandMarineClaims.map((row, index) => (
                  <div className="quote-request__claim-row" key={`inland-claim-${index}`}>
                    <label className="quote-request__field"><span className="quote-request__field-label">Date</span><input name={`inlandMarineClaimDate${index}`} type="date" value={row.date} onChange={(event) => updateInlandMarineClaim(index, 'date', event.target.value)} /></label>
                    <label className="quote-request__field"><span className="quote-request__field-label">Amount</span><input name={`inlandMarineClaimAmount${index}`} value={row.amount} onChange={(event) => updateInlandMarineClaim(index, 'amount', event.target.value)} inputMode="decimal" placeholder="0.00" /></label>
                    <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Description</span><input name={`inlandMarineClaimDescription${index}`} value={row.description} onChange={(event) => updateInlandMarineClaim(index, 'description', event.target.value)} /></label>
                    {inlandMarineClaims.length > 1 ? (
                      <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removeInlandMarineClaim(index)}>
                        Remove Row
                      </button>
                    ) : null}
                    {fieldError(`inlandMarineClaim${index}`) ? <span className="quote-request__validation-message">{fieldError(`inlandMarineClaim${index}`)}</span> : null}
                  </div>
                ))}
                <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addInlandMarineClaim}>Add Another Claim</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'surety-bond' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Surety Bond Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Type Requested <span className="quote-request__required-mark">*</span></span><select name="bondTypeRequested" value={formData.bondTypeRequested} onChange={handleChange} className={fieldError('bondTypeRequested') ? 'quote-request__input--invalid' : ''}>{SURETY_BOND_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('bondTypeRequested') ? <span className="quote-request__validation-message">{fieldError('bondTypeRequested')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Obligee Name <span className="quote-request__required-mark">*</span></span><input name="obligeeName" value={formData.obligeeName} onChange={handleChange} className={fieldError('obligeeName') ? 'quote-request__input--invalid' : ''} />{fieldError('obligeeName') ? <span className="quote-request__validation-message">{fieldError('obligeeName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Amount (Penal Sum) <span className="quote-request__required-mark">*</span></span><input name="bondAmountPenalSum" value={formData.bondAmountPenalSum} onChange={handleChange} inputMode="decimal" className={fieldError('bondAmountPenalSum') ? 'quote-request__input--invalid' : ''} />{fieldError('bondAmountPenalSum') ? <span className="quote-request__validation-message">{fieldError('bondAmountPenalSum')}</span> : null}</label>
            <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Purpose of Bond <span className="quote-request__required-mark">*</span></span><input name="purposeOfBond" value={formData.purposeOfBond} onChange={handleChange} className={fieldError('purposeOfBond') ? 'quote-request__input--invalid' : ''} />{fieldError('purposeOfBond') ? <span className="quote-request__validation-message">{fieldError('purposeOfBond')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Bond Term / Duration <span className="quote-request__required-mark">*</span></span><select name="bondTermDuration" value={formData.bondTermDuration} onChange={handleChange} className={fieldError('bondTermDuration') ? 'quote-request__input--invalid' : ''}>{SURETY_BOND_TERM_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('bondTermDuration') ? <span className="quote-request__validation-message">{fieldError('bondTermDuration')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Principal's Personal Credit Score (approximate) <span className="quote-request__required-mark">*</span></span><select name="principalPersonalCreditScore" value={formData.principalPersonalCreditScore} onChange={handleChange} className={fieldError('principalPersonalCreditScore') ? 'quote-request__input--invalid' : ''}>{SURETY_CREDIT_SCORE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('principalPersonalCreditScore') ? <span className="quote-request__validation-message">{fieldError('principalPersonalCreditScore')}</span> : null}</label>
            <label className="quote-request__field">
              <span className="quote-request__field-label">Business Financial Statements (Upload Document)</span>
              <input
                name="businessFinancialStatements"
                type="file"
                ref={suretyBusinessFinancialStatementFileInputRef}
                onChange={handleSuretyBusinessFinancialStatementFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp"
              />
              {suretyBusinessFinancialStatementFile ? (
                <>
                  <span className="quote-request__field-helper">Selected file: {suretyBusinessFinancialStatementFile.name}</span>
                  <div className="quote-request__inline-buttons">
                    <button className="quote-request__inline-secondary" type="button" onClick={handleRemoveSuretyBusinessFinancialStatementFile}>
                      Remove File
                    </button>
                  </div>
                </>
              ) : null}
            </label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Bond Claims or Default? <span className="quote-request__required-mark">*</span></span><select name="priorBondClaimsDefault" value={formData.priorBondClaimsDefault} onChange={handleChange} className={fieldError('priorBondClaimsDefault') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorBondClaimsDefault') ? <span className="quote-request__validation-message">{fieldError('priorBondClaimsDefault')}</span> : null}</label>
          </div>
        </div>
      ) : null}

      {formData.specialtyType === 'pet' ? (
        <div className="quote-request__section">
          <h4 className="quote-request__section-title">Pet Insurance Intake</h4>
          <div className="quote-request__grid">
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Name <span className="quote-request__required-mark">*</span></span><input name="petName" value={formData.petName} onChange={handleChange} className={fieldError('petName') ? 'quote-request__input--invalid' : ''} />{fieldError('petName') ? <span className="quote-request__validation-message">{fieldError('petName')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Species <span className="quote-request__required-mark">*</span></span><select name="petSpecies" value={formData.petSpecies} onChange={handleChange} className={fieldError('petSpecies') ? 'quote-request__input--invalid' : ''}>{PET_SPECIES_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('petSpecies') ? <span className="quote-request__validation-message">{fieldError('petSpecies')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Breed <span className="quote-request__required-mark">*</span></span><input name="petBreed" value={formData.petBreed} onChange={handleChange} className={fieldError('petBreed') ? 'quote-request__input--invalid' : ''} />{fieldError('petBreed') ? <span className="quote-request__validation-message">{fieldError('petBreed')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Age - Years <span className="quote-request__required-mark">*</span></span><input name="petAgeYears" value={formData.petAgeYears} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('petAge') || fieldError('petAgeYears') ? 'quote-request__input--invalid' : ''} />{fieldError('petAgeYears') ? <span className="quote-request__validation-message">{fieldError('petAgeYears')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Age - Months <span className="quote-request__required-mark">*</span></span><input name="petAgeMonths" value={formData.petAgeMonths} onChange={handleChange} inputMode="numeric" pattern="\d+" className={fieldError('petAge') || fieldError('petAgeMonths') ? 'quote-request__input--invalid' : ''} />{fieldError('petAgeMonths') ? <span className="quote-request__validation-message">{fieldError('petAgeMonths')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Gender <span className="quote-request__required-mark">*</span></span><select name="petGender" value={formData.petGender} onChange={handleChange} className={fieldError('petGender') ? 'quote-request__input--invalid' : ''}>{PET_GENDER_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('petGender') ? <span className="quote-request__validation-message">{fieldError('petGender')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Weight (lbs)</span><input name="petWeight" value={formData.petWeight} onChange={handleChange} inputMode="numeric" pattern="[\d,]+" className={fieldError('petWeight') ? 'quote-request__input--invalid' : ''} />{fieldError('petWeight') ? <span className="quote-request__validation-message">{fieldError('petWeight')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Pet Color / Markings</span><input name="petColorMarkings" value={formData.petColorMarkings} onChange={handleChange} /></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Microchipped?</span><select name="microchipped" value={formData.microchipped} onChange={handleChange}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select></label>
            <label className="quote-request__field"><span className="quote-request__field-label">Prior Veterinary Conditions? <span className="quote-request__required-mark">*</span></span><select name="priorVeterinaryConditions" value={formData.priorVeterinaryConditions} onChange={handleChange} className={fieldError('priorVeterinaryConditions') ? 'quote-request__input--invalid' : ''}>{YES_NO_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('priorVeterinaryConditions') ? <span className="quote-request__validation-message">{fieldError('priorVeterinaryConditions')}</span> : null}</label>
            {formData.priorVeterinaryConditions === 'yes' ? (
              <div className="quote-request__field quote-request__field--full">
                <span className="quote-request__field-label">Prior Veterinary Conditions</span>
                {petVeterinaryConditions.map((row, index) => (
                  <div className="quote-request__claim-row" key={`pet-condition-${index}`}>
                    <label className="quote-request__field quote-request__field--full"><span className="quote-request__field-label">Condition</span><input name={`petConditionName${index}`} value={row.condition} onChange={(event) => updatePetVeterinaryCondition(index, 'condition', event.target.value)} /></label>
                    <label className="quote-request__field"><span className="quote-request__field-label">Diagnosis Date</span><input name={`petConditionDiagnosisDate${index}`} type="date" value={row.diagnosisDate} onChange={(event) => updatePetVeterinaryCondition(index, 'diagnosisDate', event.target.value)} /></label>
                    <label className="quote-request__field"><span className="quote-request__field-label">Treatment Cost</span><input name={`petConditionTreatmentCost${index}`} value={row.treatmentCost} onChange={(event) => updatePetVeterinaryCondition(index, 'treatmentCost', event.target.value)} inputMode="decimal" placeholder="0.00" /></label>
                    {petVeterinaryConditions.length > 1 ? (
                      <button className="quote-request__inline-secondary quote-request__inline-secondary--remove-row" type="button" onClick={() => removePetVeterinaryCondition(index)}>
                        Remove Row
                      </button>
                    ) : null}
                    {fieldError(`petCondition${index}`) ? <span className="quote-request__validation-message">{fieldError(`petCondition${index}`)}</span> : null}
                  </div>
                ))}
                <button className="quote-request__inline-secondary" style={{ width: 'fit-content' }} type="button" onClick={addPetVeterinaryCondition}>Add Another Condition</button>
              </div>
            ) : null}
            <label className="quote-request__field"><span className="quote-request__field-label">Coverage Type <span className="quote-request__required-mark">*</span></span><select name="coverageType" value={formData.coverageType} onChange={handleChange} className={fieldError('coverageType') ? 'quote-request__input--invalid' : ''}>{PET_COVERAGE_TYPE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('coverageType') ? <span className="quote-request__validation-message">{fieldError('coverageType')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Deductible <span className="quote-request__required-mark">*</span></span><select name="annualDeductible" value={formData.annualDeductible} onChange={handleChange} className={fieldError('annualDeductible') ? 'quote-request__input--invalid' : ''}>{PET_ANNUAL_DEDUCTIBLE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('annualDeductible') ? <span className="quote-request__validation-message">{fieldError('annualDeductible')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Reimbursement Package <span className="quote-request__required-mark">*</span></span><select name="reimbursementPercentage" value={formData.reimbursementPercentage} onChange={handleChange} className={fieldError('reimbursementPercentage') ? 'quote-request__input--invalid' : ''}>{PET_REIMBURSEMENT_PACKAGE_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('reimbursementPercentage') ? <span className="quote-request__validation-message">{fieldError('reimbursementPercentage')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Annual Benefit Limit <span className="quote-request__required-mark">*</span></span><select name="annualBenefitLimit" value={formData.annualBenefitLimit} onChange={handleChange} className={fieldError('annualBenefitLimit') ? 'quote-request__input--invalid' : ''}>{PET_ANNUAL_BENEFIT_LIMIT_OPTIONS.map((opt) => <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>)}</select>{fieldError('annualBenefitLimit') ? <span className="quote-request__validation-message">{fieldError('annualBenefitLimit')}</span> : null}</label>
            <label className="quote-request__field"><span className="quote-request__field-label">Veterinarian Name & Clinic</span><input name="veterinarianClinic" value={formData.veterinarianClinic} onChange={handleChange} /></label>
          </div>
        </div>
      ) : null}

      <div className="quote-request__actions" style={{ justifyContent: 'flex-end' }}>
        <button className="quote-request__preview-trigger" type="button" onClick={handleContinue}>Preview Form</button>
      </div>
    </section>
  );
}

export default SpecialtyForm;
