import React, { useRef, useState } from 'react';

const CLAIM_TEMPLATE = { date: '', type: '', paidAmount: '' };
const REQUIRED_MESSAGE = 'This field is required.';
const INVALID_PHONE_MESSAGE = 'Phone must be in the format (XXX) XXX XXXX.';
const INVALID_EMAIL_MESSAGE = 'Enter a valid email address.';
const INVALID_ZIP_MESSAGE = 'ZIP must be 5 digits or ZIP+4 format (12345 or 12345-6789).';
const INVALID_SSN_LAST4_MESSAGE = 'SSN (Last 4) must contain exactly 4 digits.';
const INVALID_FULL_SSN_MESSAGE = 'Full SSN must contain exactly 9 digits.';

const VALID_REFERRAL_CODES = new Set([
  'njackson609',
  'randrade189',
  'mgalvez632',
  'mrooke108',
  'spopal544',
  'dyi703',
  'acolumbo-yunker166',
  'nsalceda647',
  'kmendez673',
  'mventura193',
  'rwagner123',
  'ckeenan456',
  'jtsai946',
  'igarcia634',
  'smasche227',
  'wli325',
  'kquach347',
  'wcogan327',
  'mli398',
  'lsunzeri589',
  'msumara826',
  'wchou486',
  'rpalustre357',
  'tmorales810',
  'fmogilevskaya136',
  'rbehl122',
  'egonzalez206',
  'amorgese174',
  'kshih949',
  'ashih991',
  'cautar110',
  'kcody621',
  'srodriguez185',
  'dburow004',
  'twredberg845',
  'jsaid756',
  'msauer801',
  'tfuqua516',
  'voshea iii698',
  'mfernandez267',
  'jmcmahon554',
  'mbarbosa704',
  'jabele335',
  'mabad529',
  'sgiffin231',
  'cdorfman923',
  'pkaur355',
  'fmontenegro870',
  'blutz372',
  'pdelilli235',
  'sguetzoian936',
  'lzamora705',
  'sshen709',
  'mtavakoli408',
  'vakopian913',
  'rmeriales272',
  'lruiz021',
  'cmcdannell577',
  'dmayo758',
  'zliang916',
  'gxiao014',
  'gfabregas114',
  'mrivezzo906',
  'dalmaguer-olivar696',
  'icook333',
  'tle789',
  'pcaccamise466',
  'rmele919',
  'wcheng534',
  'agallardo852',
  'jmarx-ruiz413',
  'astone763',
  'jsorrentino823',
  'tgolden050',
  'chuang863',
  'cphan364',
  'jma715',
  'dtep958',
  'elaiw822',
  'sstack176',
  'galves461',
  'jelliott184',
  'kle338',
  'mkeene385',
  'lchavira440',
  'rsharma880',
  'khull442',
  'cnguyen606',
  'ghill592',
  'rsimmons943',
  'rbutler053',
  'rko993',
  'cyang880',
  'jaragi935',
  'jchen739',
  'tpirhofer990',
  'jjimenez892',
  'ynhan039',
  'tcheng189',
  'smcmahon834',
  'dschmidt542',
  'pdo567',
  'agarza038',
  'jhaggerty788',
  'cjow708',
  'jyu359',
  'bjuri552',
  'aauduon153',
  'mburruel125',
  'gkhoury272',
  'djones369',
  'cvalencia802',
  'knixon903',
  'rjones659',
  'dtai203',
  'fvelasco901',
  'svon thaden369',
  'ctorres-kubiak665',
  'kle514',
  'lserrano367',
  'ade ponce995',
  'vukap805',
  'jbui368',
  'jmcintosh350',
  'gdominguez382',
  'fbernal479',
  'jsherman020',
  'rvollmer370',
  'chomsi914',
  'gherrera345',
  'mmarquez788',
  'jwiggins940',
  'blucas902',
  'hhenderson049',
  'cponco701',
  'cfahey924',
  'qnguyen523',
  'jzhang197',
  'nenferadi409',
  'cshelton114',
  'cmatsukuma038',
  'mlu066',
  'rgarcia774',
  'sdemirjian865',
  'mserkova438',
  'gsalazar535',
  'cmaronto667',
  'plin832',
  'bstreet858',
  'ialcantara735',
  'cdaniels044',
  'lsun479',
  'mluning816',
  'mxu657',
  'mmarc s.427',
  'rshafiee296',
  'swang822',
  'karias984',
  'jma919',
  'rnavarro798',
  'abogardus191',
]);

const isBlank = (value) => String(value ?? '').trim() === '';
const PHONE_FORMAT_REGEX = /^\(\d{3}\)\s\d{3}\s\d{4}$/;
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_FORMAT_REGEX = /^\d{5}(-\d{4})?$/;
const SSN_LAST4_REGEX = /^\d{4}$/;
const FULL_SSN_REGEX = /^\d{9}$/;

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

const formatPhoneNumber = (rawValue) => {
  const digits = String(rawValue ?? '').replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

const formatZipCode = (rawValue) => {
  const digits = digitsOnly(rawValue).slice(0, 9);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

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

const parseLegacyFullName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return {
      firstName: parts[0] || '',
      middleName: '',
      lastName: '',
    };
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      middleName: '',
      lastName: parts[1],
    };
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, parts.length - 1).join(' '),
    lastName: parts[parts.length - 1],
  };
};

function UniversalApplicantForm({ form, onNext }) {
  const formRef = useRef(null);

  const legacyName = parseLegacyFullName(form.fullLegalName || form.name || '');

  const [localForm, setLocalForm] = useState({
    firstName: form.firstName ?? legacyName.firstName,
    middleName: form.middleName ?? legacyName.middleName,
    lastName: form.lastName ?? legacyName.lastName,
    dateOfBirth: form.dateOfBirth ?? '',
    contactPhone: form.contactPhone ?? form.phone ?? '',
    emailAddress: form.emailAddress ?? form.email ?? '',
    mailingStreet: form.mailingStreet ?? '',
    mailingCity: form.mailingCity ?? '',
    mailingState: form.mailingState ?? '',
    mailingZip: form.mailingZip ?? '',
    ssnLast4: form.ssnLast4 ?? '',
    fullSsn: form.fullSsn ?? '',
    maritalStatus: form.maritalStatus ?? '',
    gender: form.gender ?? '',
    preferredLanguage: form.preferredLanguage ?? '',
    preferredLanguageOther: form.preferredLanguageOther ?? '',
    priorInsuranceCarrier: form.priorInsuranceCarrier ?? '',
    priorPolicyDate: form.priorPolicyDate ?? '',
    priorPolicyReason: form.priorPolicyReason ?? '',
    priorPolicyReasonDetails: form.priorPolicyReasonDetails ?? '',
    claimsHistory: Array.isArray(form.claimsHistory) && form.claimsHistory.length > 0
      ? form.claimsHistory
      : [{ ...CLAIM_TEMPLATE }],
    consentSoftCredit: Boolean(form.consentSoftCredit),
    consentElectronicDelivery: Boolean(form.consentElectronicDelivery),
    electronicSignature: form.electronicSignature ?? '',
    referralCode: form.referralCode ?? '',
    applicantNotes: form.applicantNotes ?? '',
  });

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [claimsError, setClaimsError] = useState('');
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(false);

  const findFirstIncompleteAdditionalClaimIndex = (claimsHistory = []) => {
    for (let index = 1; index < claimsHistory.length; index += 1) {
      const claim = claimsHistory[index];
      const hasAnyValue = Boolean(claim.date || claim.type || claim.paidAmount);
      const isComplete = Boolean(claim.date && claim.type && claim.paidAmount);

      if (hasAnyValue && !isComplete) {
        return index;
      }
    }

    return -1;
  };

  const focusFieldBySelector = (selector) => {
    const field = formRef.current?.querySelector(selector);
    if (!field) {
      return;
    }

    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.focus({ preventScroll: true });
  };

  const focusFirstErrorField = (formErrors) => {
    const errorOrder = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'contactPhone',
      'emailAddress',
      'mailingStreet',
      'mailingCity',
      'mailingState',
      'mailingZip',
      'ssnLast4',
      'fullSsn',
      'preferredLanguageOther',
      'priorPolicyReasonDetails',
      'claimDate0',
      'claimType0',
      'claimPaidAmount0',
      'consentSoftCredit',
      'consentElectronicDelivery',
      'electronicSignature',
    ];

    const selectorByErrorKey = {
      firstName: '[name="firstName"]',
      lastName: '[name="lastName"]',
      dateOfBirth: '[name="dateOfBirth"]',
      contactPhone: '[name="contactPhone"]',
      emailAddress: '[name="emailAddress"]',
      mailingStreet: '[name="mailingStreet"]',
      mailingCity: '[name="mailingCity"]',
      mailingState: '[name="mailingState"]',
      mailingZip: '[name="mailingZip"]',
      ssnLast4: '[name="ssnLast4"]',
      fullSsn: '[name="fullSsn"]',
      preferredLanguageOther: '[name="preferredLanguageOther"]',
      priorPolicyReasonDetails: '[name="priorPolicyReasonDetails"]',
      claimDate0: '[name="claimDate0"]',
      claimType0: '[name="claimType0"]',
      claimPaidAmount0: '[name="claimPaidAmount0"]',
      consentSoftCredit: '[name="consentSoftCredit"]',
      consentElectronicDelivery: '[name="consentElectronicDelivery"]',
      electronicSignature: '[name="electronicSignature"]',
    };

    const firstErrorKey = errorOrder.find((errorKey) => formErrors[errorKey]);
    if (!firstErrorKey) {
      return;
    }

    const selector = selectorByErrorKey[firstErrorKey];
    if (!selector) {
      return;
    }

    requestAnimationFrame(() => {
      focusFieldBySelector(selector);
    });
  };

  const validateForm = (data) => {
    const nextErrors = {};

    if (isBlank(data.firstName)) nextErrors.firstName = REQUIRED_MESSAGE;
    if (isBlank(data.lastName)) nextErrors.lastName = REQUIRED_MESSAGE;
    if (isBlank(data.dateOfBirth)) nextErrors.dateOfBirth = REQUIRED_MESSAGE;
    if (isBlank(data.contactPhone)) {
      nextErrors.contactPhone = REQUIRED_MESSAGE;
    } else if (!PHONE_FORMAT_REGEX.test(data.contactPhone)) {
      nextErrors.contactPhone = INVALID_PHONE_MESSAGE;
    }

    if (isBlank(data.emailAddress)) {
      nextErrors.emailAddress = REQUIRED_MESSAGE;
    } else if (!EMAIL_FORMAT_REGEX.test(data.emailAddress)) {
      nextErrors.emailAddress = INVALID_EMAIL_MESSAGE;
    }

    if (isBlank(data.mailingStreet)) nextErrors.mailingStreet = REQUIRED_MESSAGE;
    if (isBlank(data.mailingCity)) nextErrors.mailingCity = REQUIRED_MESSAGE;
    if (isBlank(data.mailingState)) nextErrors.mailingState = REQUIRED_MESSAGE;
    if (isBlank(data.mailingZip)) {
      nextErrors.mailingZip = REQUIRED_MESSAGE;
    } else if (!ZIP_FORMAT_REGEX.test(data.mailingZip)) {
      nextErrors.mailingZip = INVALID_ZIP_MESSAGE;
    }

    if (isBlank(data.ssnLast4)) {
      nextErrors.ssnLast4 = REQUIRED_MESSAGE;
    } else if (!SSN_LAST4_REGEX.test(data.ssnLast4)) {
      nextErrors.ssnLast4 = INVALID_SSN_LAST4_MESSAGE;
    }

    if (!isBlank(data.fullSsn) && !FULL_SSN_REGEX.test(data.fullSsn)) {
      nextErrors.fullSsn = INVALID_FULL_SSN_MESSAGE;
    }

    if (data.preferredLanguage === 'other' && isBlank(data.preferredLanguageOther)) {
      nextErrors.preferredLanguageOther = REQUIRED_MESSAGE;
    }

    if (!data.claimsHistory?.[0] || isBlank(data.claimsHistory[0].date)) {
      nextErrors.claimDate0 = REQUIRED_MESSAGE;
    }
    if (!data.claimsHistory?.[0] || isBlank(data.claimsHistory[0].type)) {
      nextErrors.claimType0 = REQUIRED_MESSAGE;
    }
    if (!data.claimsHistory?.[0] || isBlank(data.claimsHistory[0].paidAmount)) {
      nextErrors.claimPaidAmount0 = REQUIRED_MESSAGE;
    }

    if (!data.consentSoftCredit) nextErrors.consentSoftCredit = REQUIRED_MESSAGE;
    if (!data.consentElectronicDelivery) nextErrors.consentElectronicDelivery = REQUIRED_MESSAGE;
    if (isBlank(data.electronicSignature)) nextErrors.electronicSignature = REQUIRED_MESSAGE;

    if (data.priorPolicyReason === 'other' && isBlank(data.priorPolicyReasonDetails)) {
      nextErrors.priorPolicyReasonDetails = REQUIRED_MESSAGE;
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let normalizedValue = value;

    if (name === 'contactPhone') {
      normalizedValue = formatPhoneNumber(value);
    } else if (name === 'mailingZip') {
      normalizedValue = formatZipCode(value);
    } else if (name === 'ssnLast4') {
      normalizedValue = digitsOnly(value).slice(0, 4);
    } else if (name === 'fullSsn') {
      normalizedValue = digitsOnly(value).slice(0, 9);
    } else if (name === 'referralCode') {
      const trimmedValue = String(value ?? '').trim();
      setIsReferralCodeValid(trimmedValue.length > 0 && VALID_REFERRAL_CODES.has(trimmedValue.toLowerCase()));
    }

    const updatedForm = {
      ...localForm,
      [name]: type === 'checkbox' ? checked : normalizedValue,
    };

    setLocalForm(updatedForm);

    if (hasSubmitted) {
      setErrors(validateForm(updatedForm));
    }

    if (name === 'priorPolicyReason' && value !== 'other') {
      setLocalForm((previous) => ({
        ...previous,
        priorPolicyReasonDetails: '',
      }));

      if (hasSubmitted) {
        setErrors(validateForm({ ...updatedForm, priorPolicyReasonDetails: '' }));
      }
    }

    if (name === 'preferredLanguage' && value !== 'other') {
      setLocalForm((previous) => ({
        ...previous,
        preferredLanguageOther: '',
      }));

      if (hasSubmitted) {
        setErrors(validateForm({ ...updatedForm, preferredLanguageOther: '' }));
      }
    }
  };

  const handleClaimChange = (index, field, value) => {
    const normalizedValue = field === 'paidAmount'
      ? formatCurrencyInput(value)
      : value;

    const claimsHistory = localForm.claimsHistory.map((claim, claimIndex) => (
      claimIndex === index ? { ...claim, [field]: normalizedValue } : claim
    ));
    const updatedForm = {
      ...localForm,
      claimsHistory,
    };

    setLocalForm(updatedForm);

    if (hasSubmitted) {
      setErrors(validateForm(updatedForm));
    }
  };

  const addClaimRow = () => {
    const updatedForm = {
      ...localForm,
      claimsHistory: [...localForm.claimsHistory, { ...CLAIM_TEMPLATE }],
    };

    setLocalForm(updatedForm);

    if (hasSubmitted) {
      setErrors(validateForm(updatedForm));
    }
  };

  const removeClaimRow = (index) => {
    const updatedForm = {
      ...localForm,
      claimsHistory: localForm.claimsHistory.filter((_, claimIndex) => claimIndex !== index),
    };

    setLocalForm(updatedForm);

    if (hasSubmitted) {
      setErrors(validateForm(updatedForm));
    }

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);

    const requiredFieldErrors = validateForm(localForm);
    setErrors(requiredFieldErrors);

    const incompleteAdditionalClaimIndex = findFirstIncompleteAdditionalClaimIndex(localForm.claimsHistory);

    if (incompleteAdditionalClaimIndex > -1) {
      setClaimsError('Complete all fields for each added claim row, or clear the row before continuing.');

      requestAnimationFrame(() => {
        const claim = localForm.claimsHistory[incompleteAdditionalClaimIndex];
        if (!claim.date) {
          focusFieldBySelector(`[name="claimDate${incompleteAdditionalClaimIndex}"]`);
          return;
        }
        if (!claim.type) {
          focusFieldBySelector(`[name="claimType${incompleteAdditionalClaimIndex}"]`);
          return;
        }
        focusFieldBySelector(`[name="claimPaidAmount${incompleteAdditionalClaimIndex}"]`);
      });

      return;
    }

    if (Object.keys(requiredFieldErrors).length > 0) {
      setClaimsError('');
      focusFirstErrorField(requiredFieldErrors);
      return;
    }

    setClaimsError('');

    const normalizedForm = {
      ...localForm,
      fullLegalName: [localForm.firstName, localForm.middleName, localForm.lastName]
        .filter((namePart) => !isBlank(namePart))
        .join(' '),
    };

    onNext(normalizedForm);
  };

  return (
    <form className="quote-request__form" onSubmit={handleSubmit} noValidate ref={formRef}>
      <h3>Universal Applicant Form</h3>
      <p className="quote-request__form-intro">
        Please complete all required fields and as many optional fields as possible to reduce follow-up calls.
      </p>
      <p className="quote-request__form-note">
        Note: Review and initial follow-up typically take 1-3 business days.
      </p>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Identity and Contact</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">First Name <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.firstName ? 'quote-request__input--invalid' : ''}
              name="firstName"
              value={localForm.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
            {errors.firstName ? <span className="quote-request__validation-message">{errors.firstName}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Middle Name</span>
            <input
              name="middleName"
              value={localForm.middleName}
              onChange={handleChange}
              placeholder="Middle name"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Last Name <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.lastName ? 'quote-request__input--invalid' : ''}
              name="lastName"
              value={localForm.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
            {errors.lastName ? <span className="quote-request__validation-message">{errors.lastName}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Date of Birth <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.dateOfBirth ? 'quote-request__input--invalid' : ''}
              name="dateOfBirth"
              value={localForm.dateOfBirth}
              onChange={handleChange}
              type="date"
              required
            />
            {errors.dateOfBirth ? <span className="quote-request__validation-message">{errors.dateOfBirth}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Contact Phone Number <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.contactPhone ? 'quote-request__input--invalid' : ''}
              name="contactPhone"
              value={localForm.contactPhone}
              onChange={handleChange}
              type="text"
              inputMode="numeric"
              placeholder="(555) 555 5555"
              pattern="^\(\d{3}\)\s\d{3}\s\d{4}$"
              title="Use format: (XXX) XXX XXXX"
              required
            />
            {errors.contactPhone ? <span className="quote-request__validation-message">{errors.contactPhone}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Email Address <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.emailAddress ? 'quote-request__input--invalid' : ''}
              name="emailAddress"
              value={localForm.emailAddress}
              onChange={handleChange}
              placeholder="name@example.com"
              type="text"
              inputMode="email"
              title="Enter a valid email address"
              required
            />
            {errors.emailAddress ? <span className="quote-request__validation-message">{errors.emailAddress}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Mailing Address</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Street Address <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.mailingStreet ? 'quote-request__input--invalid' : ''}
              name="mailingStreet"
              value={localForm.mailingStreet}
              onChange={handleChange}
              placeholder="Street address"
              required
            />
            {errors.mailingStreet ? <span className="quote-request__validation-message">{errors.mailingStreet}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">City <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.mailingCity ? 'quote-request__input--invalid' : ''}
              name="mailingCity"
              value={localForm.mailingCity}
              onChange={handleChange}
              placeholder="City"
              required
            />
            {errors.mailingCity ? <span className="quote-request__validation-message">{errors.mailingCity}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">State <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.mailingState ? 'quote-request__input--invalid' : ''}
              name="mailingState"
              value={localForm.mailingState}
              onChange={handleChange}
              placeholder="State"
              required
            />
            {errors.mailingState ? <span className="quote-request__validation-message">{errors.mailingState}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">ZIP Code <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.mailingZip ? 'quote-request__input--invalid' : ''}
              name="mailingZip"
              value={localForm.mailingZip}
              onChange={handleChange}
              placeholder="12345 or 12345-6789"
              inputMode="numeric"
              maxLength={10}
              required
            />
            {errors.mailingZip ? <span className="quote-request__validation-message">{errors.mailingZip}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Identity Verification and Demographics</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field">
            <span className="quote-request__field-label">SSN (Last 4 Digits) <span className="quote-request__required-mark">*</span></span>
            <input
              className={errors.ssnLast4 ? 'quote-request__input--invalid' : ''}
              name="ssnLast4"
              value={localForm.ssnLast4}
              onChange={handleChange}
              placeholder="1234"
              inputMode="numeric"
              maxLength={4}
              required
            />
            {errors.ssnLast4 ? <span className="quote-request__validation-message">{errors.ssnLast4}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Full SSN (9 Digits)</span>
            <input
              className={errors.fullSsn ? 'quote-request__input--invalid' : ''}
              name="fullSsn"
              value={localForm.fullSsn}
              onChange={handleChange}
              placeholder="123456789"
              inputMode="numeric"
              maxLength={9}
            />
            {errors.fullSsn ? <span className="quote-request__validation-message">{errors.fullSsn}</span> : null}
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Marital Status</span>
            <select
              name="maritalStatus"
              value={localForm.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="domestic-partner">Domestic Partner</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Gender</span>
            <select
              name="gender"
              value={localForm.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="prefer-not-to-say">Prefer Not To Say</option>
            </select>
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Preferred Language</span>
            <select
              name="preferredLanguage"
              value={localForm.preferredLanguage}
              onChange={handleChange}
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="other">Other</option>
            </select>
          </label>

          {localForm.preferredLanguage === 'other' ? (
            <label className="quote-request__field">
              <span className="quote-request__field-label">Specify Preferred Language <span className="quote-request__required-mark">*</span></span>
              <input
                className={errors.preferredLanguageOther ? 'quote-request__input--invalid' : ''}
                name="preferredLanguageOther"
                value={localForm.preferredLanguageOther}
                onChange={handleChange}
                placeholder="Type language"
                required
              />
              {errors.preferredLanguageOther ? <span className="quote-request__validation-message">{errors.preferredLanguageOther}</span> : null}
            </label>
          ) : null}
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Prior Insurance Information</h4>
        <div className="quote-request__grid">
          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">Prior Insurance Carrier (Most Recent)</span>
            <input
              name="priorInsuranceCarrier"
              value={localForm.priorInsuranceCarrier}
              onChange={handleChange}
              placeholder="Carrier name"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Prior Policy Expiration / Cancellation Date</span>
            <input
              name="priorPolicyDate"
              value={localForm.priorPolicyDate}
              onChange={handleChange}
              type="date"
            />
          </label>

          <label className="quote-request__field">
            <span className="quote-request__field-label">Prior Policy Cancellation / Non-Renewal Reason</span>
            <select
              name="priorPolicyReason"
              value={localForm.priorPolicyReason}
              onChange={handleChange}
            >
              <option value="">Select reason</option>
              <option value="non-payment">Non-payment</option>
              <option value="non-renewal">Non-renewal</option>
              <option value="carrier-exit">Carrier exit</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="quote-request__field quote-request__field--full">
            <span className="quote-request__field-label">
              Reason Details {localForm.priorPolicyReason === 'other' ? <span className="quote-request__required-mark">*</span> : null}
            </span>
            <input
              className={errors.priorPolicyReasonDetails ? 'quote-request__input--invalid' : ''}
              name="priorPolicyReasonDetails"
              value={localForm.priorPolicyReasonDetails}
              onChange={handleChange}
              placeholder="Add details if needed"
              required={localForm.priorPolicyReason === 'other'}
            />
            {errors.priorPolicyReasonDetails ? <span className="quote-request__validation-message">{errors.priorPolicyReasonDetails}</span> : null}
          </label>
        </div>
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Loss / Claims History (Past 5 Years)</h4>
        <p className="quote-request__small-note">At least one claim row is required. Add more rows if applicable.</p>
        <div className="quote-request__claims-list">
          {localForm.claimsHistory.map((claim, index) => (
            <div className="quote-request__claim-row" key={`claim-${index + 1}`}>
              <label className="quote-request__field">
                <span className="quote-request__field-label">
                  Claim Date {index === 0 ? <span className="quote-request__required-mark">*</span> : null}
                </span>
                <input
                  className={errors.claimDate0 && index === 0 ? 'quote-request__input--invalid' : ''}
                  name={`claimDate${index}`}
                  type="date"
                  value={claim.date}
                  onChange={(event) => handleClaimChange(index, 'date', event.target.value)}
                  required={index === 0}
                />
                {errors.claimDate0 && index === 0 ? <span className="quote-request__validation-message">{errors.claimDate0}</span> : null}
              </label>

              <label className="quote-request__field">
                <span className="quote-request__field-label">
                  Claim Type {index === 0 ? <span className="quote-request__required-mark">*</span> : null}
                </span>
                <input
                  className={errors.claimType0 && index === 0 ? 'quote-request__input--invalid' : ''}
                  name={`claimType${index}`}
                  value={claim.type}
                  onChange={(event) => handleClaimChange(index, 'type', event.target.value)}
                  placeholder="Type of loss"
                  required={index === 0}
                />
                {errors.claimType0 && index === 0 ? <span className="quote-request__validation-message">{errors.claimType0}</span> : null}
              </label>

              <label className="quote-request__field">
                <span className="quote-request__field-label">
                  Paid Amount (USD) {index === 0 ? <span className="quote-request__required-mark">*</span> : null}
                </span>
                <input
                  className={errors.claimPaidAmount0 && index === 0 ? 'quote-request__input--invalid' : ''}
                  name={`claimPaidAmount${index}`}
                  type="text"
                  inputMode="decimal"
                  value={claim.paidAmount}
                  onChange={(event) => handleClaimChange(index, 'paidAmount', event.target.value)}
                  placeholder="1,000.00"
                  required={index === 0}
                />
                {errors.claimPaidAmount0 && index === 0 ? <span className="quote-request__validation-message">{errors.claimPaidAmount0}</span> : null}
              </label>

              {index > 0 ? (
                <button
                  className="quote-request__inline-secondary"
                  type="button"
                  onClick={() => removeClaimRow(index)}
                >
                  Remove Row
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <div className="quote-request__inline-buttons">
          <button className="quote-request__inline-secondary" type="button" onClick={addClaimRow}>
            Add Another Claim
          </button>
        </div>
        {claimsError ? <p className="quote-request__error">{claimsError}</p> : null}
      </div>

      <div className="quote-request__section">
        <h4 className="quote-request__section-title">Consent and Signature</h4>
        <label className={`quote-request__checkbox-row${errors.consentSoftCredit ? ' quote-request__checkbox-row--invalid' : ''}`}>
          <input
            name="consentSoftCredit"
            type="checkbox"
            checked={localForm.consentSoftCredit}
            onChange={handleChange}
            required
          />
          <span>I consent to a soft credit / insurance score inquiry. <span className="quote-request__required-mark">*</span></span>
        </label>
        {errors.consentSoftCredit ? <span className="quote-request__validation-message">{errors.consentSoftCredit}</span> : null}

        <label className={`quote-request__checkbox-row${errors.consentElectronicDelivery ? ' quote-request__checkbox-row--invalid' : ''}`}>
          <input
            name="consentElectronicDelivery"
            type="checkbox"
            checked={localForm.consentElectronicDelivery}
            onChange={handleChange}
            required
          />
          <span>I consent to electronic delivery of documents. <span className="quote-request__required-mark">*</span></span>
        </label>
        {errors.consentElectronicDelivery ? <span className="quote-request__validation-message">{errors.consentElectronicDelivery}</span> : null}

        <label className="quote-request__field quote-request__field--full quote-request__field--signature">
          <span className="quote-request__field-label">Electronic Signature (Type Full Name) <span className="quote-request__required-mark">*</span></span>
          <input
            className={errors.electronicSignature ? 'quote-request__input--invalid' : ''}
            name="electronicSignature"
            value={localForm.electronicSignature}
            onChange={handleChange}
            placeholder="Type your full legal name"
            required
          />
          {errors.electronicSignature ? <span className="quote-request__validation-message">{errors.electronicSignature}</span> : null}
        </label>

        <label className="quote-request__field quote-request__field--full">
          <span className="quote-request__field-label">Referral Code</span>
          <input
            name="referralCode"
            value={localForm.referralCode}
            onChange={handleChange}
            placeholder="Enter referral code (optional)"
            className={localForm.referralCode && isReferralCodeValid ? 'quote-request__input--valid' : ''}
          />
        </label>

        <label className="quote-request__field quote-request__field--full quote-request__field--notes">
          <span className="quote-request__field-label">Additional Notes</span>
          <textarea
            name="applicantNotes"
            value={localForm.applicantNotes}
            onChange={handleChange}
            placeholder="Anything else we should know before we quote?"
          />
        </label>
      </div>

      <button type="submit">Continue to Insurance Selection</button>
    </form>
  );
}

export default UniversalApplicantForm;
