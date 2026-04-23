const toTitleCase = (value = '') =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const YES_NO_LABELS = {
  yes: 'Yes',
  no: 'No',
};

const FIELD_VALUE_LABELS = {
  businessEntityType: {
    'sole-proprietor': 'Sole Proprietor',
    llc: 'LLC',
    partnership: 'Partnership',
    's-corp': 'S-Corp',
    'c-corp': 'C-Corp',
    'non-profit': 'Non-Profit',
  },
  industryType: {
    contractor: 'Contractor',
    'delivery-logistics': 'Delivery / Logistics',
    'artisan-trade': 'Artisan Trade',
    'professional-services': 'Professional Services',
    'retail-wholesale': 'Retail / Wholesale',
    other: 'Other',
  },
  industryTypeOfBusiness: {
    contractor: 'Contractor',
    'retail-wholesale': 'Retail / Wholesale',
    'professional-services': 'Professional Services',
    'hospitality-food': 'Hospitality / Food',
    manufacturing: 'Manufacturing',
    other: 'Other',
  },
  policyTerm: {
    'annual-12-months': 'Annual (12 Months)',
    'short-term': 'Short-Term',
    other: 'Other',
  },
  personalAdvertisingInjuryLimit: {
    'match-occurrence': 'Standard (Match Occurrence)',
    custom: 'Custom Amount',
  },
  umbrellaPolicyType: {
    'personal-umbrella': 'Personal Umbrella',
    'commercial-umbrella': 'Commercial Umbrella',
    'excess-liability': 'Excess Liability',
  },
  underlyingAutoBiPdLimits: {
    '100-300': '100/300',
    '250-500': '250/500',
    '300-csl': '300 CSL',
    '500-csl': '500 CSL',
  },
  underlyingGlLimits: {
    '1m': '$1M',
    '2m': '$2M',
  },
  umbrellaLimit: {
    '1m': '$1M',
    '2m': '$2M',
    '3m': '$3M',
    '5m': '$5M',
    '10m': '$10M',
  },
  selfInsuredRetentionSir: {
    '0': '$0',
    '250': '$250',
    '500': '$500',
    '1000': '$1,000',
  },
  vehicleGvwr: {
    'under-10000': 'Under 10,000',
    '10001-26000': '10,001-26,000',
    'over-26000': 'Over 26,000',
  },
  vehiclePrimaryUse: {
    'transport-goods': 'Transport of Goods',
    'service-repair-calls': 'Service / Repair Calls',
    'employee-transport': 'Employee Transport',
    'pickup-delivery': 'Pickup / Delivery',
    farm: 'Farm',
    other: 'Other',
  },
  vehicleRadiusOfOperation: {
    'local-under-50': 'Local (<50 miles)',
    'intermediate-50-200': 'Intermediate (50-200 miles)',
    'long-haul-200-plus': 'Long-Haul (200+)',
  },
  bodilyInjuryLiabilityLimits: {
    '25-50': '25/50',
    '50-100': '50/100',
    '100-300': '100/300',
    'csl-300000': 'CSL $300,000',
    'csl-500000': 'CSL $500,000',
    'csl-1000000': 'CSL $1,000,000',
  },
  specialtyType: {
    cyber: 'Cyber Liability',
    eo: 'Professional Liability (E&O)',
    'inland-marine': 'Inland Marine',
    'surety-bond': 'Surety Bond',
    pet: 'Pet Insurance',
  },
  femaFloodZone: {
    x: 'Zone X',
    ae: 'Zone AE',
    ao: 'Zone AO',
    ve: 'Zone VE',
    a: 'Zone A',
    other: 'Other',
  },
  propertyType: {
    'single-family': 'Single Family',
    '2-4-unit-condo-ho6': '2-4 Unit / Condo (HO6)',
    renters: 'Renters',
    commercial: 'Commercial',
    other: 'Other',
  },
  maritalStatus: {
    single: 'Single',
    married: 'Married',
    divorced: 'Divorced',
    widowed: 'Widowed',
    separated: 'Separated',
    'domestic-partner': 'Domestic Partner',
    other: 'Other',
  },
  gender: {
    female: 'Female',
    male: 'Male',
    'non-binary': 'Non-binary',
    other: 'Other',
    'prefer-not-to-say': 'Prefer not to say',
  },
  preferredLanguage: {
    english: 'English',
    spanish: 'Spanish',
    tagalog: 'Tagalog',
    mandarin: 'Mandarin',
    vietnamese: 'Vietnamese',
    korean: 'Korean',
    other: 'Other',
  },
};

const valueLabel = (rawValue, map = null) => {
  const value = String(rawValue ?? '').trim();
  if (!value) {
    return '';
  }

  if (map && map[value]) {
    return map[value];
  }

  if (YES_NO_LABELS[value]) {
    return YES_NO_LABELS[value];
  }

  if (value.includes(',')) {
    return value
      .split(',')
      .map((entry) => valueLabel(entry, map))
      .filter(Boolean)
      .join(', ');
  }

  // Convert code-like option values to display labels,
  // while preserving user-entered mixed-case/free text.
  const looksLikeCodeValue = value.includes('-') || value.includes('_');
  if (looksLikeCodeValue) {
    return toTitleCase(value);
  }

  return value;
};

const nonEmpty = (value) => String(value ?? '').trim() !== '';

const buildSection = (title, rows) => ({
  title,
  fields: rows.map((row) => ({
    ...row,
    value: nonEmpty(row.value) ? row.value : '-',
  })),
});

const mapRows = (form, definitions) =>
  definitions.map((definition) => ({
    label: definition.label,
    value: valueLabel(form[definition.key], definition.valueMap || FIELD_VALUE_LABELS[definition.key]),
  }));

const formatCollection = (items = [], fieldDefs = []) => {
  const safeItems = Array.isArray(items) ? items : [];
  const normalizedItems = safeItems
    .map((item) =>
      fieldDefs
        .map((field) => `${field.label}: ${valueLabel(item?.[field.key]) || '-'}`)
        .join(' | ')
    )
    .filter(Boolean);

  return normalizedItems.length > 0 ? normalizedItems.join('\n') : '';
};

const formatCollectionRows = (items = [], entryLabel = 'Item', fieldDefs = []) => {
  const safeItems = Array.isArray(items) ? items : [];

  return safeItems.flatMap((item, index) =>
    fieldDefs.map((field) => ({
      label: `${entryLabel} ${index + 1} - ${field.label}`,
      value: valueLabel(item?.[field.key], field.valueMap || FIELD_VALUE_LABELS[field.key]),
    }))
  );
};

const valueToDisplay = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => valueToDisplay(entry)).filter(nonEmpty).join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return json && json !== '{}' ? json : '';
  }

  return valueLabel(value);
};

export const buildUniversalSections = (form = {}) => {
  const address = [form.mailingStreet, form.mailingCity, form.mailingState, form.mailingZip]
    .filter(nonEmpty)
    .join(', ');

  return [
    buildSection('Identity and Contact', [
      { label: 'Full Name', value: form.fullLegalName || [form.firstName, form.middleName, form.lastName].filter(nonEmpty).join(' ') },
      { label: 'Email', value: form.emailAddress },
      { label: 'Phone', value: form.contactPhone },
      { label: 'Address', value: address },
      { label: 'Date of Birth', value: form.dateOfBirth },
    ]),
    buildSection('Identity Verification and Demographics', mapRows(form, [
      { key: 'ssnLast4', label: 'SSN (Last 4 Digits)' },
      { key: 'fullSsn', label: 'Full SSN (9 Digits)' },
      { key: 'maritalStatus', label: 'Marital Status' },
      { key: 'gender', label: 'Gender' },
      { key: 'preferredLanguage', label: 'Preferred Language' },
      { key: 'preferredLanguageOther', label: 'Preferred Language (Other)' },
    ])),
    buildSection('Prior Insurance Information', mapRows(form, [
      { key: 'priorInsuranceCarrier', label: 'Prior Insurance Carrier' },
      { key: 'priorPolicyDate', label: 'Prior Policy Expiration / Cancellation Date' },
      { key: 'priorPolicyReason', label: 'Prior Policy Cancellation / Non-Renewal Reason' },
      { key: 'priorPolicyReasonDetails', label: 'Reason Details' },
    ])),
    buildSection('Loss / Claims History', (Array.isArray(form.claimsHistory) ? form.claimsHistory : [])
      .flatMap((claim, index) => ([
        { label: `Claim ${index + 1} Date`, value: claim.date },
        { label: `Claim ${index + 1} Type`, value: claim.type },
        { label: `Claim ${index + 1} Paid Amount`, value: claim.paidAmount },
      ]))),
    buildSection('Consent and Signature', mapRows(form, [
      { key: 'consentSoftCredit', label: 'Consent to Soft Credit Inquiry', valueMap: { true: 'Yes', false: 'No' } },
      { key: 'consentElectronicDelivery', label: 'Consent to Electronic Delivery', valueMap: { true: 'Yes', false: 'No' } },
      { key: 'electronicSignature', label: 'Electronic Signature' },
      { key: 'applicantNotes', label: 'Additional Notes' },
    ])),
  ];
};

const buildHo3Sections = (form = {}) => [
  buildSection('Property and Occupancy', mapRows(form, [
    { key: 'insuredStreet', label: 'Insured Property Street Address' },
    { key: 'insuredCity', label: 'City' },
    { key: 'insuredState', label: 'State' },
    { key: 'insuredZip', label: 'ZIP' },
    { key: 'county', label: 'County' },
    { key: 'propertyOwnershipStatus', label: 'Property Ownership Status' },
    { key: 'occupancyType', label: 'Occupancy Type' },
    { key: 'yearsOwned', label: 'Years Owned' },
    { key: 'purchaseDate', label: 'Purchase Date' },
    { key: 'purchasePrice', label: 'Purchase Price' },
  ])),
  buildSection('Construction Details', mapRows(form, [
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'squareFootage', label: 'Square Footage (Heated)' },
    { key: 'numberOfStories', label: 'Number of Stories' },
    { key: 'foundationType', label: 'Foundation Type' },
    { key: 'constructionType', label: 'Construction Type / Frame' },
    { key: 'exteriorWallMaterial', label: 'Exterior Wall Material' },
    { key: 'roofTypeMaterial', label: 'Roof Type (Material)' },
    { key: 'roofShape', label: 'Roof Shape' },
    { key: 'roofAge', label: 'Roof Age (Year Last Replaced)' },
    { key: 'roofCondition', label: 'Roof Condition' },
    { key: 'numberOfBathrooms', label: 'Number of Bathrooms' },
    { key: 'garageType', label: 'Garage Type' },
    { key: 'garageCapacity', label: 'Garage Capacity (# of Cars)' },
  ])),
  buildSection('Liability and Property Exposures', mapRows(form, [
    { key: 'poolOnProperty', label: 'Pool on Property?' },
    { key: 'poolType', label: 'Pool Type' },
    { key: 'poolFencedSecured', label: 'Pool Fenced / Secured?' },
    { key: 'trampolineOnProperty', label: 'Trampoline on Property?' },
    { key: 'dogsOnProperty', label: 'Dogs on Property?' },
    { key: 'dogBreedAndNumber', label: 'Dog Breed(s) and Number' },
    { key: 'priorDogBiteHistory', label: 'Prior Dog Bite History?' },
    { key: 'businessConductedOnPremises', label: 'Business Conducted on Premises?' },
    { key: 'typeOfBusiness', label: 'Type of Business' },
    { key: 'woodstoveFireplace', label: 'Woodstove / Fireplace?' },
    { key: 'oilTankOnProperty', label: 'Oil Tank on Property?' },
    { key: 'solarPanelsInstalled', label: 'Solar Panels Installed?' },
    { key: 'numberOfUnitsOnProperty', label: 'Number of Units on Property' },
  ])),
  buildSection('Protection and Hazard Details', mapRows(form, [
    { key: 'centralBurglarAlarm', label: 'Central Burglar Alarm?' },
    { key: 'centralFireAlarm', label: 'Central Fire Alarm?' },
    { key: 'smokeDetectors', label: 'Smoke Detectors?' },
    { key: 'sprinklerSystem', label: 'Sprinkler System?' },
    { key: 'deadboltLocks', label: 'Deadbolt Locks?' },
    { key: 'gatedCommunity', label: 'Gated Community?' },
    { key: 'fireExtinguisherOnPremises', label: 'Fire Extinguisher on Premises?' },
    { key: 'stormShuttersHurricaneClips', label: 'Storm Shutters / Hurricane Clips?' },
    { key: 'femaFloodZoneClassification', label: 'FEMA Flood Zone Classification' },
    { key: 'wildfireRiskZone', label: 'Wildfire Risk Zone' },
  ])),
  buildSection('Coverage and Deductibles', mapRows(form, [
    { key: 'requestedDwellingCoverage', label: 'Requested Dwelling Coverage (A)' },
    { key: 'useBuiltInReplacementCostEstimator', label: 'Use Built-In Replacement Cost Estimator?' },
    { key: 'otherStructuresCoverage', label: 'Other Structures Coverage (B)' },
    { key: 'personalPropertyCoverage', label: 'Personal Property Coverage (C)' },
    { key: 'lossOfUseCoverage', label: 'Loss of Use Coverage (D)' },
    { key: 'liabilityCoverage', label: 'Liability Coverage (E)' },
    { key: 'medicalPayments', label: 'Medical Payments (F)' },
    { key: 'allPerilDeductible', label: 'All-Peril Deductible' },
    { key: 'windHailDeductible', label: 'Wind / Hail Deductible' },
    { key: 'waterBackupSewerEndorsement', label: 'Water Backup / Sewer Endorsement?' },
    { key: 'equipmentBreakdownCoverage', label: 'Equipment Breakdown Coverage?' },
    { key: 'scheduledPersonalProperty', label: 'Scheduled Personal Property?' },
    { key: 'identityTheftCoverage', label: 'Identity Theft Coverage?' },
    { key: 'serviceLineCoverage', label: 'Service Line Coverage?' },
    { key: 'inflationGuardCoverage', label: 'Inflation Guard / Guaranteed Replacement Cost?' },
    { key: 'ordinanceLawCoverage', label: 'Ordinance or Law Coverage?' },
    { key: 'earthquakeCoverage', label: 'Earthquake Coverage?' },
    { key: 'floodCoverage', label: 'Flood Coverage?' },
    { key: 'mortgageLenderName', label: 'Mortgage Lender Name' },
    { key: 'mortgageLenderLoanNumber', label: 'Mortgage Lender Loan Number' },
    { key: 'mortgageLenderAddress', label: 'Mortgage Lender Address' },
    { key: 'effectiveDateRequested', label: 'Effective Date Requested' },
  ])),
];

const buildHo4Sections = (form = {}) => [
  buildSection('Rental Property Details', mapRows(form, [
    { key: 'rentalStreetAddress', label: 'Street Address' },
    { key: 'rentalUnitNumber', label: 'Unit Number' },
    { key: 'rentalCity', label: 'City' },
    { key: 'rentalState', label: 'State' },
    { key: 'rentalZip', label: 'ZIP' },
    { key: 'typeOfRentalUnit', label: 'Type of Rental Unit' },
    { key: 'yearBuildingBuilt', label: 'Year Building Built' },
    { key: 'floorOfUnit', label: 'Floor of Unit' },
    { key: 'buildingConstructionType', label: 'Building Construction Type' },
    { key: 'monthlyRentAmount', label: 'Monthly Rent Amount' },
  ])),
  buildSection('Coverage and Endorsements', mapRows(form, [
    { key: 'personalPropertyCoverage', label: 'Personal Property Coverage (Coverage C)' },
    { key: 'lossOfUseCoverage', label: 'Loss of Use / Additional Living Expense' },
    { key: 'liabilityCoverage', label: 'Liability Coverage (Coverage E)' },
    { key: 'medicalPaymentsToOthers', label: 'Medical Payments to Others' },
    { key: 'deductible', label: 'Deductible' },
    { key: 'highValueItemsToSchedule', label: 'High-Value Items to Schedule?' },
    { key: 'waterBackupEndorsement', label: 'Water Backup Endorsement?' },
    { key: 'identityTheftCoverage', label: 'Identity Theft Coverage?' },
    { key: 'petInUnit', label: 'Pet in Unit?' },
    { key: 'petBreedDetails', label: 'Pet Breed and Details' },
    { key: 'effectiveDate', label: 'Effective Date' },
  ])),
];

const buildHo6Sections = (form = {}) => [
  buildSection('Condo and Building Profile', mapRows(form, [
    { key: 'condoUnitAddress', label: 'Condo / Unit Address' },
    { key: 'buildingComplexName', label: 'Building / Complex Name' },
    { key: 'yearBuildingBuilt', label: 'Year Building Built' },
    { key: 'floorNumberOfUnit', label: 'Floor Number of Unit' },
    { key: 'totalFloorsInBuilding', label: 'Total Floors in Building' },
    { key: 'constructionTypeOfBuilding', label: 'Construction Type of Building' },
    { key: 'squareFootageOfUnit', label: 'Square Footage of Unit' },
    { key: 'numberOfRooms', label: 'Number of Rooms' },
    { key: 'unitOwnershipStatus', label: 'Unit Ownership Status' },
    { key: 'hoaMasterPolicyCoverageType', label: 'HOA Master Policy Coverage Type' },
    { key: 'hoaMasterPolicyDeductible', label: 'HOA Master Policy Deductible' },
    { key: 'hoaMasterPolicyCarrierPolicyNumber', label: 'HOA Master Policy Carrier / Policy Number' },
  ])),
  buildSection('Unit Renovation and Interior Details', mapRows(form, [
    { key: 'unitFullyRenovated', label: 'Unit Fully Renovated?' },
    { key: 'yearOfLastRenovation', label: 'Year of Last Renovation' },
    { key: 'kitchenRenovation', label: 'Kitchen Renovation?' },
    { key: 'kitchenRenovationDescription', label: 'Kitchen Renovation Description' },
    { key: 'bathroomRenovation', label: 'Bathroom Renovation?' },
    { key: 'bathroomRenovationDescription', label: 'Bathroom Renovation Description' },
    { key: 'flooringType', label: 'Flooring Type' },
    { key: 'specialUpgradesBetterments', label: 'Special Upgrades / Betterments' },
  ])),
  buildSection('Coverage and Endorsements', mapRows(form, [
    { key: 'dwellingCoverageA', label: 'Dwelling Coverage / Walls-In (Coverage A)' },
    { key: 'personalPropertyCoverageC', label: 'Personal Property Coverage (Coverage C)' },
    { key: 'lossOfUseCoverageD', label: 'Loss of Use / ALE (Coverage D)' },
    { key: 'liabilityCoverageE', label: 'Liability Coverage (Coverage E)' },
    { key: 'medicalPaymentsCoverageF', label: 'Medical Payments (Coverage F)' },
    { key: 'deductible', label: 'Deductible' },
    { key: 'lossAssessmentCoverage', label: 'Loss Assessment Coverage' },
    { key: 'waterBackupEndorsement', label: 'Water Backup Endorsement?' },
    { key: 'scheduledPersonalProperty', label: 'Scheduled Personal Property?' },
    { key: 'earthquakeEndorsement', label: 'Earthquake Endorsement?' },
    { key: 'mortgageLenderLienholder', label: 'Mortgage Lender / Lienholder' },
    { key: 'mortgageLenderAddress', label: 'Mortgage Lender / Lienholder Address Details' },
    { key: 'effectiveDate', label: 'Effective Date' },
  ])),
];

const buildCommercialAutoSections = (form = {}) => [
  buildSection('Business Information', mapRows(form, [
    { key: 'legalBusinessName', label: 'Legal Business Name' },
    { key: 'dbaName', label: 'DBA (Doing Business As)' },
    { key: 'businessEntityType', label: 'Business Entity Type' },
    { key: 'federalEin', label: 'Federal EIN (Tax ID)' },
    { key: 'businessStreetAddress', label: 'Business Street Address (Principal Location)' },
    { key: 'businessCity', label: 'Business City' },
    { key: 'businessState', label: 'Business State' },
    { key: 'businessZip', label: 'Business ZIP' },
    { key: 'yearBusinessEstablished', label: 'Year Business Established' },
    { key: 'industryType', label: 'Industry / Type of Business' },
    { key: 'naicsCode', label: 'NAICS Code' },
    { key: 'businessWebsiteUrl', label: 'Business Website URL' },
    { key: 'primaryContactName', label: 'Primary Business Contact Name' },
    { key: 'primaryContactPhone', label: 'Primary Business Contact Phone' },
    { key: 'primaryContactEmail', label: 'Primary Business Contact Email' },
  ])),
  buildSection('Vehicle Information (Vehicle 1)', mapRows(form, [
    { key: 'numberOfVehiclesToInsure', label: 'Number of Vehicles to Insure' },
    { key: 'vehicleYear', label: 'Vehicle 1 - Year' },
    { key: 'vehicleMake', label: 'Vehicle 1 - Make' },
    { key: 'vehicleModel', label: 'Vehicle 1 - Model' },
    { key: 'vehicleVin', label: 'Vehicle 1 - VIN' },
    { key: 'vehicleGvwr', label: 'Vehicle 1 - GVWR' },
    { key: 'vehiclePrimaryUse', label: 'Vehicle 1 - Primary Use' },
    { key: 'vehicleRadiusOfOperation', label: 'Vehicle 1 - Radius of Operation' },
    { key: 'vehicleAnnualMileage', label: 'Vehicle 1 - Annual Mileage' },
    { key: 'vehicleGaragingZip', label: 'Vehicle 1 - Garaging ZIP Code' },
    { key: 'vehicleLienholderLessorName', label: 'Vehicle 1 - Lienholder / Lessor Name' },
    { key: 'vehicleLienholderLessorAddress', label: 'Vehicle 1 - Lienholder / Lessor Address' },
    { key: 'vehicleCurrentMarketValue', label: 'Vehicle 1 - Current Market Value / Cost New' },
    { key: 'dotNumber', label: 'DOT Number (If Applicable)' },
    { key: 'mcNumber', label: 'MC Number (Motor Carrier)' },
  ])),
  buildSection('Driver Information (Driver 1)', [
    ...mapRows(form, [
      { key: 'driverFullLegalName', label: 'Driver 1 - Full Legal Name' },
      { key: 'driverDateOfBirth', label: 'Driver 1 - Date of Birth' },
      { key: 'driverLicenseNumber', label: 'Driver 1 - Driver License Number' },
      { key: 'driverLicenseState', label: 'Driver 1 - License State' },
      { key: 'driverYearsLicensedUs', label: 'Driver 1 - Years Licensed in US' },
      { key: 'driverCdlHolder', label: 'Driver 1 - CDL Holder?' },
      { key: 'driverSr22Required', label: 'Driver 1 - SR-22 Required?' },
    ]),
    ...formatCollectionRows(form.accidents, 'Accident', [
      { key: 'date', label: 'Date' },
      { key: 'atFault', label: 'At-Fault' },
      { key: 'description', label: 'Description' },
    ]),
    ...formatCollectionRows(form.violations, 'Violation', [
      { key: 'date', label: 'Date' },
      {
        key: 'type',
        label: 'Type',
        valueMap: {
          speeding: 'Speeding',
          dui: 'DUI',
          'reckless-driving': 'Reckless Driving',
          'cell-phone': 'Cell Phone / Distracted Driving',
          other: 'Other',
        },
      },
      { key: 'description', label: 'Description' },
    ]),
  ]),
  buildSection('Coverage Selection', mapRows(form, [
    { key: 'bodilyInjuryLiabilityLimits', label: 'Bodily Injury Liability Limits' },
    { key: 'propertyDamageLiability', label: 'Property Damage Liability' },
    { key: 'uninsuredUnderinsuredMotorist', label: 'Uninsured / Underinsured Motorist' },
    { key: 'medicalPaymentsPip', label: 'Medical Payments / PIP' },
    { key: 'comprehensiveCoverage', label: 'Comprehensive Coverage (Per Vehicle)?' },
    { key: 'comprehensiveDeductible', label: 'Comprehensive Deductible' },
    { key: 'collisionCoverage', label: 'Collision Coverage (Per Vehicle)?' },
    { key: 'collisionDeductible', label: 'Collision Deductible' },
    { key: 'rentalReimbursement', label: 'Rental Reimbursement?' },
    { key: 'rentalReimbursementDailyLimit', label: 'Rental Reimbursement Daily Limit' },
    { key: 'towingRoadsideAssistance', label: 'Towing and Roadside Assistance?' },
    { key: 'hiredNonOwnedAutoCoverage', label: 'Hired and Non-Owned Auto Coverage?' },
    { key: 'mcs90EndorsementRequired', label: 'MCS-90 Endorsement Required?' },
    { key: 'effectiveDate', label: 'Effective Date' },
  ])),
];

const buildGeneralLiabilitySections = (form = {}) => [
  buildSection('Business and Operations Profile', [
    ...mapRows(form, [
      { key: 'legalBusinessName', label: 'Legal Business Name' },
      { key: 'dbaName', label: 'DBA (Doing Business As)' },
      { key: 'businessEntityType', label: 'Business Entity Type' },
      { key: 'federalEin', label: 'Federal EIN' },
      { key: 'primaryBusinessStreetAddress', label: 'Primary Business Street Address' },
      { key: 'primaryBusinessUnitNumber', label: 'Primary Business Unit Number' },
      { key: 'primaryBusinessCity', label: 'Primary Business City' },
      { key: 'primaryBusinessState', label: 'Primary Business State' },
      { key: 'primaryBusinessZip', label: 'Primary Business ZIP' },
      { key: 'yearBusinessEstablished', label: 'Year Business Established' },
      { key: 'industryTypeOfBusiness', label: 'Industry / Type of Business' },
      { key: 'naicsCsicCode', label: 'NAICS / CSIC Code' },
      { key: 'detailedDescriptionOfOperations', label: 'Detailed Description of Operations' },
      { key: 'productsManufacturedOrDistributed', label: 'Products Manufactured or Distributed?' },
      { key: 'descriptionOfProducts', label: 'Description of Products' },
      { key: 'estimatedAnnualRevenueGrossSales', label: 'Estimated Annual Revenue / Gross Sales' },
      { key: 'estimatedAnnualPayroll', label: 'Estimated Annual Payroll (If Applicable)' },
      { key: 'numberOfEmployeesFullTime', label: 'Number of Employees (Full-Time)' },
      { key: 'numberOfEmployeesPartTimeSeasonal', label: 'Number of Employees (Part-Time / Seasonal)' },
      { key: 'numberOfSubcontractorsUsedAnnually', label: 'Number of Subcontractors Used Annually' },
      { key: 'subcontractorsCarryOwnInsurance', label: 'Do Subcontractors Carry Their Own Insurance?' },
      { key: 'subcontractorAnnualCost', label: 'Subcontractor Annual Cost' },
      { key: 'workPerformedOnResidentialProperties', label: 'Work Performed on Residential Properties?' },
      { key: 'workPerformedOnCommercialProperties', label: 'Work Performed on Commercial Properties?' },
      { key: 'businessInvolvesLiquorSalesOrService', label: 'Does Business Involve Liquor Sales or Service?' },
      { key: 'businessInvolvesFirearms', label: 'Does Business Involve Firearms?' },
      { key: 'businessInvolvesMedicalServices', label: 'Does Business Involve Medical Services?' },
    ]),
    ...formatCollectionRows(form.additionalLocations, 'Additional Location', [
      { key: 'streetAddress', label: 'Street Address' },
      { key: 'unitNumber', label: 'Unit Number' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'zip', label: 'ZIP' },
    ]),
    ...formatCollectionRows(form.priorClaims, 'Claim', [
      { key: 'date', label: 'Date' },
      { key: 'description', label: 'Description' },
      { key: 'paidAmount', label: 'Paid Amount' },
      { key: 'status', label: 'Status' },
    ]),
  ]),
  buildSection('Coverage Limits and Endorsements', mapRows(form, [
    { key: 'eachOccurrenceLimit', label: 'Each Occurrence Limit' },
    { key: 'generalAggregateLimit', label: 'General Aggregate Limit' },
    { key: 'productsCompletedOperationsAggregate', label: 'Products and Completed Operations Aggregate' },
    { key: 'personalAdvertisingInjuryLimit', label: 'Personal and Advertising Injury Limit' },
    { key: 'damageToRentedPremisesLimit', label: 'Damage to Rented Premises (Fire Legal Liability)' },
    { key: 'medicalExpenseLimit', label: 'Medical Expense Limit' },
    { key: 'hiredNonOwnedAutoLiability', label: 'Hired and Non-Owned Auto Liability?' },
    { key: 'employeeBenefitsLiability', label: 'Employee Benefits Liability?' },
    { key: 'liquorLiabilityEndorsement', label: 'Liquor Liability Endorsement?' },
    { key: 'professionalLiabilityEo', label: 'Professional Liability / E&O?' },
    { key: 'additionalInsuredRequirements', label: 'Additional Insured Requirements' },
    { key: 'waiverOfSubrogationRequired', label: 'Waiver of Subrogation Required?' },
    { key: 'waiverOfSubrogationEntityName', label: 'Waiver Entity Name' },
    { key: 'primaryAndNonContributoryRequired', label: 'Primary and Non-Contributory Required?' },
    { key: 'effectiveDate', label: 'Effective Date' },
    { key: 'policyTerm', label: 'Policy Term' },
  ])),
];

const buildUmbrellaSections = (form = {}) => [
  buildSection('Applicant and Policy Type', mapRows(form, [
    { key: 'fullNameOrBusinessName', label: 'Full Name (Personal) or Business Name (Commercial)' },
    { key: 'dateOfBirthOrEin', label: 'Date of Birth (Personal) or EIN (Commercial)' },
    { key: 'addressStreet', label: 'Address - Street' },
    { key: 'addressUnit', label: 'Address - Unit Number' },
    { key: 'addressCity', label: 'Address - City' },
    { key: 'addressState', label: 'Address - State' },
    { key: 'addressZip', label: 'Address - ZIP' },
    { key: 'umbrellaPolicyType', label: 'Type of Umbrella Policy' },
  ])),
  buildSection('Underlying Policy Information (Optional)', mapRows(form, [
    { key: 'underlyingHomeownersPolicyCarrier', label: 'Underlying Homeowners Policy Carrier' },
    { key: 'underlyingHomeownersPolicyNumber', label: 'Underlying Homeowners Policy Number' },
    { key: 'underlyingHomeownersLiabilityLimit', label: 'Underlying Homeowners Liability Limit' },
    { key: 'underlyingAutoPolicyCarrier', label: 'Underlying Auto Policy Carrier' },
    { key: 'underlyingAutoPolicyNumber', label: 'Underlying Auto Policy Number' },
    { key: 'underlyingAutoBiPdLimits', label: 'Underlying Auto BI/PD Limits' },
    { key: 'underlyingGlPolicyCarrier', label: 'Underlying GL Policy Carrier' },
    { key: 'underlyingGlLimits', label: 'Underlying GL Limits' },
    { key: 'underlyingCommercialAutoPolicy', label: 'Underlying Commercial Auto Policy (if applicable)' },
    { key: 'underlyingWcPolicy', label: 'Underlying WC Policy (if applicable)' },
  ])),
  buildSection('Exposure and Risk Triggers', [
    ...mapRows(form, [
      { key: 'watercraftOwned', label: 'Watercraft Owned?' },
      { key: 'watercraftDetails', label: 'Watercraft Details' },
      { key: 'recreationalVehiclesAtvs', label: 'Recreational Vehicles / ATVs?' },
      { key: 'recreationalVehiclesAtvsDetails', label: 'Recreational Vehicle / ATV Details' },
      { key: 'rentalPropertiesOwned', label: 'Rental Properties Owned?' },
      { key: 'rentalPropertiesCount', label: 'Number of Rental Units' },
      { key: 'numberOfDriversInHousehold', label: 'Number of Drivers in Household (Personal)' },
      { key: 'youngDriversUnder25', label: 'Young Drivers (under 25) in Household?' },
      { key: 'duiOrSeriousViolationsAnyDriver', label: 'DUI or Serious Violations - Any Driver?' },
      { key: 'priorUmbrellaClaimsPast5Years', label: 'Prior Umbrella Claims (past 5 years)?' },
      { key: 'swimmingPool', label: 'Swimming Pool?' },
      { key: 'trampoline', label: 'Trampoline?' },
      { key: 'dogsBreedAndCount', label: 'Dogs (breed and count)?' },
      { key: 'boardMemberships', label: 'Board Memberships?' },
      { key: 'boardMembershipsDetails', label: 'Board Membership Details' },
      { key: 'homeBasedBusiness', label: 'Home-Based Business?' },
      { key: 'homeBasedBusinessDetails', label: 'Home-Based Business Details' },
    ]),
    ...formatCollectionRows(form.priorClaims, 'Claim', [
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Amount' },
      { key: 'description', label: 'Description' },
    ]),
  ]),
  buildSection('Limit and Effective Date', mapRows(form, [
    { key: 'umbrellaLimit', label: 'Umbrella Limit' },
    { key: 'effectiveDate', label: 'Effective Date' },
    { key: 'selfInsuredRetentionSir', label: 'Self-Insured Retention (SIR)' },
  ])),
];

const buildFloodSections = (form = {}) => [
  buildSection('Flood Insurance Intake', [
    ...mapRows(form, [
      { key: 'propertyStreetAddress', label: 'Property Address - Street' },
      { key: 'propertyUnitNumber', label: 'Property Address - Unit Number' },
      { key: 'propertyCity', label: 'Property Address - City' },
      { key: 'propertyState', label: 'Property Address - State' },
      { key: 'propertyZip', label: 'Property Address - ZIP' },
      { key: 'femaFloodZone', label: 'FEMA Flood Zone' },
      { key: 'baseFloodElevation', label: 'Base Flood Elevation (BFE)' },
      { key: 'elevationCertificateAvailable', label: 'Elevation Certificate Available' },
      { key: 'firstFloorElevationAboveBFE', label: 'First Floor Elevation Above BFE' },
      { key: 'communityNfipParticipationStatus', label: 'Community NFIP Participation Status' },
      { key: 'propertyType', label: 'Property Type' },
      { key: 'yearBuilt', label: 'Year Built' },
      { key: 'numberOfFloors', label: 'Number of Floors' },
      { key: 'basement', label: 'Basement' },
      { key: 'basementType', label: 'Basement Type' },
      { key: 'enclosureBelowElevatedBuilding', label: 'Enclosure Below Elevated Building' },
      { key: 'buildingCoverage', label: 'Building Coverage' },
      { key: 'contentsCoverage', label: 'Contents Coverage' },
      { key: 'deductibleBuilding', label: 'Deductible Building' },
      { key: 'deductibleContents', label: 'Deductible Contents' },
      { key: 'nfipOrPrivateFlood', label: 'Nfip Or Private Flood' },
      { key: 'preferredRiskEligibility', label: 'Preferred Risk Eligibility' },
      { key: 'priorFloodClaims', label: 'Prior Flood Claims' },
      { key: 'effectiveDate', label: 'Effective Date' },
    ]),
    ...formatCollectionRows(form.priorClaims, 'Claim', [
      { key: 'date', label: 'Date' },
      { key: 'amountPaid', label: 'Amount Paid' },
    ]),
  ]),
];

const EMPLOYERS_LIABILITY_LABELS = {
  '100k-100k-100k': '$100K / $100K / $100K',
  '500k-500k-500k': '$500K / $500K / $500K',
  '1m-1m-1m': '$1M / $1M / $1M',
};

const buildWorkersCompSections = (form = {}) => [
  buildSection('Business and Payroll Details', (() => {
    const baseRows = mapRows(form, [
      { key: 'legalBusinessName', label: 'Legal Business Name (as registered with state)' },
      { key: 'fein', label: 'FEIN (Federal Employer Identification Number)' },
      { key: 'stateOfPrimaryOperations', label: 'State of Primary Operations' },
      { key: 'additionalStatesOfOperation', label: 'Additional States of Operation' },
      { key: 'businessAddress', label: 'Business Address' },
      { key: 'yearsInBusiness', label: 'Years in Business' },
      { key: 'typeOfLegalEntity', label: 'Type of Legal Entity' },
      { key: 'officerOwnerExclusionRequest', label: 'Officer/Owner Exclusion Request?' },
      { key: 'excludedOfficersNames', label: 'Names of Excluded Officers' },
      { key: 'numberOfEmployeesFullTime', label: 'Number of Employees - Full Time' },
      { key: 'numberOfEmployeesPartTime', label: 'Number of Employees - Part Time' },
      { key: 'totalEstimatedAnnualPayroll', label: 'Total Estimated Annual Payroll' },
      { key: 'primaryBusinessActivityOperations', label: 'Primary Business Activity / Operations' },
    ]);

    const classificationRows = (Array.isArray(form.classifications) ? form.classifications : [])
      .flatMap((entry, index) => [
        { label: `Classification ${index + 1} - NCCI Class Code (if known)`, value: valueLabel(entry?.ncciClassCode) },
        { label: `Classification ${index + 1} - Job Title / Duty Description`, value: valueLabel(entry?.jobTitleDutyDescription) },
        { label: `Classification ${index + 1} - Number of Employees in this Role`, value: valueLabel(entry?.numberOfEmployees) },
        { label: `Classification ${index + 1} - Estimated Annual Payroll`, value: valueLabel(entry?.estimatedAnnualPayroll) },
      ]);

    return [...baseRows, ...classificationRows];
  })()),
  buildSection('Risk, Exposure, and Claims History', (() => {
    const baseRows = mapRows(form, [
      { key: 'workPerformedAtHeights', label: 'Work Performed at Heights? (over 15 ft)' },
      { key: 'workPerformedInTrenches', label: 'Work Performed in Trenches or Excavations?' },
      { key: 'roofingWorkPerformed', label: 'Roofing Work Performed?' },
      { key: 'workPerformedOnLadders', label: 'Work Performed on Ladders?' },
      { key: 'ladderMaxHeight', label: 'Max Ladder Height' },
      { key: 'workWithExplosivesHazardousMaterials', label: 'Work with Explosives or Hazardous Materials?' },
      { key: 'hazardousMaterialsDescription', label: 'Hazardous Materials Description' },
      { key: 'workPerformedOutsideCalifornia', label: 'Work Performed Outside California?' },
      { key: 'outsideCaliforniaStates', label: 'States of Operation (Outside CA)' },
      { key: 'seasonalFluctuationsInEmployment', label: 'Seasonal Fluctuations in Employment?' },
      { key: 'seasonalPayrollEstimate', label: 'Seasonal Payroll Estimate' },
      { key: 'useOfSubcontractors', label: 'Use of Subcontractors?' },
      { key: 'subcontractorAnnualPayrollCost', label: 'Subcontractor Annual Payroll / Cost' },
      { key: 'experienceModificationRate', label: 'Experience Modification Rate (EMR / X-Mod)' },
      { key: 'priorWcCarrier', label: 'Prior WC Carrier (most recent)' },
      { key: 'priorWcPolicyExpirationDate', label: 'Prior WC Policy Expiration Date' },
      { key: 'anyOpenOngoingClaims', label: 'Any Open/Ongoing Claims?' },
      { key: 'openOngoingClaimsDescription', label: 'Open/Ongoing Claims Description' },
      { key: 'priorDeclinationsOrNonRenewalsForWc', label: 'Prior Declinations or Non-Renewals for WC?' },
      { key: 'priorDeclinationsReason', label: 'Declinations / Non-Renewals Reason' },
    ]);

    const claimsRows = (Array.isArray(form.wcClaims) ? form.wcClaims : [])
      .flatMap((entry, index) => [
        { label: `WC Claim ${index + 1} - Year`, value: valueLabel(entry?.year) },
        { label: `WC Claim ${index + 1} - Number of Claims`, value: valueLabel(entry?.numberOfClaims) },
        { label: `WC Claim ${index + 1} - Total Incurred`, value: valueLabel(entry?.totalIncurred) },
        { label: `WC Claim ${index + 1} - Status`, value: valueLabel(entry?.openClosed) },
      ]);

    return [...baseRows, ...claimsRows];
  })()),
  buildSection('Coverage Selection', mapRows(form, [
    { key: 'workersCompensationStatutory', label: 'Part 1 - Workers Compensation (Statutory)?' },
    { key: 'employersLiabilityLimit', label: 'Part 2 - Employers Liability Limit', valueMap: EMPLOYERS_LIABILITY_LABELS },
    { key: 'effectiveDate', label: 'Effective Date' },
    { key: 'stateFundReferral', label: 'State Fund Referral?' },
  ])),
];

const SPECIALTY_TYPE_LABELS = {
  cyber: 'Cyber Liability',
  eo: 'Professional Liability (E&O)',
  'inland-marine': 'Inland Marine',
  'surety-bond': 'Surety Bond',
  pet: 'Pet Insurance',
};

const buildSpecialtySections = (form = {}) => {
  const specialtyType = String(form.specialtyType || '').trim();
  const specialtyTypeLabel = SPECIALTY_TYPE_LABELS[specialtyType] || valueLabel(specialtyType);

  const sections = [
    buildSection('Specialty Product Selection', [
      { label: 'Specialty Type', value: specialtyTypeLabel },
    ]),
  ];

  if (specialtyType === 'cyber') {
    sections.push(
      buildSection('Cyber Liability Intake', [
        ...mapRows(form, [
          { key: 'legalBusinessName', label: 'Legal Business Name' },
          { key: 'industryBusinessType', label: 'Industry Business Type' },
          { key: 'industryBusinessTypeOther', label: 'Industry Business Type (Other)' },
          { key: 'annualRevenue', label: 'Annual Revenue' },
          { key: 'recordsContainingPii', label: 'Records Containing PII' },
          { key: 'typesOfDataStored', label: 'Types of Data Stored' },
          { key: 'annualItSecurityBudget', label: 'Annual IT Security Budget' },
          { key: 'mfaImplemented', label: 'MFA Implemented' },
          { key: 'edrSoftware', label: 'EDR Software' },
          { key: 'dataBackupProcedures', label: 'Data Backup Procedures' },
          { key: 'encryptionSensitiveData', label: 'Encryption of Sensitive Data' },
          { key: 'priorCyberIncidentsClaims', label: 'Prior Cyber Incidents / Claims' },
          { key: 'annualRansomwareDemandLimit', label: 'Annual Ransomware Demand Limit' },
        ]),
        ...formatCollectionRows(form.cyberIncidents, 'Incident', [
          { key: 'date', label: 'Date' },
          { key: 'description', label: 'Description' },
          { key: 'costs', label: 'Costs' },
          { key: 'resolution', label: 'Resolution' },
        ]),
      ])
    );
  } else if (specialtyType === 'eo') {
    sections.push(
      buildSection('Professional Liability (E&O) Intake', [
        ...mapRows(form, [
          { key: 'businessName', label: 'Business Name' },
          { key: 'professionServiceType', label: 'Profession / Service Type' },
          { key: 'professionServiceTypeOther', label: 'Profession / Service Type (Other)' },
          { key: 'yearsInPractice', label: 'Years in Practice' },
          { key: 'numberLicensedProfessionals', label: 'Number of Licensed Professionals' },
          { key: 'annualRevenueProfessionalServices', label: 'Annual Revenue (Professional Services)' },
          { key: 'priorEoClaims', label: 'Prior E&O Claims' },
          { key: 'servicesProvidedOutsideUs', label: 'Services Provided Outside US' },
          { key: 'servicesProvidedOutsideUsCountries', label: 'Countries Outside US' },
          { key: 'retroactiveDateRequested', label: 'Retroactive Date Requested' },
        ]),
        ...formatCollectionRows(form.eoClaims, 'Claim', [
          { key: 'date', label: 'Date' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' },
        ]),
      ])
    );
  } else if (specialtyType === 'inland-marine') {
    sections.push(
      buildSection('Inland Marine Intake', [
        ...mapRows(form, [
          { key: 'equipmentPropertyType', label: 'Equipment / Property Type' },
          { key: 'equipmentPropertyTypeOther', label: 'Equipment / Property Type (Other)' },
          { key: 'totalInsuredValue', label: 'Total Insured Value' },
          { key: 'storageStreetAddress', label: 'Storage Street Address' },
          { key: 'storageUnitNumber', label: 'Storage Unit Number' },
          { key: 'storageCity', label: 'Storage City' },
          { key: 'storageState', label: 'Storage State' },
          { key: 'storageZip', label: 'Storage ZIP' },
          { key: 'storageLocations', label: 'Storage Locations' },
          { key: 'inTransitOrStored', label: 'In Transit or Stored' },
          { key: 'priorInlandMarineClaims', label: 'Prior Inland Marine Claims' },
        ]),
        ...formatCollectionRows(form.inlandMarineItems, 'Item', [
          { key: 'itemDescription', label: 'Description' },
          { key: 'year', label: 'Year' },
          { key: 'makeModel', label: 'Make / Model' },
          { key: 'serialNumber', label: 'Serial Number' },
          { key: 'value', label: 'Value' },
        ]),
        ...formatCollectionRows(form.inlandMarineClaims, 'Claim', [
          { key: 'date', label: 'Date' },
          { key: 'amount', label: 'Amount' },
          { key: 'description', label: 'Description' },
        ]),
      ])
    );
  } else if (specialtyType === 'surety-bond') {
    sections.push(
      buildSection('Surety Bond Intake', [
        ...mapRows(form, [
          { key: 'bondTypeRequested', label: 'Bond Type Requested' },
          { key: 'obligeeName', label: 'Obligee Name' },
          { key: 'bondAmountPenalSum', label: 'Bond Amount / Penal Sum' },
          { key: 'purposeOfBond', label: 'Purpose of Bond' },
          { key: 'bondTermDuration', label: 'Bond Term Duration' },
          { key: 'principalPersonalCreditScore', label: 'Principal Personal Credit Score' },
          { key: 'businessFinancialStatements', label: 'Business Financial Statements' },
          { key: 'priorBondClaimsDefault', label: 'Prior Bond Claims / Default' },
        ]),
      ])
    );
  } else if (specialtyType === 'pet') {
    sections.push(
      buildSection('Pet Insurance Intake', [
        ...mapRows(form, [
          { key: 'petName', label: 'Pet Name' },
          { key: 'petSpecies', label: 'Pet Species' },
          { key: 'petBreed', label: 'Pet Breed' },
          { key: 'petAgeYears', label: 'Pet Age (Years)' },
          { key: 'petAgeMonths', label: 'Pet Age (Months)' },
          { key: 'petAge', label: 'Pet Age' },
          { key: 'petGender', label: 'Pet Gender' },
          { key: 'petWeight', label: 'Pet Weight' },
          { key: 'petColorMarkings', label: 'Pet Color Markings' },
          { key: 'microchipped', label: 'Microchipped' },
          { key: 'priorVeterinaryConditions', label: 'Prior Veterinary Conditions' },
          { key: 'coverageType', label: 'Coverage Type' },
          { key: 'annualDeductible', label: 'Annual Deductible' },
          { key: 'reimbursementPercentage', label: 'Reimbursement Percentage' },
          { key: 'annualBenefitLimit', label: 'Annual Benefit Limit' },
          { key: 'veterinarianClinic', label: 'Veterinarian Clinic' },
        ]),
        ...formatCollectionRows(form.petVeterinaryConditions, 'Condition', [
          { key: 'condition', label: 'Condition' },
          { key: 'diagnosisDate', label: 'Diagnosis Date' },
          { key: 'treatmentCost', label: 'Treatment Cost' },
        ]),
      ])
    );
  }

  return sections;
};

export const buildHomeownersQuotationSections = (selectedProduct, form = {}) => {
  if (selectedProduct === 'ho3') {
    return buildHo3Sections(form);
  }
  if (selectedProduct === 'ho4') {
    return buildHo4Sections(form);
  }
  if (selectedProduct === 'ho6') {
    return buildHo6Sections(form);
  }
  return [];
};

export const buildQuotationSections = (selectedProduct, form = {}) => {
  if (selectedProduct === 'specialty') {
    return buildSpecialtySections(form);
  }

  if (selectedProduct === 'commercialAuto') {
    return buildCommercialAutoSections(form);
  }

  if (selectedProduct === 'generalLiability') {
    return buildGeneralLiabilitySections(form);
  }

  if (selectedProduct === 'umbrella') {
    return buildUmbrellaSections(form);
  }

  if (selectedProduct === 'flood') {
    return buildFloodSections(form);
  }

  if (selectedProduct === 'workersComp') {
    return buildWorkersCompSections(form);
  }

  const homeownersSections = buildHomeownersQuotationSections(selectedProduct, form);
  if (homeownersSections.length > 0) {
    return homeownersSections;
  }

  const genericRows = Object.entries(form)
    .map(([key, value]) => ({
      label: toTitleCase(key),
      value: valueToDisplay(value),
    }));

  return genericRows.length > 0
    ? [buildSection('Quotation Details', genericRows)]
    : [];
};
