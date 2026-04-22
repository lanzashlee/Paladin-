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

  if (value === value.toLowerCase() && /^[a-z]+$/.test(value)) {
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
    value: valueLabel(form[definition.key], definition.valueMap),
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
          { key: 'priorCyberIncidentsDetails', label: 'Prior Cyber Incidents Details' },
          { key: 'annualRansomwareDemandLimit', label: 'Annual Ransomware Demand Limit' },
        ]),
        {
          label: 'Cyber Incidents',
          value: formatCollection(form.cyberIncidents, [
            { key: 'date', label: 'Date' },
            { key: 'description', label: 'Description' },
            { key: 'costs', label: 'Costs' },
            { key: 'resolution', label: 'Resolution' },
          ]),
        },
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
          { key: 'priorEoClaimsDetails', label: 'Prior E&O Claims Details' },
          { key: 'servicesProvidedOutsideUs', label: 'Services Provided Outside US' },
          { key: 'servicesProvidedOutsideUsCountries', label: 'Countries Outside US' },
          { key: 'retroactiveDateRequested', label: 'Retroactive Date Requested' },
        ]),
        {
          label: 'E&O Claims',
          value: formatCollection(form.eoClaims, [
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
          ]),
        },
      ])
    );
  } else if (specialtyType === 'inland-marine') {
    sections.push(
      buildSection('Inland Marine Intake', [
        ...mapRows(form, [
          { key: 'equipmentPropertyType', label: 'Equipment / Property Type' },
          { key: 'equipmentPropertyTypeOther', label: 'Equipment / Property Type (Other)' },
          { key: 'scheduleOfItems', label: 'Schedule of Items' },
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
        {
          label: 'Inland Marine Items',
          value: formatCollection(form.inlandMarineItems, [
            { key: 'itemDescription', label: 'Item Description' },
            { key: 'year', label: 'Year' },
            { key: 'makeModel', label: 'Make / Model' },
            { key: 'serialNumber', label: 'Serial Number' },
            { key: 'value', label: 'Value' },
          ]),
        },
        {
          label: 'Inland Marine Claims',
          value: formatCollection(form.inlandMarineClaims, [
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'description', label: 'Description' },
          ]),
        },
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
          { key: 'priorVeterinaryConditionsDetails', label: 'Prior Veterinary Conditions Details' },
          { key: 'coverageType', label: 'Coverage Type' },
          { key: 'annualDeductible', label: 'Annual Deductible' },
          { key: 'reimbursementPercentage', label: 'Reimbursement Percentage' },
          { key: 'annualBenefitLimit', label: 'Annual Benefit Limit' },
          { key: 'veterinarianClinic', label: 'Veterinarian Clinic' },
        ]),
        {
          label: 'Pet Veterinary Conditions',
          value: formatCollection(form.petVeterinaryConditions, [
            { key: 'condition', label: 'Condition' },
            { key: 'diagnosisDate', label: 'Diagnosis Date' },
            { key: 'treatmentCost', label: 'Treatment Cost' },
          ]),
        },
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
