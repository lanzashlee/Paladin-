const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_MAX_OUTPUT_TOKENS = Number.isFinite(Number(process.env.OPENAI_MAX_OUTPUT_TOKENS))
  ? Math.max(200, Number(process.env.OPENAI_MAX_OUTPUT_TOKENS))
  : 700;
const ELEVENLABS_API_BASE_URL = process.env.ELEVENLABS_API_URL || 'https://api.elevenlabs.io/v1';
const ELEVENLABS_DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const ELEVENLABS_DEFAULT_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

const SYSTEM_PROMPT =
  'You are Paladin Professional Insurance Solutions voice assistant. Keep answers clear, concise, and friendly. Prioritize practical next steps based on Paladin workflows (consultation request, document request, policy change, update contact info, claim report, and call request). Ask one short clarifying question when details are missing. If asked for policy-specific legal advice, suggest contacting a licensed agent.';

const PALADIN_FACTS = `
Company: Paladin Professional Insurance Solutions, an independent insurance agency based in Ventura, CA.
Phone: 805-692-6900.
Fax: 805-830-1680.
Email: support@paladinbusinessservices.net.
Office address: 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003.
Office hours: Monday through Friday, 9:00 AM to 5:00 PM. Closed Saturdays and Sundays.
After hours: Email support@paladinbusinessservices.net and an agent will respond the next business day.
Claims: Customers can report claims through the website or by phone, and a licensed agent will follow up shortly.
Policy changes: Customers can request changes or contact updates through the website or by phone.
Consultations: Personalized consultations and callback requests are available through the website or by contacting the office.
Licensed states: CA, AZ, ID, IL, IN, NV, NC, OH, and TX.
Core coverage: general liability, renters, umbrella, workers' compensation, flood, commercial auto, cyber liability, earthquake, commercial insurance, home, auto, life, and health.
`;

const REQUEST_FORM_GUIDE = `
Request form guidance:
- Consultation request: full name, email, phone, coverage type, preferred contact method, timeline, and notes.
- Document request: full name, email, document type, coverages to show, operations description, additional insured status, endorsements, certificate holder details, and deadline instructions.
- Policy change: full name, email, policy type, effective date, requested change types, notes, and mortgagee / lienholder details when needed.
- Update contact info: full name, email, requested update types, new contact or address details, what policies to apply changes to, notes, and policy number when a single policy is selected.
- Claim report: full name, email, policy number, phone, incident date and time, claim type, incident location, other-party details, police report information, estimated loss, carrier contact status, carrier claim number, and additional notes.
- Call request: full name, phone, optional email, policy number, preferred day, preferred time, alternate date / time, topic, other topic details, and notes.
`;

const UNIVERSAL_APPLICANT_GUIDE = `
Universal applicant information:
- Full legal name: first, middle, and last name; must match government-issued ID and policy documents exactly.
- Date of birth: date picker in MM/DD/YYYY format.
- Contact phone number: primary follow-up number in (XXX) XXX-XXXX format.
- Email address: required for quotes, documents, and correspondence.
- Mailing address: street, city, state, and ZIP code; used for billing, correspondence, and disclosures.
- Social Security Number last 4 digits: masked 4-digit input for identity verification and insurance score checks.
- Full SSN: masked 9-digit input; collect only if permitted and required by the carrier.
- Marital status: Single, Married, Domestic Partner, Widowed, or Divorced.
- Gender: Male, Female, Non-Binary, or Prefer Not to Say; some states restrict how this can be used.
- Preferred language: English, Spanish, or Other.
- Prior insurance carrier: most recent carrier name for continuity and discount checks.
- Prior policy expiration or cancellation date: used to detect coverage gaps and lapses.
- Prior cancellation or non-renewal reason: capture the reason so underwriting can assess the risk correctly.
- Loss or claims history: record the date, type, and paid amount for each loss in the past 5 years.
- Consent to soft credit / insurance score inquiry: required before running an insurance score.
- Electronic signature / consent to electronic delivery: required for electronic policy delivery.
`;

const KNOWN_TOPICS = [
  {
    keywords: ['hour', 'hours', 'open', 'available', 'office', 'weekend', 'closed'],
    reply:
      'Paladin is open Monday through Friday, 9:00 AM to 5:00 PM, and closed on Saturdays and Sundays. If you need help after hours, email support@paladinbusinessservices.net and an agent will reply the next business day.',
  },
  {
    keywords: ['phone', 'call', 'contact', 'reach', 'fax', 'email', 'address', 'location', 'located'],
    reply:
      'You can reach Paladin at 805-692-6900, fax 805-830-1680, or email support@paladinbusinessservices.net. The office is at 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003.',
  },
  {
    keywords: ['claim', 'claims', 'report a claim', 'file a claim'],
    reply:
      'You can report a claim through the website or by calling 805-692-6900. After submission, one of our licensed agents will contact you shortly and guide you through the process.',
  },
  {
    keywords: ['policy change', 'policy changes', 'update policy', 'change policy', 'update contact', 'contact information'],
    reply:
      'Policy changes and contact updates can be requested through the website or by contacting the office. Our team will process the request as quickly as possible during business hours.',
  },
  {
    keywords: ['proof of insurance', 'certificate of insurance', 'certificate'],
    reply:
      'You can request proof of insurance through the website. If it is urgent, call 805-692-6900 during business hours and an agent will help.',
  },
  {
    keywords: ['document request', 'coi', 'declarations page', 'endorsement copy', 'additional insured', 'waiver of subrogation', 'p&nc'],
    reply:
      'The document request form asks for your name, email, the document type, the coverage to show, the certificate holder details, and any endorsement wording or deadline instructions. If you need a COI, include whether the request needs Additional Insured or special endorsement wording.',
  },
  {
    keywords: ['policy change', 'change request', 'driver change', 'vehicle change', 'coverage limits', 'deductible', 'mortgagee', 'lienholder'],
    reply:
      'The policy change form asks for your name, email, policy type, requested change type, effective date, notes, and mortgagee or lienholder details when the change affects them. Include enough detail so the carrier can process the request without follow-up.',
  },
  {
    keywords: ['update contact', 'contact info', 'mailing address', 'phone number', 'email address', 'legal name'],
    reply:
      'The update contact info form is used for email, phone, mailing address, legal name, and other account updates. It also lets you choose whether the change applies to all active policies or one specific policy.',
  },
  {
    keywords: ['consultation request', 'personalized consultation', 'coverage type', 'preferred contact', 'timeline'],
    reply:
      'The consultation request form collects your name, email, phone, coverage type, preferred contact method, timeline, and any notes so an agent can prepare a tailored recommendation.',
  },
  {
    keywords: ['call request', 'callback request', 'preferred day', 'preferred time', 'alternate date', 'topic'],
    reply:
      'The call request form collects your name, phone number, optional email, policy number, preferred day and time, alternate date or time, and the topic you want to discuss.',
  },
  {
    keywords: ['claim report', 'claim form', 'incident date', 'incident time', 'loss amount', 'claim number', 'police report'],
    reply:
      'The claim report form collects your name, email, policy number, phone number, incident date and time, claim type, incident location, other-party information, police report details, estimated loss, and carrier claim information when available.',
  },
  {
    keywords: ['full legal name', 'date of birth', 'ssn last 4', 'full ssn', 'marital status', 'preferred language', 'loss history', 'soft credit', 'electronic signature'],
    reply:
      'The universal applicant intake section collects the client\'s full legal name, date of birth, contact phone number, email address, mailing address, SSN last 4, optional full SSN when allowed, marital status, gender, preferred language, prior carrier details, prior policy end date or cancellation date, cancellation reason, loss history, soft credit consent, and electronic delivery consent. Required items must be completed before submission, and optional items should still be shown because they improve the quote and reduce follow-up.',
  },
  {
    keywords: ['consultation', 'quote', 'callback', 'call back', 'request a call', 'talk to an agent'],
    reply:
      'Paladin offers personalized consultations and callback requests through the website. You can also call 805-692-6900 or email support@paladinbusinessservices.net to speak with an agent.',
  },
  {
    keywords: ['independent', 'carrier', 'carriers', 'different', 'compare'],
    reply:
      'Paladin is an independent agency, so we can compare multiple carriers on your behalf instead of being tied to a single provider.',
  },
  {
    keywords: ['licensed states', 'states', 'california', 'arizona', 'idaho', 'illinois', 'indiana', 'nevada', 'north carolina', 'ohio', 'texas'],
    reply:
      'Paladin is licensed in CA, AZ, ID, IL, IN, NV, NC, OH, and TX, and can help clients in those states remotely when needed.',
  },
  {
    keywords: ['privacy', 'confidential', 'confidentiality', 'data'],
    reply:
      'Paladin treats client information with care and discretion and does not share data without consent.',
  },
  {
    keywords: ['general liability'],
    reply:
      'General liability helps protect businesses from third-party claims involving bodily injury, property damage, and certain personal injury claims.',
  },
  {
    keywords: ['renters'],
    reply:
      'Renters insurance can help protect your belongings and liability as a renter, including risks like theft, fire, and water damage.',
  },
  {
    keywords: ['umbrella'],
    reply:
      'Umbrella insurance adds extra liability protection beyond your existing policies and can help provide broader financial coverage for larger claims.',
  },
  {
    keywords: ['workers compensation', 'workers comp'],
    reply:
      "Workers' compensation helps provide medical and wage benefits for employees with work-related injuries or illness.",
  },
  {
    keywords: ['flood'],
    reply:
      'Flood insurance can help protect your home and belongings from flood-related damage, subject to the policy terms.',
  },
  {
    keywords: ['commercial auto', 'business vehicle', 'fleet', 'truck', 'van'],
    reply:
      'Commercial auto insurance can help protect business vehicles against accidents, property damage, liability claims, theft, and vandalism.',
  },
  {
    keywords: ['cyber', 'data breach', 'cyber liability'],
    reply:
      'Cyber liability insurance is designed to help businesses manage costs tied to cyberattacks, data breaches, recovery, and notice obligations.',
  },
  {
    keywords: ['earthquake'],
    reply:
      'Earthquake insurance is specialized property coverage that can help with repair or rebuilding costs from earthquake damage.',
  },
  {
    keywords: ['commercial insurance', 'business insurance'],
    reply:
      'Commercial insurance is a broad set of protections for business risks, including liability, property damage, and employee-related exposures.',
  },
];

const SAMPLE_QUESTION_RESPONSES = [
  // PART 1: UNIVERSAL APPLICANT
  {
    patterns: [/full legal name/i],
    reply:
      'You\'ll need to provide your first, middle, and last names as they appear on your government-issued ID.',
  },
  {
    patterns: [/why.*date.*birth/i],
    reply:
      'Your date of birth is required for eligibility verification, rating, and underwriting purposes across all insurance lines.',
  },
  {
    patterns: [/different phone/i],
    reply:
      'The phone number you provide should be the primary contact number where we can reach you for follow-ups and policy delivery.',
  },
  {
    patterns: [/how.*email/i],
    reply:
      'We will use your email to send policy documents, quotes, and any important updates related to your insurance coverage.',
  },
  {
    patterns: [/skip.*ssn/i, /full ssn/i],
    reply:
      'The last 4 digits of your SSN are required for identity verification and insurance score checks. The full SSN is optional unless required by certain carriers.',
  },
  // PART 2: HOMEOWNERS INSURANCE HO3
  {
    patterns: [/property address.*homeowners/i],
    reply:
      'Please enter the address of the home that you want to insure, not your mailing address.',
  },
  {
    patterns: [/county.*affect.*homeowners/i],
    reply:
      'The county is important for certain insurance requirements, such as risk factors related to wildfire and earthquake zones, and it helps us determine the best coverage for your area.',
  },
  {
    patterns: [/don.?t know.*year.*built/i],
    reply:
      'The year your property was built is essential for underwriting purposes, as it helps assess your home\'s eligibility for certain coverage types and determines the replacement cost.',
  },
  {
    patterns: [/stories.*necessary/i],
    reply:
      'Yes, the number of stories is necessary because it impacts both the replacement cost and the overall rating for your policy.',
  },
  {
    patterns: [/pool.*covered/i],
    reply:
      'If you have a pool, it can affect both your liability coverage and the overall premium. Certain safety measures may be required.',
  },
  // PART 3: CONDO OWNERS INSURANCE HO6
  {
    patterns: [/difference.*condo.*house/i],
    reply:
      'Condo insurance covers the interior of your unit and your personal property, while the building\'s exterior is covered by the HOA\'s master policy.',
  },
  {
    patterns: [/construction type/i],
    reply:
      'The construction type affects the fire-resistance rating, which impacts your coverage and premiums.',
  },
  {
    patterns: [/stories.*condo/i],
    reply:
      'High-floor units have a different risk profile, especially for water damage from the roof, so this helps us assess the appropriate coverage.',
  },
  {
    patterns: [/renovations.*upgrades/i],
    reply:
      'Yes, providing details of any upgrades or renovations helps us assess the true replacement cost of your unit and ensures you\'re adequately covered.',
  },
  {
    patterns: [/liability.*condo/i],
    reply:
      'Yes, liability coverage is included to protect against injuries or damage caused within your unit. You can also select higher limits if needed.',
  },
  // PART 4: RENTERS INSURANCE HO4
  {
    patterns: [/what is renters insurance/i],
    reply:
      'Renters insurance covers your personal belongings, liability protection, and sometimes additional living expenses if your home becomes uninhabitable.',
  },
  {
    patterns: [/how much.*renters/i],
    reply:
      'You\'ll need to estimate the value of your personal belongings and select coverage that matches that value.',
  },
  {
    patterns: [/liability.*renters/i],
    reply:
      'Liability coverage protects you if someone is injured in your rental unit or if you accidentally damage someone else\'s property.',
  },
  {
    patterns: [/type of rental/i],
    reply:
      'Whether you\'re renting an apartment, condo, or house can affect your coverage options and premiums.',
  },
  {
    patterns: [/landlord.*insurance/i],
    reply:
      'Yes, your landlord\'s insurance only covers the building, not your personal belongings. Renters insurance is necessary to protect your possessions.',
  },
  // PART 5: COMMERCIAL AUTO INSURANCE
  {
    patterns: [/what is commercial auto/i],
    reply:
      'Commercial auto insurance covers vehicles used for business purposes, including transporting goods, employees, or offering services.',
  },
  {
    patterns: [/determine.*premium.*commercial/i],
    reply:
      'The premium is based on factors such as the type of vehicle, its use, the number of vehicles, and driving history.',
  },
  {
    patterns: [/difference.*personal.*commercial/i],
    reply:
      'Yes, personal auto insurance covers personal use of a vehicle, while commercial auto insurance covers business-related use and provides higher liability limits.',
  },
  {
    patterns: [/list all drivers/i],
    reply:
      'All drivers need to be listed for underwriting purposes, as unlisted drivers may not be covered in the event of an accident.',
  },
  {
    patterns: [/past accidents.*commercial/i],
    reply:
      'Yes, past accidents are critical for determining your premium and coverage eligibility.',
  },
  // PART 6: GENERAL LIABILITY INSURANCE
  {
    patterns: [/what.*general liability/i],
    reply:
      'General liability insurance protects your business from third-party claims of bodily injury, property damage, and personal injury.',
  },
  {
    patterns: [/describe.*business.*operations/i],
    reply:
      'The description helps determine your risk exposure and is a critical factor in calculating your premium.',
  },
  {
    patterns: [/revenue.*impact/i],
    reply:
      'Higher revenue typically means a higher level of risk, which can affect your premium. It\'s important to provide an accurate estimate.',
  },
  {
    patterns: [/subcontractors/i],
    reply:
      'Subcontractors may need their own insurance, or you may need to ensure that they are covered under your policy depending on the nature of their work.',
  },
  {
    patterns: [/per occurrence.*aggregate/i],
    reply:
      'Per occurrence limits refer to the maximum payout for a single claim, while aggregate limits are the total payout for all claims during a policy period.',
  },
  // PART 7: WORKERS COMPENSATION INSURANCE
  {
    patterns: [/what is workers.? compensation/i],
    reply:
      'Workers\' compensation insurance covers medical expenses and lost wages for employees who are injured at work. It\'s required for most businesses with employees.',
  },
  {
    patterns: [/job classification/i],
    reply:
      'Job classification helps determine the level of risk and premium for each worker based on their duties.',
  },
  {
    patterns: [/premium.*calculated.*workers/i],
    reply:
      'Premiums are based on the estimated annual payroll and the risk classification of your business activities.',
  },
  {
    patterns: [/history.*workers comp/i],
    reply:
      'A history of claims can affect your premium, and it may require you to provide additional documentation or purchase coverage through specialty markets.',
  },
  {
    patterns: [/few employees.*workers/i],
    reply:
      'Yes, in most states, workers\' compensation is required for any business with employees, even if you have just one.',
  },
  // PART 8: EARTHQUAKE INSURANCE
  {
    patterns: [/earthquake.*homeowners/i],
    reply:
      'No, earthquake coverage is typically separate from standard homeowners insurance and requires an additional policy or endorsement.',
  },
  {
    patterns: [/need.*earthquake/i],
    reply:
      'If you live in an area prone to earthquakes, it\'s highly recommended. Your insurance provider will assess the risk based on your location.',
  },
  {
    patterns: [/cost.*earthquake/i],
    reply:
      'The cost is influenced by factors such as the age of your home, its construction type, and its location in relation to fault lines.',
  },
  {
    patterns: [/deductible.*earthquake/i],
    reply:
      'Yes, earthquake policies usually have a deductible, which can vary based on the coverage you select.',
  },
  {
    patterns: [/earthquake.*flood/i],
    reply:
      'No, earthquake insurance typically covers only damage caused by seismic activity. Flooding may require a separate flood insurance policy.',
  },
  // PART 9: FLOOD INSURANCE
  {
    patterns: [/why.*flood.*not near/i],
    reply:
      'Flooding can occur in unexpected areas due to heavy rainfall, storms, or infrastructure failure. FEMA\'s flood maps help determine your flood risk.',
  },
  {
    patterns: [/how.*know.*flood zone/i],
    reply:
      'FEMA\'s flood zone maps will tell you if your property is located in a high-risk zone. You can also consult your insurance provider for guidance.',
  },
  {
    patterns: [/flood.*required.*law/i],
    reply:
      'Flood insurance is not legally required unless you live in a high-risk flood zone and have a mortgage from a federally regulated lender.',
  },
  {
    patterns: [/flood insurance.*covers/i],
    reply:
      'Flood insurance typically covers damages to your home\'s structure, personal property, and sometimes additional living expenses if the property becomes uninhabitable.',
  },
  {
    patterns: [/increase.*flood/i],
    reply:
      'Yes, you can choose to increase your coverage limit depending on the needs of your property.',
  },
  // PART 10: UMBRELLA / EXCESS LIABILITY
  {
    patterns: [/what is umbrella/i],
    reply:
      'Umbrella insurance provides additional liability coverage beyond your primary policies, such as home and auto, offering extra protection in case of large claims.',
  },
  {
    patterns: [/umbrella.*everything/i],
    reply:
      'It generally covers personal injury, property damage, and certain lawsuits, but there are exclusions, such as business-related claims.',
  },
  {
    patterns: [/umbrella.*already.*liability/i],
    reply:
      'Umbrella insurance provides an extra layer of protection in case your primary liability coverage limits are exhausted.',
  },
  {
    patterns: [/umbrella.*limit/i],
    reply:
      'The limit represents the maximum amount your umbrella policy will pay out. Higher limits offer more extensive protection.',
  },
  {
    patterns: [/exclusions.*umbrella/i],
    reply:
      'Yes, umbrella insurance typically does not cover business-related liability, certain types of damage, or intentional acts.',
  },
  // PART 11: SPECIALTY PRODUCTS
  {
    patterns: [/cyber liability/i],
    reply:
      'Cyber liability insurance helps protect your business against data breaches, hacking, and other cyber threats.',
  },
  {
    patterns: [/professional liability/i],
    reply:
      'Yes, this description is required to assess the type of coverage your business needs based on the professional services you provide.',
  },
  {
    patterns: [/inland marine/i],
    reply:
      'Coverage is determined by the type and value of property you need to insure, such as equipment, electronics, or fine art.',
  },
  {
    patterns: [/surety bond/i],
    reply:
      'A surety bond is a guarantee that a business will fulfill its contractual obligations. It\'s required for certain licenses or projects.',
  },
  {
    patterns: [/pet insurance/i],
    reply:
      'Pet insurance typically covers accidents, illnesses, and sometimes wellness care for pets, depending on the plan you choose.',
  },
  // PART 12: CARRIER DIRECTORY & PRODUCT MAPPING
  {
    patterns: [/choose.*carrier/i],
    reply:
      'You can refer to our carrier directory for a list of active carriers and their specific product offerings based on your needs.',
  },
  {
    patterns: [/specialty.*not listed/i],
    reply:
      'If you need a specialty product, we\'ll work with you to find the right carrier or alternative solution for your unique requirements.',
  },
  {
    patterns: [/change.*carrier/i],
    reply:
      'Yes, you can switch carriers if necessary, but it may require review and adjustment of your policy terms.',
  },
  {
    patterns: [/file.*claim.*carrier/i],
    reply:
      'The process for filing a claim will depend on your specific carrier, and we can provide guidance on how to do this efficiently.',
  },
  {
    patterns: [/carrier directory.*all/i],
    reply:
      'Yes, the carrier directory includes information on all types of coverage, from standard homeowners to more specialized commercial policies.',
  },
  // POPULAR QUESTIONS
  {
    patterns: [/what.*paladin/i, /who.*paladin/i, /about.*company/i],
    reply:
      'Paladin Professional Insurance Solutions is a full-service independent insurance agency located in Ventura, California. We specialize in evaluating and placing personal and commercial lines across multiple insurance carriers, serving individuals, small businesses, and large commercial enterprises throughout California, Arizona, Idaho, Illinois, Indiana, Nevada, North Carolina, Ohio, and Texas.',
  },
  {
    patterns: [/independent.*agency/i, /benefit.*working.*independent/i, /why.*choose.*independent/i],
    reply:
      'Independent agencies like Paladin represent dozens of insurance carriers rather than a single company. This gives us the ability to evaluate your specific risk profile against multiple underwriting guidelines and competitive rates, ensuring you receive a customized insurance portfolio that matches your budget and coverage objectives.',
  },
  {
    patterns: [/what.*products.*sell/i, /product.*lines/i, /insurance.*categories/i],
    reply:
      'Our product portfolio spans homeowners, condo, renters, commercial auto and trucks, general liability, workers compensation, property and casualty, umbrella and excess liability, flood insurance, earthquake coverage, cyber liability, specialty and niche coverages, and industry-specific programs for contractors, restaurants, healthcare, and other specialized businesses.',
  },
  {
    patterns: [/licensed.*states/i, /where.*operate/i, /service.*area/i],
    reply:
      'Paladin holds active insurance licenses in nine states: California, Arizona, Idaho, Illinois, Indiana, Nevada, North Carolina, Ohio, and Texas. We maintain partnerships with carriers licensed in additional states, expanding our capacity to serve multi-state operations and national account needs.',
  },
  {
    patterns: [/carrier.*relationships/i, /work.*with.*insurers/i, /carrier.*partnerships/i],
    reply:
      'We maintain active appointments with over thirty regional and national insurance carriers. Our established relationships give us priority access to underwriting, expedited quote turnaround, preferred commission structures, and the ability to advocate for better rates and coverage terms on your behalf with carrier underwriting teams.',
  },
  // CONSULTATION QUESTIONS
  {
    patterns: [/what.*consultation.*request/i, /how.*consultation.*work/i, /define.*consultation/i],
    reply:
      'A consultation request initiates a structured intake conversation with one of our licensed agents. We use this session to understand your business operations, loss history, coverage gaps, risk tolerance, and budget constraints. Based on your input, we develop customized insurance recommendations aligned with your specific exposures and financial objectives.',
  },
  {
    patterns: [/how.*long.*consultation/i, /duration.*consultation.*meeting/i],
    reply:
      'Initial consultations typically run thirty to forty-five minutes. This allows time for the agent to thoroughly understand your situation, ask clarifying questions about your operations and history, and outline potential solution paths. Complex commercial accounts may require follow-up consultations to address all coverage areas.',
  },
  {
    patterns: [/what.*information.*needed.*consultation/i, /prepare.*consultation/i, /bring.*consultation/i],
    reply:
      'Before your consultation, gather your current insurance policies, recent loss history, business tax returns or financial statements if applicable, details about your operations, and a list of any specific concerns or coverage gaps you\'ve identified. Having this information available helps the agent make more informed recommendations quickly.',
  },
  {
    patterns: [/when.*receive.*proposal/i, /after.*consultation.*next/i, /timeline.*recommendations/i],
    reply:
      'After your consultation concludes, the agent compiles notes and generates personalized quote proposals from appropriate carriers within two to three business days. You\'ll receive these proposals via email with a summary of coverage recommendations, premium comparisons, and explanation of how each proposal addresses your identified needs.',
  },
  {
    patterns: [/cost.*charge.*consultation/i, /fee.*consultation.*service/i],
    reply:
      'Paladin consultations are provided at no cost. Our business model depends on commissions from insurance carriers, not client fees. Whether you move forward with coverage or not, there\'s no charge for the time our agents spend evaluating your insurance needs and providing professional guidance.',
  },
  // DOCUMENTS QUESTIONS
  {
    patterns: [/what.*certificate.*insurance/i, /explain.*coi/i, /coi.*definition/i],
    reply:
      'A Certificate of Insurance is a one-page summary document issued by the insurance carrier listing active policies, coverage types, coverage limits, policy deductibles, policy expiration dates, and named insureds. The certificate serves as proof of coverage for contractual requirements, vendor relationships, loan applications, lease agreements, and regulatory compliance documentation.',
  },
  {
    patterns: [/what.*declarations.*page/i, /declare.*page.*definition/i],
    reply:
      'A declarations page is the primary policy document that contains all key policy information: the named insured, policy effective and expiration dates, coverage types, coverage limits, deductibles, premium amounts, endorsements attached, exclusions applied, and billing instructions. It serves as the policy summary and reference document for your coverage understanding.',
  },
  {
    patterns: [/additional.*insured.*endorsement/i, /what.*additional.*insured/i],
    reply:
      'An Additional Insured endorsement extends liability coverage protection to another party, like a general contractor requiring subcontractors to carry the GC as an additional insured, or a landlord requiring tenants to carry the landlord as an additional insured. This modifies your policy to include another party\'s interests under your liability protections.',
  },
  {
    patterns: [/waiver.*subrogation/i, /what.*waiver.*subrogation/i],
    reply:
      'A Waiver of Subrogation endorsement prevents your insurance carrier from pursuing recovery against other responsible parties after paying your claim. This is commonly required in construction contracts where one party waives their right to sue another party, or in commercial leases where the landlord requires tenants to waive subrogation rights.',
  },
  {
    patterns: [/primary.*non.*contributory.*p.*nc/i, /what.*p.*nc.*endorsement/i],
    reply:
      'A Primary and Non-Contributory endorsement makes your insurance policy the first payer in a loss situation, with no contribution from other insurance available to the other party. This is often required by contract owners or vendors to ensure Paladin\'s coverage applies first in any covered incident.',
  },
  // POLICY CHANGE QUESTIONS
  {
    patterns: [/what.*policy.*change/i, /define.*policy.*modification/i],
    reply:
      'A policy change is any modification to an active insurance policy after inception. This includes adding or removing drivers or vehicles, adjusting coverage limits, changing deductibles, updating named insureds or loss payees, modifying endorsements, or changing billing addresses. Changes can take effect immediately or on a specified future date.',
  },
  {
    patterns: [/add.*remove.*driver/i, /driver.*change.*policy/i],
    reply:
      'Adding a driver requires providing their full legal name, date of birth, driver license number, license status, and driving history including accidents, violations, and claims. Removing a driver is simpler but requires confirmation that the driver will have no access to any vehicles on the policy. Driver changes typically affect your auto policy premium within one to two business days.',
  },
  {
    patterns: [/deductible.*impact.*premium/i, /change.*deductible.*cost/i],
    reply:
      'Increasing your deductible from 500 to 1000 or higher reduces your annual premium because you accept more financial responsibility in a claim. Decreasing your deductible increases your premium but provides better claim payoff. A 500 dollar deductible increase might lower your premium by five to fifteen percent depending on the coverage and carrier.',
  },
  {
    patterns: [/coverage.*limit.*adjustment/i, /increase.*liability.*limits/i],
    reply:
      'Coverage limits can be adjusted at any time during the policy period. Increasing your limits, such as general liability from one million to two million, increases your premium to reflect the carrier\'s expanded exposure. Conversely, reducing limits lowers your premium but reduces your financial protection in a serious claim.',
  },
  {
    patterns: [/policy.*change.*effective.*date/i, /when.*effective.*change/i],
    reply:
      'Policy changes can be requested as immediate, effective on the next business day, on a future date you specify, or on your policy anniversary. Different carrier systems and change types have different processing requirements. Complex changes like driver additions with underwriting needs may require two to three business days before the change becomes effective with full coverage.',
  },
  // UPDATE INFO QUESTIONS
  {
    patterns: [/update.*contact.*information/i, /modify.*account.*details/i],
    reply:
      'Account contact information updates include changes to your email, phone number, mailing address, and legal name. You can submit these updates through the update contact info form on our website. We use this information to maintain accurate policy records, deliver correspondence, and ensure you receive all policy documents and notices.',
  },
  {
    patterns: [/legal.*name.*change/i, /married.*name.*change/i, /divorce.*update.*name/i],
    reply:
      'Legal name changes require documentation such as a marriage certificate, divorce decree, or legal name change order. You\'ll need to provide your new legal name and copy of the supporting document. Carriers require this for underwriting records and policy accuracy, ensuring your renewals and future quotes reference the correct legal identity.',
  },
  {
    patterns: [/change.*address.*policy/i, /relocated.*property.*address/i],
    reply:
      'Address changes can affect your insurance eligibility, rates, and coverage. Property address changes may trigger re-underwriting since coverage depends on location-specific risk factors. Mailing address changes only update where you receive correspondence. Include both the old and new addresses, and specify whether this is permanent or temporary.',
  },
  {
    patterns: [/apply.*change.*all.*policies/i, /single.*policy.*update/i],
    reply:
      'When updating contact information, you can elect to apply changes to all your active policies with Paladin, or to a single specific policy. This is useful if you have multiple policies and need to update, for example, your cell phone on your personal auto policy only, while keeping a business email on your commercial policies.',
  },
  {
    patterns: [/verification.*documentation.*update/i, /confirm.*identity.*update/i],
    reply:
      'For sensitive updates like legal name changes, some request types may require identity verification such as a copy of your driver license, passport, or supporting legal documents. This protects your account from unauthorized changes and ensures carriers receive verified information for their underwriting files.',
  },
  // CLAIMS QUESTIONS
  {
    patterns: [/how.*report.*claim/i, /file.*claim.*process/i, /report.*incident/i],
    reply:
      'To report a claim, submit the claim report form on our website with the date, time, location, and description of the incident, or contact our office at 805-692-6900. Provide your policy number, detailed description of what happened, photos or video if applicable, any police report filed, witness information, and details of any property damage or injuries involved.',
  },
  {
    patterns: [/what.*information.*needed.*claim/i, /claim.*details.*required/i],
    reply:
      'The claim report form requires your full name, email, phone, policy number, incident date and time with specific timeline, incident location with address, comprehensive description of the damage or injury, responsible party information if third-party claim, any police or fire report number and issuing agency, valuation of damaged property or medical treatment information, photos or video evidence, and contact information for any witnesses present.',
  },
  {
    patterns: [/timeline.*claim.*settlement/i, /how.*long.*claims.*process/i],
    reply:
      'After reporting, Paladin contacts you within twenty-four hours to confirm receipt and assign a claim handler. The carrier begins investigation within two to five business days. Simple claims may settle in two to four weeks, while complex or disputed claims can take sixty to ninety days or longer depending on investigation complexity, medical treatment completion, or repair estimates needed.',
  },
  {
    patterns: [/police.*report.*claim.*requirement/i, /accident.*report.*claim/i],
    reply:
      'For accidents, theft, or criminal incidents, filing a police report is often required or helps support your claim. Request a police report number at the time of filing and include this reference along with the police case number in your claim submission. The report creates an official incident record that helps the carrier verify the loss and process your claim more quickly.',
  },
  {
    patterns: [/claim.*denied/i, /claim.*appeal.*process/i, /dispute.*claim.*denial/i],
    reply:
      'If your claim is denied or the settlement offer is disputed, contact Paladin immediately at 805-692-6900. We review the carrier\'s denial reason, obtain the full claims file, and determine whether grounds exist for appeal based on what the policy covers. We advocate on your behalf with the carrier and explain your coverage options, limitations, and alternative solutions.',
  },
];

const INTENT_RULES = [
  {
    intent: 'claim',
    keywords: ['claim', 'accident', 'incident', 'loss', 'damage', 'file claim', 'report claim'],
  },
  {
    intent: 'universal-applicant',
    keywords: [
      'full legal name',
      'date of birth',
      'dob',
      'ssn',
      'social security',
      'marital status',
      'gender',
      'preferred language',
      'prior carrier',
      'loss history',
      'insurance score',
      'electronic delivery',
      'soft credit',
    ],
  },
  {
    intent: 'document-request',
    keywords: [
      'proof of insurance',
      'certificate',
      'coi',
      'acord',
      'declarations',
      'endorsement copy',
      'lender',
      'mortgagee',
      'additional insured',
      'waiver of subrogation',
      'primary and non-contributory',
      'p&nc',
    ],
  },
  {
    intent: 'policy-change',
    keywords: [
      'policy change',
      'change policy',
      'update policy',
      'add driver',
      'remove driver',
      'add or remove a driver',
      'remove vehicle',
      'coverage limit',
      'deductible',
      'deductibles',
      'effective date',
      'mortgagee',
      'lienholder',
      'loss payee',
    ],
  },
  {
    intent: 'update-contact',
    keywords: ['update contact', 'new address', 'phone number changed', 'email changed', 'mailing address', 'legal name', 'policy number'],
  },
  {
    intent: 'consultation',
    keywords: ['consultation', 'quote', 'compare carriers', 'new policy', 'best coverage', 'recommend', 'coverage type', 'preferred contact', 'timeline'],
  },
  {
    intent: 'call-request',
    keywords: ['call me', 'call back', 'callback', 'talk to agent', 'speak with agent', 'preferred day', 'preferred time', 'alternate time'],
  },
  {
    intent: 'hours-contact',
    keywords: ['hours', 'open', 'office hours', 'contact', 'phone', 'email', 'address', 'location'],
  },
  {
    intent: 'coverage-info',
    keywords: ['coverage', 'insurance types', 'workers comp', 'commercial auto', 'umbrella', 'cyber', 'flood', 'personal', 'commercial'],
  },
];

const FALLBACK_FOLLOW_UP_QUESTIONS = [
  'Would you like me to guide you to the exact Paladin request form?',
  'Are you asking about personal insurance, business insurance, or both?',
  'Do you want a quick summary, or step-by-step next actions?',
];

const INTENT_FOLLOW_UPS = {
  claim: [
    'What was the date and time of the incident?',
    'What type of claim is it: auto, property, liability, workers compensation, or other?',
    'Do you already have any photos, reports, or carrier claim information to include?'
  ],
  'universal-applicant': [
    'Which product are you quoting so I can map the intake questions correctly?',
    'Do you want me to list the required fields only, or the optional fields too?',
    'Would you like a plain-language explanation of the SSN, loss history, and consent fields?'
  ],
  'document-request': [
    'Which document do you need: COI, declarations page, endorsement copy, or other?',
    'Do you need the request to show any special endorsements like Additional Insured, Waiver of Subrogation, or P&NC?',
    'Do you want to open the document request form now?'
  ],
  'policy-change': [
    'What change do you need most: driver, vehicle, property, endorsement, coverage limits, or cancellation?',
    'When should this change become effective?',
    'Do you need to add mortgagee or lienholder information for this request?'
  ],
  'update-contact': [
    'Which detail changed: phone, email, mailing address, legal name, or another item?',
    'Should the update apply to all policies or one specific policy?',
    'Do you have the policy number ready if this is for a single policy?'
  ],
  consultation: [
    'Are you looking for personal, commercial, or specialty coverage?',
    'Which coverage type or risk are you trying to protect?',
    'What is your preferred contact method and timeline?'
  ],
  'call-request': [
    'What day and time window work best for a callback?',
    'What topic should the agent prepare for before calling?',
    'Do you want to add an alternate time in case the first option is unavailable?'
  ],
  'hours-contact': [
    'Do you want phone, email, or office location details?',
    'Do you want me to open the contact section for you?',
    'Would you like to request a callback instead?'
  ],
  'coverage-info': [
    'Do you want help with one line of coverage or a full bundle review?',
    'Is this for business operations, personal assets, or both?',
    'Would you like to open a consultation request now?'
  ],
};

const INTENT_ACTIONS = {
  claim: [
    { id: 'claim-form', label: 'Open claim report form', type: 'open-request', requestId: 'claim' },
    { id: 'request-call', label: 'Request an agent callback', type: 'open-request', requestId: 'call' },
  ],
  'universal-applicant': [
    { id: 'consult-form', label: 'Open consultation request form', type: 'open-request', requestId: 'consultation' },
    { id: 'contact-form', label: 'Open contact message form', type: 'jump-contact' },
  ],
  'document-request': [
    { id: 'doc-form', label: 'Open document request form', type: 'open-request', requestId: 'documents' },
    { id: 'call-office', label: 'Call Paladin office', type: 'call-phone', value: '8056926900' },
  ],
  'policy-change': [
    { id: 'policy-form', label: 'Open policy change form', type: 'open-request', requestId: 'policy-change' },
    { id: 'update-info-form', label: 'Open update contact info form', type: 'open-request', requestId: 'update-info' },
  ],
  'update-contact': [
    { id: 'update-form', label: 'Open update contact info form', type: 'open-request', requestId: 'update-info' },
    { id: 'contact-form', label: 'Open contact message form', type: 'jump-contact' },
  ],
  consultation: [
    { id: 'consult-form', label: 'Open consultation request form', type: 'open-request', requestId: 'consultation' },
    { id: 'request-call', label: 'Request an agent callback', type: 'open-request', requestId: 'call' },
  ],
  'call-request': [
    { id: 'call-form', label: 'Open call request form', type: 'open-request', requestId: 'call' },
    { id: 'call-office', label: 'Call Paladin office', type: 'call-phone', value: '8056926900' },
  ],
  'hours-contact': [
    { id: 'open-contact', label: 'Open contact details', type: 'jump-contact' },
    { id: 'email-office', label: 'Email support', type: 'email', value: 'support@paladinbusinessservices.net' },
  ],
  'coverage-info': [
    { id: 'consult-form', label: 'Open consultation request form', type: 'open-request', requestId: 'consultation' },
    { id: 'request-call', label: 'Request an agent callback', type: 'open-request', requestId: 'call' },
  ],
  general: [
    { id: 'contact-form', label: 'Open contact form', type: 'jump-contact' },
    { id: 'request-call', label: 'Request an agent callback', type: 'open-request', requestId: 'call' },
  ],
};

const normalizeMessage = (message) =>
  String(message || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const detectIntent = (message) => {
  const normalized = normalizeMessage(message);

  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.intent;
    }
  }

  return 'general';
};

const getFollowUpQuestions = (intent) => INTENT_FOLLOW_UPS[intent] || FALLBACK_FOLLOW_UP_QUESTIONS;

const getSuggestedActions = (intent) => INTENT_ACTIONS[intent] || INTENT_ACTIONS.general;

const buildLocalReply = (message) => {
  const normalized = normalizeMessage(message);

  if (!normalized) {
    return 'I did not catch that. Please try asking your question again.';
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(normalized)) {
    return 'Hello. I can help with office hours, contact details, claims, policy changes, consultations, and coverage options.';
  }

  if (/\b(thanks|thank you|appreciate it)\b/.test(normalized)) {
    return 'You are welcome. If you need anything else, ask me about claims, policy changes, or coverage options.';
  }

  const sampleMatch = SAMPLE_QUESTION_RESPONSES.find((item) =>
    item.patterns.some((pattern) => pattern.test(message))
  );

  if (sampleMatch) {
    return sampleMatch.reply;
  }

  const detectedIntent = detectIntent(message);
  if (INTENT_LOCAL_RESPONSES[detectedIntent]) {
    return INTENT_LOCAL_RESPONSES[detectedIntent];
  }

  const matchedTopic = KNOWN_TOPICS.find((topic) =>
    topic.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (matchedTopic) {
    return matchedTopic.reply;
  }

  return 'I can help with claims, policy changes, document requests, consultations, callbacks, coverage options, and office contact details. Tell me your goal and I will give you exact next steps.';
};

const INTENT_LOCAL_RESPONSES = {
  claim:
    'To report a claim, start the claim form on the website or call 805-692-6900. Share your policy number, date/time of loss, what happened, and any documents or photos. A licensed agent will follow up shortly and guide you through the carrier-specific process.',
  'universal-applicant':
    'The universal applicant section collects client information used across several insurance products. This includes full legal name, date of birth, contact phone and email, mailing address, SSN last 4, employment history, prior coverage details, loss history, and consent to credit checks and e-delivery.',
  'document-request':
    'You can request proof of insurance or other documents through the website. Include your name, email, the document type, certificate holder details, and any special wording or endorsements needed. If urgent, call 805-692-6900 and ask for certificate support.',
  'policy-change':
    'Policy changes can be requested through the website or by phone. Provide your name, email, policy type, the requested change, the effective date, and complete details so the carrier can review quickly. Changes may require underwriting approval.',
  'update-contact':
    'You can update email, phone, address, or legal name through the website form. Specify whether the change applies to all active policies or one specific policy. If updating one policy, include the policy number.',
  consultation:
    'You can request a personalized consultation through the website. Provide your name, email, phone, coverage type of interest, preferred contact method, timeline, and any special notes. An agent will review your request and reach out.',
  'call-request':
    'You can request a callback through the website call request form. Provide your name, phone number, preferred day and time, alternate times if needed, and the topic for discussion. This helps the agent prepare before calling.',
  'hours-contact':
    'Paladin office hours are Monday to Friday, 9:00 AM to 5:00 PM. You can call 805-692-6900, email support@paladinbusinessservices.net, or mail to 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003. After hours, email and get a response the next business day.',
  'coverage-info':
    'Paladin offers many coverage types: homeowners, renters, condo, umbrella, commercial auto, general liability, workers compensation, flood, earthquake, cyber liability, and specialty products. We can help you find the right coverage for your situation.',
};

const extractText = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  if (!Array.isArray(payload.output)) {
    return '';
  }

  const texts = [];
  payload.output.forEach((item) => {
    if (!Array.isArray(item.content)) {
      return;
    }

    item.content.forEach((content) => {
      if (typeof content.text === 'string' && content.text.trim()) {
        texts.push(content.text.trim());
      }
    });
  });

  return texts.join('\n').trim();
};
exports.synthesizeVoice = async (req, res) => {
  const text = String(req.body?.text || '').trim();
  const voiceId = String(req.body?.voiceId || ELEVENLABS_DEFAULT_VOICE_ID).trim();

  if (!text) {
    return res.status(400).json({ error: 'A non-empty text value is required.' });
  }

  if (!voiceId) {
    return res.status(400).json({ error: 'A valid ElevenLabs voice ID is required.' });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(503).json({ error: 'ElevenLabs API key is not configured on the backend.' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${ELEVENLABS_API_BASE_URL}/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_DEFAULT_MODEL_ID,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const providerError = await response.text();
      return res.status(response.status).json({
        error: 'ElevenLabs synthesis failed.',
        details: providerError,
      });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audioBuffer);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'ElevenLabs synthesis timed out.' });
    }

    return res.status(502).json({
      error: 'Failed to synthesize audio with ElevenLabs.',
      details: error?.message || 'Unknown upstream error.',
    });
  }
};

exports.askVoiceAssistant = async (req, res) => {
  const userMessage = req.body?.message;

  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'A non-empty message is required.' });
  }

  const detectedIntent = detectIntent(userMessage);
  const followUpQuestions = getFollowUpQuestions(detectedIntent);
  const suggestedActions = getSuggestedActions(detectedIntent);

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({
      reply: buildLocalReply(userMessage),
      source: 'knowledge-base',
      detectedIntent,
      followUpQuestions,
      suggestedActions,
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        instructions: `${SYSTEM_PROMPT}\n\nUse the following Paladin facts when answering site-specific questions:\n${PALADIN_FACTS}\n\nUse the following request-form guidance when the user asks about a specific form:\n${REQUEST_FORM_GUIDE}\n\nUse the following universal applicant guidance for shared quote intake questions:\n${UNIVERSAL_APPLICANT_GUIDE}`,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: userMessage }],
          },
        ],
        max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorPayload = await response.text();
      return res.status(200).json({
        reply: buildLocalReply(userMessage),
        source: 'knowledge-base',
        detectedIntent,
        followUpQuestions,
        suggestedActions,
        warning: 'Voice AI provider returned an error, so a local answer was used instead.',
        details: errorPayload,
      });
    }

    const payload = await response.json();
    const reply = extractText(payload) || buildLocalReply(userMessage);
    return res.status(200).json({
      reply,
      source: 'openai',
      detectedIntent,
      followUpQuestions,
      suggestedActions,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(200).json({
        reply: buildLocalReply(userMessage),
        source: 'knowledge-base',
        detectedIntent,
        followUpQuestions,
        suggestedActions,
        warning: 'Voice AI request timed out, so a local answer was used instead.',
      });
    }

    return res.status(200).json({
      reply: buildLocalReply(userMessage),
      source: 'knowledge-base',
      detectedIntent,
      followUpQuestions,
      suggestedActions,
      warning: 'Failed to process voice AI request, so a local answer was used instead.',
    });
  }
};
