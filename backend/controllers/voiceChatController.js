const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_MAX_OUTPUT_TOKENS = Number.isFinite(Number(process.env.OPENAI_MAX_OUTPUT_TOKENS))
  ? Math.max(200, Number(process.env.OPENAI_MAX_OUTPUT_TOKENS))
  : 700;
const ELEVENLABS_API_BASE_URL = process.env.ELEVENLABS_API_URL || 'https://api.elevenlabs.io/v1';
const ELEVENLABS_DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const ELEVENLABS_DEFAULT_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

const SYSTEM_PROMPT =
  'You are Paladin Professional Insurance Solutions voice assistant. Keep answers clear, concise, and friendly. Prioritize practical next steps based on Paladin workflows (consultation request, document request, policy change, update contact info, claim report, and call request). Ask one short clarifying question when details are missing. If asked for policy-specific legal advice, suggest contacting a licensed agent. For documents and COIs, answer the way a licensed agent would speak to a client on the phone: natural, respectful, and specific—usually two to four sentences unless they ask for a deep dive. Do not sound like a glossary or internal ops manual; do not repeat the same checklist when they ask a different document question.';

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
- Document request (general): full name, email, document type, named insured as it should read on the document, policy numbers if known, coverages and limits to show, operations description when general liability applies, certificate holder block (legal name and full address), any contract-required endorsements, and how soon you need it.
- Document request — Certificate of Insurance (COI): specify each certificate holder’s legal name, full mailing address, and relationship to you (landlord, client, vendor, etc.). List every endorsement the contract requires (Additional Insured, Waiver of Subrogation, Primary and Non-Contributory, notice, etc.). Paste or summarize the exact insurance article from the contract when possible.
- Document request — Declarations page: identify the policy line (home, auto, commercial package, etc.), policy number, and policy period you need summarized. Say whether the recipient is you, a lender, or a third party so the right dec page is pulled.
- Document request — Endorsement copies: name the endorsement by form number or title if you know it (for example Additional Insured, Waiver of Subrogation). If you only have contract language, attach or quote the requirement so the team matches the correct endorsement.
- Document request — Deadlines: include the date and time you must deliver the document, time zone, and preferred delivery method (email address or fax number). Note closings, job start dates, or vendor gates so requests can be triaged correctly.
- Policy change: full name, email, policy type, effective date, requested change types, notes, and mortgagee / lienholder details when needed.
- Update contact info: full name, email, requested update types, new contact or address details, what policies to apply changes to, notes, and policy number when a single policy is selected.
- Claim report: full name, email, policy number, phone, incident date and time, claim type, incident location, other-party details, police report information, estimated loss, carrier contact status, carrier claim number, and additional notes.
- Call request: full name, phone, optional email, policy number, preferred day, preferred time, alternate date / time, topic, other topic details, and notes.
`;

const DOCUMENT_OPENAI_RULES = `
How to answer document questions (voice / client tone):
- Sound like a Paladin team member helping a customer: conversational English, short paragraphs, concrete next steps.
- Match one question at a time. A question about "which documents" should explain choices in plain language, not a colon-separated catalog of definitions.
- If they only ask about certificate holder lines, talk about names, addresses, and where to send the COI—not the full endorsement lecture unless they asked for it.
`;

const CONSULTATION_OPENAI_RULES = `
How to answer consultation questions (voice / client tone):
- Keep each answer specific to the exact consultation question, in plain client-friendly language.
- Prefer two to four concise sentences with concrete next steps instead of long generic intake lists.
- If the user asks about timeline or follow-up, include realistic expectations and who contacts them.
`;

const POLICY_OPENAI_RULES = `
How to answer policy change questions (voice / client tone):
- Answer the exact question: intake fields vs drivers/vehicles vs mortgagee vs limits vs effective date vs cancellation vs how to submit.
- Keep it client-facing: short, clear, and specific—avoid repeating the same full form checklist on every policy-change answer.
- When timing matters, mention carrier processing and that some changes need underwriting approval.
`;

const UPDATE_INFO_OPENAI_RULES = `
How to answer update-info questions (voice / client tone):
- Keep each answer focused on the exact update question: required fields, which contact items can be changed, one-policy vs all-policies, policy number use, legal name changes, and other account updates.
- Use concise client-friendly language with practical next steps instead of repeating one generic update checklist.
- For legal name or sensitive changes, mention supporting documents and verification expectations.
`;

const CLAIMS_OPENAI_RULES = `
How to answer claims questions (voice / client tone):
- Answer the exact claim question directly: prep details, after-hours submission, follow-up timing, supported claim types, police-report/estimated-loss fields, and form eligibility by claim type.
- Keep responses practical and specific (two to four concise sentences) instead of repeating one full claim checklist every time.
- If urgency or legal sensitivity appears, advise immediate reporting and set realistic expectations for carrier/agent follow-up.
`;

const CALL_REQUEST_OPENAI_RULES = `
How to answer call-request questions (voice / client tone):
- Keep each callback answer specific to the exact question: required fields, best day/time selection, alternate slot use, topic wording, policy number need, and after-hours request behavior.
- Use concise client-friendly language with practical next steps; do not repeat the same generic callback checklist for every question.
- When timing is asked, mention business-hour follow-up expectations clearly.
`;

const COVERAGE_OPENAI_RULES = `
How to answer coverage questions (voice / client tone):
- Answer the exact coverage question asked (line of business, personal vs commercial, bundle strategy, required vs optional coverages, or next step to compare options).
- Keep responses concise and practical, usually two to four sentences, with plain client-friendly wording.
- When helpful, suggest a consultation request to compare carriers and limits for the client's specific risk.
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
      'I would start with Document request on the site and choose Certificate of Insurance. The usual holdups are a legal name spelled wrong or missing pages from their contract—fixing those up front saves you a day of back-and-forth.',
  },
  {
    keywords: ['document request', 'coi', 'declarations page', 'endorsement copy', 'additional insured', 'waiver of subrogation', 'p&nc'],
    reply:
      'If they want actual policy pages instead of a one-page COI, we order declarations or endorsements from the carrier using your policy number and dates. Tell us what their email or PDF called it, and we will match the right pull.',
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
  // DOCUMENTS QUESTIONS (paraphrases—exact widget lines use DOCUMENT_WIDGET_REPLY_BY_KEY first)
  {
    patterns: [/how do i request.*(proof of insurance|coi|certificate)/i],
    reply:
      'I would use Document request on our site, choose Certificate of Insurance, and send one request per company that needs proof. If they change their requirements later, add a note on the same request thread if you can so we keep a single clear version.',
  },
  {
    patterns: [/what do i need for a document request/i, /document request or coi/i],
    reply:
      'I would have your contact info handy, any policy number you know, the other party’s legal name as their paperwork shows it, and what project or loan it is for. A photo of their insurance page helps us match endorsements without playing telephone.',
  },
  {
    patterns: [/which document types can i request/i, /document types can i request/i],
    reply:
      'We can pull what most people need: a COI for whoever is asking for proof, declaration pages straight from the carrier, endorsement pages by name, lender-style property evidence, auto ID cards, loss runs, or something else if you describe what they sent you.',
  },
  {
    patterns: [/what should i include for additional insured/i, /additional insured or endorsement wording/i, /include.*endorsement wording/i],
    reply:
      'I would paste the exact contract language for each ask—additional insured, waiver, primary and non-contributory are separate items even when they sit in one paragraph. Number them if they are bundled so underwriting issues the right endorsement the first time.',
  },
  {
    patterns: [/certificate holder details.*document request/i, /certificate holder details.*needed/i, /what certificate holder/i],
    reply:
      'They need the party’s full legal name, street address with suite, city, state, ZIP, and the email where they want the COI. Use an attention line only if their sample shows one, and please double-check the inbox—we will not guess it from the company name.',
  },
  {
    patterns: [/declarations or endorsement copies/i, /request declarations.*endorsement/i, /can i request declarations/i],
    reply:
      'Yes. You would pick declarations page or endorsement copy in Document request instead of a COI. We pull PDFs from the carrier, so policy number and dates matter; a screenshot of the endorsement title helps if you are not sure of the form number.',
  },
  {
    patterns: [/deadline information.*document request/i, /what deadline.*document request/i, /deadline.*include on a document/i],
    reply:
      'I would give a real date and time with your time zone, not just “ASAP.” If their office closes on Eastern while you are on Pacific, say that. If several people need files in a certain order, tell us who is first so uploads match their portal.',
  },
  {
    patterns: [/how long.*(coi|certificate|document)/i, /turnaround.*(coi|certificate|document)/i, /same day.*(coi|certificate)/i, /rush.*(coi|certificate)/i],
    reply:
      'Most clean COI requests come back in about a business day or two once the policy data matches what you typed. Brand-new endorsements can take longer because underwriting has to add them first—saying “urgent” does not shorten that carrier step.',
  },
  {
    patterns: [/difference.*(coi|certificate).*(dec|declarations)/i, /coi.*vs.*declarations/i, /declarations page.*certificate/i],
    reply:
      'Think of the COI as the quick “yes, they are insured at these limits” sheet. The declarations page is the fuller snapshot from the carrier with schedules and dollars. Banks often want the second even when the first looks fine.',
  },
  {
    patterns: [/mortgagee.*(certificate|coi|document)/i, /loss payee.*(certificate|coi|document)/i, /lender.*(certificate|coi|proof)/i],
    reply:
      'For a bank I would use their mortgagee or loss-payee wording exactly as their sample shows—not the same wording you would use for a general contractor’s additional insured line. Send their sample if you have it; it prevents a rejection loop.',
  },
  {
    patterns: [/what.*certificate.*insurance/i, /explain.*coi/i, /coi.*definition/i],
    reply:
      'A COI is simply the carrier’s one-page proof for a third party: who is insured, for what dates, and at what limits. People attach it to leases, bids, and vendor packets when someone else needs to see coverage at a glance.',
  },
  {
    patterns: [/what.*declarations.*page/i, /declare.*page.*definition/i],
    reply:
      'The declarations page is the carrier’s summary of your actual policy for that term—named insured, dates, coverages, limits, deductibles, and premium. It is what lenders or lawyers often ask for when a COI alone is not enough detail.',
  },
  {
    patterns: [
      /what is an additional insured/i,
      /what is additional insured\b/i,
      /what does additional insured mean/i,
      /define additional insured/i,
      /^explain additional insured\.?$/i,
    ],
    reply:
      'Additional insured means someone else—like your landlord or a general contractor—gets named on your liability coverage so their interest is protected under your policy when the contract requires it. It has to be set up as an endorsement, not just typed on a COI.',
  },
  {
    patterns: [/waiver.*subrogation/i, /what.*waiver.*subrogation/i],
    reply:
      'Waiver of subrogation means, in plain terms, your carrier agrees not to go after another party you agreed not to sue—common in construction jobs and commercial leases. It is its own endorsement, separate from additional insured.',
  },
  {
    patterns: [/primary.*non.*contributory.*p.*nc/i, /what.*p.*nc.*endorsement/i],
    reply:
      'Primary and non-contributory is contract language where your policy is supposed to pay first and not ask the other party’s insurance to share the bill. We attach it only when the contract actually calls for it.',
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
    'Who is asking—landlord, general contractor, bank, or someone else—and did they send you a sample PDF?',
    'Do they only want a one-page COI, or full policy pages from the carrier?',
    'Would you like me to open the document request form for you?'
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

/** Normalizes user text so widget / spoken questions map to one canonical key. */
const normalizeQuestionKey = (message) =>
  String(message || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Exact widget / spoken document questions—answered the way we would speak to a client: brief, specific, human. */
const DOCUMENT_WIDGET_REPLY_BY_KEY = new Map([
  [
    'how do i request proof of insurance or a coi',
    'I would go to our website, open Document request—not the general contact form—and choose Certificate of Insurance so it goes straight to certificate staff. Use one request per company that needs proof, and if they change their paperwork later, reply on the same email thread or note your earlier request number so we do not issue two conflicting COIs. We almost always send it back by email unless their sample shows a fax line.',
  ],
  [
    'what do i need for a document request or coi',
    'I would have your name and best email, any policy number you already know, and the other company’s legal name exactly as their contract or portal shows it—not a nickname. Add what job, loan, or permit it ties to. If you can snap their insurance requirements page, send that too; it cuts most of the follow-up calls. We can go line by line on certificate holder next if you need that.',
  ],
  [
    'which document types can i request',
    'We can usually pull whatever they are asking for: a COI when they just need proof for a landlord or GC, declaration pages when they want the fuller policy snapshot with numbers, endorsement pages when they cite a specific form, lender property packages when a bank is involved, auto ID cards for DMV-style asks, loss runs when someone needs claim history from the carrier, or “other” if none of those labels fit—just tell us in one sentence what they showed you.',
  ],
  [
    'what should i include for additional insured or endorsement wording',
    'I would copy the exact words from their contract for each separate ask—additional insured, waiver of subrogation, and primary and non-contributory are three different things even when they are in one paragraph. Paste the sentence that names who must be covered and in whose favor. If it is all run together, number each requirement 1, 2, 3 so we match the right endorsement the first time. Saying “standard wording” does not tell us which form to attach.',
  ],
  [
    'what certificate holder details are needed on the document request form',
    'Whoever is listed as certificate holder should be typed the way their letterhead reads: full legal name, street and suite, city, state, ZIP, and the one email address where they want the COI delivered. Add “attention” only if their sample COI shows it. If they gave you a vendor upload link, put that in the notes—we should not hide URLs inside the address block.',
  ],
  [
    'can i request declarations or endorsement copies too',
    'Yes. Same Document request flow—just pick declarations page or endorsement copy instead of a COI. Those come from the carrier as PDFs, so your policy number and term dates matter. If you are not sure of the endorsement name, a quick photo of the top of that page from your policy packet is enough for us to request the right one. If they need both a COI and a dec, tell us which one their portal wants uploaded first.',
  ],
  [
    'what deadline information should i include on a document request',
    'Tell us the real date and clock time you need it, with your time zone—for example Wednesday at four p.m. Pacific—not only “ASAP.” If their office runs on Eastern time for cutoffs, mention that so we do not miss their window. If several parties need files in a strict order, list who is first, second, and third. If the job starts before renewal, say that so we can line up expiration language with their contract.',
  ],
]);

/** Phrases that should receive the same detailed reply as the canonical widget question. */
const DOCUMENT_WIDGET_KEY_ALIASES = {
  'how do i request a coi': 'how do i request proof of insurance or a coi',
  'how do i request proof of insurance': 'how do i request proof of insurance or a coi',
  'how to request proof of insurance or a coi': 'how do i request proof of insurance or a coi',
  'what do i need for coi': 'what do i need for a document request or coi',
  'what do i need for a document request': 'what do i need for a document request or coi',
  'what documents can i request': 'which document types can i request',
  'what types of documents can i request': 'which document types can i request',
  'can i get declarations or endorsement copies': 'can i request declarations or endorsement copies too',
  'can i request a declarations page': 'can i request declarations or endorsement copies too',
  'what deadlines should i put on a document request': 'what deadline information should i include on a document request',
};

const matchDocumentWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (DOCUMENT_WIDGET_REPLY_BY_KEY.has(key)) {
    return DOCUMENT_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = DOCUMENT_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && DOCUMENT_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return DOCUMENT_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact consultation widget questions with specific, non-repetitive client-facing replies. */
const CONSULTATION_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what information do i need for a consultation request',
    'For the consultation form, I would prepare your basic contact details, the type of policy you are shopping for, and a short note about your current situation so the agent does not start blind. If you already have coverage, having your current declaration page nearby helps us compare limits and gaps faster. The more specific your notes, the less back-and-forth after submission.',
  ],
  [
    'is the consultation request for personal or commercial coverage',
    'It can be either. If your need is for home, auto, renters, or umbrella, select personal; if it is for business operations, employees, vehicles, contracts, or landlord requirements, select commercial. If you need both, mention both in notes so we assign the right agent from the start.',
  ],
  [
    'what coverage type should i select on the consultation form',
    'Choose the closest main coverage you want to fix first—for example general liability, workers comp, commercial auto, homeowners, or umbrella. If you are unsure, pick the nearest option and describe your risk in one sentence in notes, like "new contractor needing COI-ready coverage" or "reviewing current home and auto limits." We can refine the full package during the call.',
  ],
  [
    'can i request a consultation and a callback',
    'Yes, and that is actually a good combo when timing is tight. Submit the consultation so we get your full context, then add a callback request with your preferred day and time window so an agent can reach you directly. This helps us prepare before calling instead of doing a cold call with no intake details.',
  ],
  [
    'what timeline should i include on the consultation request form',
    'Include the real deadline that matters: renewal date, closing date, contract start, payroll date, or move-in date. If there is no hard date, tell us whether this is urgent this week or general planning this month. A clear timeline lets us prioritize and set the right expectations for quotes and follow-up.',
  ],
  [
    'who will follow up after i submit a consultation request',
    'A licensed Paladin agent follows up after reviewing your request details. Usually the first touch is by email or phone during business hours, then the same agent guides next steps and quote options. If your request is specialized, they may loop in the right market specialist, but you still get a primary contact.',
  ],
  [
    'how do i request a consultation with an agent',
    'Open the consultation request form on the website, enter your contact details, pick your main coverage need, and add a short summary of what you want help with. If you have a deadline, include it in the notes. Once submitted, a licensed agent will review and contact you for next steps.',
  ],
]);

const CONSULTATION_WIDGET_KEY_ALIASES = {
  'what info do i need for a consultation request': 'what information do i need for a consultation request',
  'is consultation for personal or commercial': 'is the consultation request for personal or commercial coverage',
  'what coverage should i select on consultation form': 'what coverage type should i select on the consultation form',
  'can i request consultation and callback': 'can i request a consultation and a callback',
  'what timeline should i put on consultation request': 'what timeline should i include on the consultation request form',
  'who follows up after consultation request': 'who will follow up after i submit a consultation request',
  'how do i request consultation with an agent': 'how do i request a consultation with an agent',
};

const matchConsultationWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (CONSULTATION_WIDGET_REPLY_BY_KEY.has(key)) {
    return CONSULTATION_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = CONSULTATION_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && CONSULTATION_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return CONSULTATION_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact policy change widget questions—specific client-facing replies (Popular + Policy pack). */
const POLICY_WIDGET_REPLY_BY_KEY = new Map([
  [
    'how do i make a policy change request',
    'I would use the Policy change request form on our website, enter how to reach you, name the policy line you are changing, and describe the change in plain language. Add the date you want it to take effect if you have one, and attach or mention any paperwork the carrier will care about. If it is time-sensitive, note that in the form and you can also call 805-692-6900 during business hours.',
  ],
  [
    'what information is needed for a policy change request',
    'The form needs your contact info, which policy this is for—type and policy number if you have it—and a clear description of what you want changed. Include the effective date you want when it matters, and mortgagee or lienholder details only when the change touches a loan or collateral. One focused request per change keeps the carrier from bouncing it for missing context.',
  ],
  [
    'how do i add or remove a driver or vehicle',
    'For a driver add, I would list their full legal name, date of birth, license number, and a straight summary of tickets, accidents, or claims—carriers use that for rating. For a vehicle add, VIN, garaging address, and use of vehicle matter most. To remove a driver, confirm they will not drive any car on the policy; removing a vehicle means it should be off coverage entirely. Simple changes often process in a business day or two; bigger underwriting asks can take longer.',
  ],
  [
    'when should i include mortgagee or lienholder information',
    'Include mortgagee or lienholder details when a bank or finance company has an interest in the property or vehicle you are changing—think new loan, refinance, payoff, or when the lender requires an update to their loss-payee wording. You usually do not need that block for a routine driver change on an owned auto with no loan. If you have a lender letter or escrow instruction, mention it in notes.',
  ],
  [
    'can i change coverage limits or deductibles on the form',
    'Yes. Tell us the coverage you mean—liability, comp, collision, property limit, and so on—and what you want it changed to, plus when you want it effective. Limits and deductibles change premium and sometimes need carrier approval, so a clear before-and-after in your note speeds review. If you are not sure what limit fits, say what you are trying to protect and we can advise on the call.',
  ],
  [
    'what effective date should i use for a policy change',
    'Use the date the change should actually apply—today if it already happened, a future date if you are planning ahead, or your renewal if you are aligning to a term change. Some edits cannot be backdated, and a few need underwriting time before they are fully in force, so “as soon as possible” in the notes helps us sequence with the carrier. If a lender tied the change to a closing, put that date in writing.',
  ],
  [
    'can i cancel a policy through the policy change request',
    'You can start there by selecting cancellation or describing cancel in the notes with the date you want coverage to end. Many carriers still want a signed cancellation request or a quick confirmation call for compliance, so an agent may reach out to verify before it is final. If you are replacing coverage elsewhere, say the replacement effective date so you do not create a gap.',
  ],
]);

const POLICY_WIDGET_KEY_ALIASES = {
  'what info is needed for a policy change request': 'what information is needed for a policy change request',
  'what information do i need for a policy change request': 'what information is needed for a policy change request',
  'how to make a policy change request': 'how do i make a policy change request',
  'how do i request a policy change': 'how do i make a policy change request',
  'how do i add a driver or remove a driver': 'how do i add or remove a driver or vehicle',
  'how do i add or remove a vehicle': 'how do i add or remove a driver or vehicle',
  'when do i include mortgagee or lienholder information': 'when should i include mortgagee or lienholder information',
  'can i change limits or deductibles on the policy change form': 'can i change coverage limits or deductibles on the form',
  'what date should i use for a policy change': 'what effective date should i use for a policy change',
  'can i cancel my policy on the policy change form': 'can i cancel a policy through the policy change request',
};

const matchPolicyWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (POLICY_WIDGET_REPLY_BY_KEY.has(key)) {
    return POLICY_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = POLICY_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && POLICY_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return POLICY_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact update-info widget questions—specific client-facing replies (Popular + Update pack). */
const UPDATE_WIDGET_REPLY_BY_KEY = new Map([
  [
    'how do i update my contact information',
    'Use the Update contact info form on the website, select what changed, and enter the new details exactly as you want them on your records. If this applies to only one policy, include that policy number so we do not update everything by mistake. Once submitted, our team reviews and routes it for carrier record updates as needed.',
  ],
  [
    'what do i need to update my contact info',
    'You just need your current account identity details plus the new information you want on file. Tell us what changed—email, phone, address, legal name, or other—then confirm whether it should apply to one policy or all active policies. If it is one policy only, include the policy number.',
  ],
  [
    'can i change my email phone or mailing address',
    'Yes, those are exactly what this form is for. Enter the new email, phone, or mailing address in full and note whether the change is temporary or permanent if that matters. We update your servicing records so future notices and policy documents go to the right place.',
  ],
  [
    'can i update one policy or all policies at once',
    'You can do either. If you choose all policies, we apply the same update across your active account records; if you choose one, include the policy number so it stays limited to that policy only. That is especially useful when personal and business policies should keep different contact details.',
  ],
  [
    'when should i include my policy number on an update request',
    'Include the policy number whenever the update is only for one policy, when you have multiple active policies, or when the change could affect billing or lender notices. It helps us avoid applying the update to the wrong policy. If everything should change across the board, policy number is still helpful but not always required.',
  ],
  [
    'can i use the form to update a legal name',
    'Yes, but legal name changes usually need supporting documents like a marriage certificate, divorce decree, or court order. Submit the new legal name exactly as it should appear and mention what document you can provide. For security and carrier compliance, we may follow up to verify before finalizing.',
  ],
  [
    'what details should i include for other account updates',
    'For any “other” update, describe exactly what needs to change, why it is needed, and where it should apply (one policy or all). Add any effective date and policy number if relevant. A short, specific note like “update billing contact for commercial auto only” gets processed much faster than a broad request.',
  ],
]);

const UPDATE_WIDGET_KEY_ALIASES = {
  'what do i need to update contact info': 'what do i need to update my contact info',
  'how do i update contact information': 'how do i update my contact information',
  'can i change my email phone or address': 'can i change my email phone or mailing address',
  'can i update one policy or all policies': 'can i update one policy or all policies at once',
  'when do i include my policy number on an update request': 'when should i include my policy number on an update request',
  'can i update legal name on the form': 'can i use the form to update a legal name',
  'what should i include for other account updates': 'what details should i include for other account updates',
};

const matchUpdateWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (UPDATE_WIDGET_REPLY_BY_KEY.has(key)) {
    return UPDATE_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = UPDATE_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && UPDATE_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return UPDATE_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact claims widget questions—specific client-facing replies (Popular + Claims pack). */
const CLAIMS_WIDGET_REPLY_BY_KEY = new Map([
  [
    'how do i report a claim with paladin',
    'Start with the claim report form on our website or call 805-692-6900 if you need live help during business hours. Share what happened, when and where it happened, and your policy number if available so we can route it correctly. Once submitted, a licensed agent reviews the intake and helps guide the carrier process.',
  ],
  [
    'what details should i prepare before reporting a claim',
    'Before filing, have your policy number, incident date and time, location, and a clear summary of what happened. If available, add photos, video, witness contact info, and any police or incident report number. For property or injury claims, include a rough estimate of damage or treatment details so triage is faster.',
  ],
  [
    'can i submit a claim after business hours',
    'Yes. You can submit the claim form any time, including after hours, so your incident is timestamped right away. If it is an emergency involving injuries, active danger, or major loss, contact emergency services first, then submit the claim and notify us. Our team follows up on the next business cycle for servicing and carrier coordination.',
  ],
  [
    'how quickly will a licensed agent follow up on a claim',
    'For most submissions, a licensed agent or claims support member follows up within one business day, often sooner during office hours. Complex losses may need carrier assignment steps before full direction is given, but we still acknowledge your report and set next expectations. If you have a hard deadline, note it in the claim details.',
  ],
  [
    'what claim types can paladin help with',
    'We help with common personal and commercial claim categories, including auto, property, liability, and workers compensation-related incidents, depending on your policy. If you are unsure which category fits, pick the closest one and describe the event in plain language. We can reclassify it during review to match carrier reporting requirements.',
  ],
  [
    'what should i include for police report or estimated loss details',
    'If police were involved, include the report number, agency name, and any responding officer details you have. For estimated loss, a good-faith range is fine at first—what looks damaged, likely repair or replacement scope, and whether business operations are interrupted. You can update amounts later as invoices or adjuster findings come in.',
  ],
  [
    'can i report an auto property or liability claim through the form',
    'Yes, that form is intended for auto, property, and liability incidents. Choose the closest claim type, submit the facts you have now, and attach supporting files if available. If multiple claim types are involved in one event, note that in your description so we open the right handling path.',
  ],
]);

const CLAIMS_WIDGET_KEY_ALIASES = {
  'how do i report a claim': 'how do i report a claim with paladin',
  'what should i prepare before reporting a claim': 'what details should i prepare before reporting a claim',
  'can i file a claim after business hours': 'can i submit a claim after business hours',
  'how quickly will an agent follow up on a claim': 'how quickly will a licensed agent follow up on a claim',
  'what claim types can you help with': 'what claim types can paladin help with',
  'what should i include for police report details': 'what should i include for police report or estimated loss details',
  'what should i include for estimated loss details': 'what should i include for police report or estimated loss details',
  'can i report auto property or liability claim through the form': 'can i report an auto property or liability claim through the form',
};

const matchClaimsWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (CLAIMS_WIDGET_REPLY_BY_KEY.has(key)) {
    return CLAIMS_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = CLAIMS_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && CLAIMS_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return CLAIMS_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact callback widget questions—specific client-facing replies (Popular + Call pack). */
const CALL_WIDGET_REPLY_BY_KEY = new Map([
  [
    'how do i request a callback from an agent',
    'Use the callback request form on the website, enter your best phone number, and add the topic so the agent can prepare before calling. Include your preferred day and time window plus an alternate slot if you have one. That gives us the best chance to reach you on the first attempt.',
  ],
  [
    'what information do i need for a callback request',
    'For a callback request, share your name, best phone number, and what you want to discuss. Add your preferred day and time, and include an alternate time if your schedule is tight. A policy number helps if the call is about an existing policy, but it is not required for general questions.',
  ],
  [
    'what day and time should i choose for a callback',
    'Pick the day/time you are most likely to answer live, ideally with a two- to three-hour window instead of a single minute. If your issue has a deadline, mention that in notes so we can prioritize. Choosing business-hour windows usually results in faster contact.',
  ],
  [
    'can i add an alternate time if the first one is unavailable',
    'Yes, and you should. Add a second day/time window so the agent has a fallback without restarting scheduling. This reduces missed calls and helps us keep your request moving the same day when possible.',
  ],
  [
    'what topic should i include on the call request form',
    'Use a short, specific topic like “policy change for new vehicle,” “COI needed for landlord,” or “quote review before renewal.” A clear topic helps route your request to the right licensed agent and shortens discovery time on the call. If there is a deadline, include it in the same note.',
  ],
  [
    'do i need a policy number for a callback request',
    'Not always. If you are asking about an existing policy, include the policy number so we can pull your file before the call. If the call is for a new quote or general guidance, you can submit without it and we can collect details during follow-up.',
  ],
  [
    'can i request a callback after business hours',
    'Yes, you can submit the callback form anytime, including after hours. Requests submitted after business hours are queued and followed up on the next business cycle. If the matter is urgent and within office hours, calling 805-692-6900 is still the fastest path.',
  ],
]);

const CALL_WIDGET_KEY_ALIASES = {
  'how do i request a callback': 'how do i request a callback from an agent',
  'what do i need for a callback request': 'what information do i need for a callback request',
  'what day and time should i pick for a callback': 'what day and time should i choose for a callback',
  'can i add alternate time if first one is unavailable': 'can i add an alternate time if the first one is unavailable',
  'what topic should i put on the call request form': 'what topic should i include on the call request form',
  'do i need policy number for callback request': 'do i need a policy number for a callback request',
  'can i request callback after business hours': 'can i request a callback after business hours',
};

const matchCallWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (CALL_WIDGET_REPLY_BY_KEY.has(key)) {
    return CALL_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = CALL_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && CALL_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return CALL_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact coverage widget questions—specific client-facing replies. */
const COVERAGE_WIDGET_REPLY_BY_KEY = new Map([
  [
    'do you offer workers compensation and commercial auto',
    'Yes. We handle both workers compensation and commercial auto, and we can review them together so payroll, driver, and vehicle exposures are aligned in one strategy. If you are bidding jobs, we can also help prepare COI-ready coverage language based on contract requirements.',
  ],
  [
    'can paladin bundle multiple business coverages',
    'Yes, we can structure a bundle review across lines like general liability, commercial auto, workers compensation, property, umbrella, and cyber when eligible. Bundling can simplify renewals and sometimes improve pricing, but final terms depend on carrier appetite and underwriting. We usually start with your most urgent requirement, then layer the rest.',
  ],
  [
    'how can paladin help compare multiple carriers',
    'As an independent agency, we can shop multiple carriers and compare premiums, limits, deductibles, exclusions, and endorsement options side by side. The goal is not just lowest price, but the best fit for your risk and contract obligations. A consultation request gives us the details needed to build a meaningful comparison.',
  ],
  [
    'what is the difference between umbrella and general liability',
    'General liability is your primary policy for common third-party injury and property-damage claims tied to operations. Umbrella sits above underlying liability policies and adds extra limit once base policy limits are exhausted. In short: general liability handles first-dollar covered layers, umbrella extends protection for larger losses.',
  ],
  [
    'what coverage types does paladin offer',
    'We can help with both personal and business lines, including home, renters, auto, umbrella, general liability, workers compensation, commercial auto, flood, earthquake, cyber, and other specialty programs. The best fit depends on your assets, contracts, and risk exposure. If you want, I can help you narrow this to one starting line first.',
  ],
  [
    'should i choose personal or commercial coverage',
    'Choose personal when the risk is tied to your household, personal vehicles, or personal liability. Choose commercial when the risk comes from business operations, employees, client contracts, or business-owned property and vehicles. If both apply, we can build a combined plan and phase priorities by deadline.',
  ],
  [
    'do i need one policy or a bundle of coverages',
    'That depends on your risk profile. Many clients start with one urgent policy, then bundle related coverages to close gaps and often improve pricing or carrier fit. A quick consultation helps identify which line should be first and which add-ons are worth adding now versus later.',
  ],
  [
    'is workers compensation required for my business',
    'In many cases, yes, once you have employees, but requirements vary by state, payroll setup, and worker classification. Even when not strictly required, some contracts and job sites still require proof before work can begin. Share your state and business type, and we can point you to the right next step.',
  ],
  [
    'what is umbrella insurance and when do i need it',
    'Umbrella adds extra liability protection above your underlying home, auto, or business liability limits. It is most useful when you have meaningful assets to protect, higher exposure activities, or contracts that expect stronger limits. Think of it as a safety layer for severe claims that exceed base policy limits.',
  ],
  [
    'is flood or earthquake included in a standard policy',
    'Usually not. Flood and earthquake are often separate policies or endorsements depending on property type and carrier structure. If your location has floodplain or seismic exposure, reviewing these separately is important so you do not assume a gap is already covered.',
  ],
  [
    'do small businesses need cyber liability coverage',
    'Often yes, because small businesses still face phishing, ransomware, payment fraud, and data exposure risks. Cyber coverage can help with response costs, recovery, legal obligations, and business interruption tied to an incident. It is usually more affordable to set up before a loss than after controls are questioned.',
  ],
]);

const COVERAGE_WIDGET_KEY_ALIASES = {
  'what coverages does paladin offer': 'what coverage types does paladin offer',
  'what insurance types does paladin offer': 'what coverage types does paladin offer',
  'personal or commercial coverage': 'should i choose personal or commercial coverage',
  'should i choose personal or business coverage': 'should i choose personal or commercial coverage',
  'should i get one policy or bundle': 'do i need one policy or a bundle of coverages',
  'do i need bundled coverage': 'do i need one policy or a bundle of coverages',
  'is workers comp required for my business': 'is workers compensation required for my business',
  'when do i need umbrella insurance': 'what is umbrella insurance and when do i need it',
  'is flood included in standard policy': 'is flood or earthquake included in a standard policy',
  'is earthquake included in standard policy': 'is flood or earthquake included in a standard policy',
  'do i need cyber liability for a small business': 'do small businesses need cyber liability coverage',
};

const matchCoverageWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (COVERAGE_WIDGET_REPLY_BY_KEY.has(key)) {
    return COVERAGE_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = COVERAGE_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && COVERAGE_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return COVERAGE_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact HO3 widget questions—specific client-facing replies. */
const HO3_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what property address do i need to enter for homeowners insurance',
    'Enter the physical street address of the home being insured, including unit number if applicable. Use your mailing address only if it is the same property, otherwise keep those separate to avoid carrier mismatch. This address drives rating, inspections, and hazard validation.',
  ],
  [
    'how does the county affect my homeowners insurance',
    'County affects underwriting because wildfire zones, brush exposure, fire protection class, and some regional catastrophe models vary by location. It can influence eligibility, pricing, and which carriers are willing to quote. That is why we ask for exact county instead of only city name.',
  ],
  [
    'what happens if i dont know the year my property was built',
    'If the exact year is unknown, give your best verified estimate and note that it is approximate so we can start quoting. Carriers may still require confirmation from county records or appraisal documents before binding. The build year impacts replacement cost assumptions and some eligibility rules.',
  ],
  [
    'do i need to provide the number of stories for my house',
    'Yes, number of stories is required because it affects replacement cost modeling, roof and water-loss exposure, and sometimes underwriting appetite. A one-story versus multi-story home can rate differently even with the same square footage. Enter the actual above-ground stories for best accuracy.',
  ],
  [
    'is a pool covered under my homeowners insurance',
    'A pool can be covered, but it usually changes liability risk and may require specific safety controls like fencing or self-latching gates. Some carriers may add conditions, exclusions, or higher premiums depending on pool type and features. Listing it up front avoids surprises at underwriting or claim time.',
  ],
]);

const HO3_WIDGET_KEY_ALIASES = {
  'what property address should i enter for homeowners insurance': 'what property address do i need to enter for homeowners insurance',
  'how does county affect homeowners insurance': 'how does the county affect my homeowners insurance',
  'what if i dont know the year my property was built': 'what happens if i dont know the year my property was built',
  'do i need to provide number of stories for my house': 'do i need to provide the number of stories for my house',
  'is pool covered under homeowners insurance': 'is a pool covered under my homeowners insurance',
};

const matchHo3WidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (HO3_WIDGET_REPLY_BY_KEY.has(key)) {
    return HO3_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = HO3_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && HO3_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return HO3_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact HO6 widget questions—specific client-facing replies. */
const HO6_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what is the difference between a condo unit and a house when it comes to insurance',
    'Condo insurance (HO6) usually covers your interior unit improvements, personal property, and personal liability, while the HOA master policy typically covers shared structure areas and common elements. Homeowners insurance for a house covers the full dwelling structure plus personal property and liability. The key is where building responsibility starts and ends between you and the HOA.',
  ],
  [
    'why do you ask for the construction type of the building',
    'Construction type helps carriers estimate fire, water, and catastrophic loss exposure for the building as a whole. It affects eligibility, pricing, and sometimes available deductibles or endorsements. Even though you insure your unit, your risk is still tied to the building\'s construction profile.',
  ],
  [
    'how does the number of stories affect condo insurance',
    'Story count can influence risk modeling for water damage, fire access, evacuation complexity, and claim severity in multi-unit structures. Higher-rise and low-rise buildings can rate differently depending on carrier guidelines. That is why we ask for building stories even for unit-level coverage.',
  ],
  [
    'do i need to provide a description of any renovations or upgrades to my condo',
    'Yes, renovations are important because upgraded flooring, cabinetry, kitchens, baths, and built-ins can increase your interior replacement value. If upgrades are not listed, coverage may be set too low for a loss. A short description helps us align dwelling/interior limits more accurately.',
  ],
  [
    'is liability coverage included in condo insurance',
    'Yes, HO6 policies typically include personal liability coverage for injuries or property damage you may be legally responsible for. The included limit may not always be enough, so higher liability limits or umbrella can be added when needed. We can recommend a limit based on your exposure profile.',
  ],
]);

const HO6_WIDGET_KEY_ALIASES = {
  'difference between condo and house insurance': 'what is the difference between a condo unit and a house when it comes to insurance',
  'why ask for construction type of building': 'why do you ask for the construction type of the building',
  'how do building stories affect condo insurance': 'how does the number of stories affect condo insurance',
  'do i need to describe condo renovations or upgrades': 'do i need to provide a description of any renovations or upgrades to my condo',
  'is liability included in condo insurance': 'is liability coverage included in condo insurance',
};

const matchHo6WidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (HO6_WIDGET_REPLY_BY_KEY.has(key)) {
    return HO6_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = HO6_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && HO6_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return HO6_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact HO4 widget questions—specific client-facing replies. */
const HO4_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what is renters insurance and what does it cover',
    'Renters insurance usually covers your personal belongings, personal liability, and additional living expenses if a covered loss makes your unit temporarily unlivable. It does not insure the building itself—that part is your landlord\'s policy. Think of HO4 as protection for your stuff, your liability, and your temporary relocation costs.',
  ],
  [
    'how do i determine how much renters insurance i need',
    'Start by estimating replacement cost for your belongings, not yard-sale value—clothes, electronics, furniture, kitchen items, and high-value pieces. Then choose a personal property limit that realistically rebuilds your contents after a total loss. We can also review sub-limits for items like jewelry or collectibles and add scheduled coverage if needed.',
  ],
  [
    'what does liability coverage in renters insurance cover',
    'Liability coverage helps if you are legally responsible for injury to someone else or damage to someone else\'s property, and it can also include legal defense costs for covered claims. Common examples are a guest injury in your unit or accidental water damage to a neighbor\'s unit. It does not replace your own personal property coverage.',
  ],
  [
    'how does the type of rental unit affect my insurance',
    'Unit type can affect rating and underwriting because apartment, condo rental, single-family rental, and multi-unit buildings carry different risk profiles. Factors like shared walls, floor level, building age, and security features can influence premium and carrier options. Accurate unit details help avoid quote-to-bind changes.',
  ],
  [
    'do i need renters insurance if my landlord has insurance',
    'Yes, in most cases. Your landlord\'s policy usually protects the building structure and their liability, not your personal belongings or your personal liability exposure. Renters insurance fills that gap and is often required by lease agreements.',
  ],
]);

const HO4_WIDGET_KEY_ALIASES = {
  'what is renters insurance and what is covered': 'what is renters insurance and what does it cover',
  'how much renters insurance do i need': 'how do i determine how much renters insurance i need',
  'what does renters liability coverage cover': 'what does liability coverage in renters insurance cover',
  'how does rental unit type affect insurance': 'how does the type of rental unit affect my insurance',
  'do i need renters insurance if landlord has insurance': 'do i need renters insurance if my landlord has insurance',
};

const matchHo4WidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (HO4_WIDGET_REPLY_BY_KEY.has(key)) {
    return HO4_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = HO4_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && HO4_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return HO4_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact commercial auto widget questions—specific client-facing replies. */
const COMMERCIAL_AUTO_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what is commercial auto insurance and who needs it',
    'Commercial auto insurance covers vehicles used for business operations, including liability, physical damage options, and business-use exposures that personal auto policies often exclude. It is typically needed for company-owned vehicles and can also apply to certain employee or owner business-use scenarios. If the vehicle supports business income, commercial coverage is usually the safer path.',
  ],
  [
    'how do you determine the premium for commercial auto insurance',
    'Premium is based on driver profiles, vehicle type and value, garaging location, radius of use, industry operations, claim history, and selected limits/deductibles. Higher-risk routes, heavier vehicles, and broader coverage choices generally raise cost. Clean driving history and accurate business-use details help produce better quotes.',
  ],
  [
    'is there a difference in coverage for personal vs commercial auto insurance',
    'Yes. Personal auto is designed for private household use, while commercial auto is designed for business activity and often provides broader business liability options and higher limits. Business use under a personal policy can create claim disputes, so matching policy type to actual use is important.',
  ],
  [
    'why do i need to list all drivers for my commercial vehicles',
    'Carriers require all regular or potential business drivers so they can properly evaluate risk and price the policy. Undisclosed drivers can lead to underwriting issues, premium changes, or claim complications later. Listing everyone up front helps keep coverage accurate and enforceable.',
  ],
  [
    'do i need to provide information on past accidents for commercial auto insurance',
    'Yes, prior accidents and violations are key rating factors for commercial auto and can affect eligibility, premium, and carrier selection. Include clear loss details so the quote is realistic from the start. Accurate history reduces last-minute underwriting surprises before binding.',
  ],
]);

const COMMERCIAL_AUTO_WIDGET_KEY_ALIASES = {
  'what is commercial auto insurance who needs it': 'what is commercial auto insurance and who needs it',
  'how is commercial auto premium determined': 'how do you determine the premium for commercial auto insurance',
  'difference between personal and commercial auto insurance': 'is there a difference in coverage for personal vs commercial auto insurance',
  'why list all drivers for commercial vehicles': 'why do i need to list all drivers for my commercial vehicles',
  'do i need to provide past accidents for commercial auto insurance': 'do i need to provide information on past accidents for commercial auto insurance',
};

const matchCommercialAutoWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (COMMERCIAL_AUTO_WIDGET_REPLY_BY_KEY.has(key)) {
    return COMMERCIAL_AUTO_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = COMMERCIAL_AUTO_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && COMMERCIAL_AUTO_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return COMMERCIAL_AUTO_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact general liability widget questions—specific client-facing replies. */
const GENERAL_LIABILITY_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what does general liability insurance cover',
    'General liability helps protect your business from third-party claims for bodily injury, property damage, and certain personal and advertising injury exposures tied to your operations. It is not an all-risk policy, so exclusions and limits still apply based on your carrier form. We match wording to how you actually work so coverage intent lines up with your contracts.',
  ],
  [
    'why do i need to describe my business operations',
    'Carriers price and underwrite GL based on what you do day to day—trades, customer contact, premises, products, and subcontracted work. A clear operations description helps avoid wrong class codes and surprise gaps at claim time. One or two concrete sentences usually beats a vague industry label.',
  ],
  [
    'how does my business revenue impact the cost of general liability insurance',
    'Revenue is often used as a proxy for exposure: more sales and activity can mean more customer interaction, job sites, or product flow. Higher revenue can increase premium, but it is only one factor alongside operations type, claims history, limits, and territory. Accurate revenue helps the quote reflect real risk instead of guesswork.',
  ],
  [
    'are subcontractors covered under my general liability policy',
    'Usually not automatically the way people assume. Subcontractors typically need their own insurance, and your contract may require you to verify it. Your GL may respond to your liability for certain acts, but that is different from treating subs as insureds without endorsements. Tell us how you use subs and we can align COI expectations with your policy.',
  ],
  [
    'what is the difference between per occurrence and aggregate limits',
    'Per occurrence is the most the policy pays for any one covered claim or loss event. The aggregate is the total the policy pays for all covered claims during the policy term, combined. Think of occurrence as a single-claim ceiling and aggregate as the yearly bucket across multiple claims.',
  ],
]);

const GENERAL_LIABILITY_WIDGET_KEY_ALIASES = {
  'what does gl insurance cover': 'what does general liability insurance cover',
  'why describe my business operations on gl': 'why do i need to describe my business operations',
  'why do i need to describe business operations': 'why do i need to describe my business operations',
  'how does revenue affect general liability premium': 'how does my business revenue impact the cost of general liability insurance',
  'are subs covered under my gl policy': 'are subcontractors covered under my general liability policy',
  'are subcontractors covered under general liability': 'are subcontractors covered under my general liability policy',
  'per occurrence vs aggregate limits': 'what is the difference between per occurrence and aggregate limits',
  'what is per occurrence vs aggregate': 'what is the difference between per occurrence and aggregate limits',
};

const matchGeneralLiabilityWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (GENERAL_LIABILITY_WIDGET_REPLY_BY_KEY.has(key)) {
    return GENERAL_LIABILITY_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = GENERAL_LIABILITY_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && GENERAL_LIABILITY_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return GENERAL_LIABILITY_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact workers compensation widget questions—specific client-facing replies. */
const WORKERS_COMP_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what is workers compensation insurance and who needs it',
    'Workers compensation helps cover medical costs and wage benefits for employees with work-related injuries or illness, and it can protect your business from certain related lawsuits depending on state rules. Who must carry it varies by state, payroll, employee count, and industry. If you have W-2 staff or hire in trades, we almost always review comp early in the conversation.',
  ],
  [
    'why do i need to list each employees job classification for workers compensation',
    'Class codes describe the actual work employees perform, and carriers use them to match exposure to the right rate. Wrong classes can mean wrong premium up front or problems at audit. Listing each role honestly keeps quotes defensible and renewals smoother.',
  ],
  [
    'how is my workers compensation premium calculated',
    'Premium is usually driven by payroll assigned to class codes, your experience modification if you have one, state rules, and claim history. Estimated payroll is common at quote time, then carriers reconcile with actual payroll on audit. Accurate payroll splits by job duty matter more than a single round number.',
  ],
  [
    'what happens if my business has a history of workers compensation claims',
    'Prior claims can affect your experience mod, underwriting appetite, and pricing, but they do not automatically make you uninsurable. Carriers look at frequency, severity, and what controls you have in place now. Being transparent helps us place you with markets that understand your industry.',
  ],
  [
    'do i need to carry workers compensation insurance if i only have a few employees',
    'Sometimes yes, even with a small team, depending on your state and how workers are classified. A few employees in higher-hazard work can still trigger requirements or contract demands before you can step on a job site. Tell us your state and headcount and we can map requirement versus best practice.',
  ],
]);

const WORKERS_COMP_WIDGET_KEY_ALIASES = {
  'what is workers comp and who needs it': 'what is workers compensation insurance and who needs it',
  'who needs workers compensation insurance': 'what is workers compensation insurance and who needs it',
  'why list job classification for workers comp': 'why do i need to list each employees job classification for workers compensation',
  'why do i need employee class codes for workers comp': 'why do i need to list each employees job classification for workers compensation',
  'how is workers comp premium calculated': 'how is my workers compensation premium calculated',
  'how are workers compensation premiums calculated': 'how is my workers compensation premium calculated',
  'what if i have workers comp claims history': 'what happens if my business has a history of workers compensation claims',
  'do small businesses need workers comp': 'do i need to carry workers compensation insurance if i only have a few employees',
  'do i need workers comp with only a few employees': 'do i need to carry workers compensation insurance if i only have a few employees',
};

const matchWorkersCompWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (WORKERS_COMP_WIDGET_REPLY_BY_KEY.has(key)) {
    return WORKERS_COMP_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = WORKERS_COMP_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && WORKERS_COMP_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return WORKERS_COMP_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact earthquake widget questions—specific client-facing replies. */
const EARTHQUAKE_WIDGET_REPLY_BY_KEY = new Map([
  [
    'is earthquake coverage included in my homeowners insurance',
    'Standard homeowners policies usually do not include earthquake damage as a covered peril. In high-seismic areas you typically add a separate earthquake policy or endorsement. If you are unsure what you bought, your declarations page is the quickest place to confirm.',
  ],
  [
    'how do i determine if i need earthquake insurance',
    'Start with how close you are to fault activity, your home\'s age and construction, and how much equity or replacement cost you would need to rebuild. Also check lender requirements and your comfort with paying repair costs out of pocket. We can help you weigh deductible options versus premium once we know your address and goals.',
  ],
  [
    'what factors affect the cost of earthquake insurance',
    'Premium is driven by location and distance to seismic risk, home age, construction type, square footage, foundation, and the limits and deductible you choose. Older homes and higher coverage limits usually cost more. Shopping multiple carriers matters because earthquake appetite varies by region.',
  ],
  [
    'is there a deductible for earthquake insurance',
    'Yes, earthquake policies almost always include a deductible, often as a percentage of the coverage limit rather than a flat dollar amount like some home policies. The deductible you pick trades off premium versus out-of-pocket after a quake. We can explain how that math looks for your quote options.',
  ],
  [
    'does earthquake insurance cover flood damage',
    'No. Earthquake coverage responds to shaking and related earth movement, not rising water or storm surge. Flood damage generally needs a flood policy or applicable endorsement. If both risks worry you, we usually review earthquake and flood as separate protections.',
  ],
]);

const EARTHQUAKE_WIDGET_KEY_ALIASES = {
  'is earthquake included in homeowners insurance': 'is earthquake coverage included in my homeowners insurance',
  'do i need earthquake insurance': 'how do i determine if i need earthquake insurance',
  'should i get earthquake insurance': 'how do i determine if i need earthquake insurance',
  'what affects earthquake insurance cost': 'what factors affect the cost of earthquake insurance',
  'why is earthquake insurance expensive': 'what factors affect the cost of earthquake insurance',
  'earthquake insurance deductible': 'is there a deductible for earthquake insurance',
  'does earthquake cover flooding': 'does earthquake insurance cover flood damage',
};

const matchEarthquakeWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (EARTHQUAKE_WIDGET_REPLY_BY_KEY.has(key)) {
    return EARTHQUAKE_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = EARTHQUAKE_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && EARTHQUAKE_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return EARTHQUAKE_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact flood widget questions—specific client-facing replies. */
const FLOOD_WIDGET_REPLY_BY_KEY = new Map([
  [
    'why do i need flood insurance if my property isnt near water',
    'Flood risk is not limited to waterfront property. Heavy rain, drainage overload, storm runoff, and local infrastructure failures can cause flood losses far from lakes or rivers. Standard homeowners policies usually exclude flood, so separate flood coverage fills that gap.',
  ],
  [
    'how do i know if my property is in a flood zone',
    'The usual starting point is your FEMA flood zone designation plus local floodplain data and lender requirements. We can check mapping details by property address and then compare zone-based options. Even lower-risk zones can still have meaningful flood exposure depending on local conditions.',
  ],
  [
    'is flood insurance required by law',
    'It is not universally required by law for every property, but lenders often require it when a mortgaged property is in a designated high-risk flood zone. Outside those zones, it may still be strongly recommended based on your risk tolerance and replacement cost. Requirement and best practice are not always the same.',
  ],
  [
    'what does flood insurance cover',
    'Flood insurance can cover building damage from flooding and, depending on policy type and selections, certain contents losses. Coverage scope, limits, waiting periods, and exclusions differ between NFIP and private flood options. We review both so you understand what is and is not included before binding.',
  ],
  [
    'can i increase the coverage limit on my flood insurance policy',
    'Often yes, subject to program and carrier limits. NFIP has set maximums, while private flood markets may offer higher limits or broader structures depending on property details. If you need higher protection, we can compare available carriers and layering options.',
  ],
]);

const FLOOD_WIDGET_KEY_ALIASES = {
  'why do i need flood insurance if my property is not near water':
    'why do i need flood insurance if my property isnt near water',
  'why need flood insurance if not near water': 'why do i need flood insurance if my property isnt near water',
  'how can i tell if my property is in a flood zone': 'how do i know if my property is in a flood zone',
  'is flood insurance legally required': 'is flood insurance required by law',
  'what does a flood policy cover': 'what does flood insurance cover',
  'can i increase flood coverage limits': 'can i increase the coverage limit on my flood insurance policy',
};

const matchFloodWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (FLOOD_WIDGET_REPLY_BY_KEY.has(key)) {
    return FLOOD_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = FLOOD_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && FLOOD_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return FLOOD_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

/** Exact umbrella widget questions—specific client-facing replies. */
const UMBRELLA_WIDGET_REPLY_BY_KEY = new Map([
  [
    'what is umbrella insurance and who needs it',
    'Umbrella insurance adds extra liability protection above your underlying home, auto, or business liability policies once those limits are exhausted. It is useful for households or businesses with meaningful assets, higher public exposure, or contract-driven limit requirements. Think of it as a backup layer for severe claims.',
  ],
  [
    'does umbrella insurance cover everything',
    'No, umbrella does not cover everything. It extends liability protection for covered exposures, but policy terms still include exclusions, conditions, and required underlying coverage. We review those details so you know where umbrella helps and where a different policy is needed.',
  ],
  [
    'why do i need umbrella insurance if i already have liability coverage',
    'Primary liability limits can be exhausted by a serious claim faster than most people expect. Umbrella provides an additional layer above those base limits to reduce personal or business out-of-pocket exposure. It is often one of the most cost-efficient ways to increase total liability protection.',
  ],
  [
    'how does the umbrella policy limit affect my coverage',
    'The umbrella limit is the maximum extra liability amount available after your underlying policy limits are used up. Higher umbrella limits generally provide stronger protection for catastrophic claims but may cost more. We usually align limits with asset profile, risk level, and contractual requirements.',
  ],
  [
    'are there any exclusions with umbrella insurance',
    'Yes, umbrella policies have exclusions and conditions that vary by carrier and form. Some exposures may need separate coverage or endorsements, and underlying policy requirements must stay in force. Reviewing exclusions up front prevents false assumptions at claim time.',
  ],
]);

const UMBRELLA_WIDGET_KEY_ALIASES = {
  'what is umbrella insurance and who needs it?': 'what is umbrella insurance and who needs it',
  'who needs umbrella insurance': 'what is umbrella insurance and who needs it',
  'does umbrella cover everything': 'does umbrella insurance cover everything',
  'why do i need umbrella if i already have liability': 'why do i need umbrella insurance if i already have liability coverage',
  'how does umbrella limit affect coverage': 'how does the umbrella policy limit affect my coverage',
  'umbrella insurance exclusions': 'are there any exclusions with umbrella insurance',
};

const matchUmbrellaWidgetExactReply = (message) => {
  const key = normalizeQuestionKey(message);
  if (UMBRELLA_WIDGET_REPLY_BY_KEY.has(key)) {
    return UMBRELLA_WIDGET_REPLY_BY_KEY.get(key);
  }
  const aliasTarget = UMBRELLA_WIDGET_KEY_ALIASES[key];
  if (aliasTarget && UMBRELLA_WIDGET_REPLY_BY_KEY.has(aliasTarget)) {
    return UMBRELLA_WIDGET_REPLY_BY_KEY.get(aliasTarget);
  }
  return null;
};

const matchAnyWidgetExactReply = (message) =>
  matchConsultationWidgetExactReply(message) ||
  matchPolicyWidgetExactReply(message) ||
  matchUpdateWidgetExactReply(message) ||
  matchClaimsWidgetExactReply(message) ||
  matchCallWidgetExactReply(message) ||
  matchDocumentWidgetExactReply(message) ||
  matchCoverageWidgetExactReply(message) ||
  matchHo3WidgetExactReply(message) ||
  matchHo6WidgetExactReply(message) ||
  matchHo4WidgetExactReply(message) ||
  matchCommercialAutoWidgetExactReply(message) ||
  matchGeneralLiabilityWidgetExactReply(message) ||
  matchWorkersCompWidgetExactReply(message) ||
  matchEarthquakeWidgetExactReply(message) ||
  matchFloodWidgetExactReply(message) ||
  matchUmbrellaWidgetExactReply(message);

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

  const widgetConsultationReply = matchConsultationWidgetExactReply(message);
  if (widgetConsultationReply) {
    return widgetConsultationReply;
  }

  const widgetPolicyReply = matchPolicyWidgetExactReply(message);
  if (widgetPolicyReply) {
    return widgetPolicyReply;
  }

  const widgetUpdateReply = matchUpdateWidgetExactReply(message);
  if (widgetUpdateReply) {
    return widgetUpdateReply;
  }

  const widgetClaimsReply = matchClaimsWidgetExactReply(message);
  if (widgetClaimsReply) {
    return widgetClaimsReply;
  }

  const widgetCallReply = matchCallWidgetExactReply(message);
  if (widgetCallReply) {
    return widgetCallReply;
  }

  const widgetDocReply = matchDocumentWidgetExactReply(message);
  if (widgetDocReply) {
    return widgetDocReply;
  }

  const widgetCoverageReply = matchCoverageWidgetExactReply(message);
  if (widgetCoverageReply) {
    return widgetCoverageReply;
  }

  const widgetEarthquakeReply = matchEarthquakeWidgetExactReply(message);
  if (widgetEarthquakeReply) {
    return widgetEarthquakeReply;
  }

  const widgetFloodReply = matchFloodWidgetExactReply(message);
  if (widgetFloodReply) {
    return widgetFloodReply;
  }

  const widgetUmbrellaReply = matchUmbrellaWidgetExactReply(message);
  if (widgetUmbrellaReply) {
    return widgetUmbrellaReply;
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
    'Tell me whether you need proof for a third party, pages from your actual policy, or something a bank or DMV asked for—we route each a little differently. If you open Document request on the site and pick the type that matches their sample, we can move faster.',
  'policy-change':
    'Use the Policy change request form with your policy line, a plain-English description of the change, and the effective date you need. A licensed agent or service team member routes it to the carrier; some changes need extra underwriting time before they are final.',
  'update-contact':
    'Use the Update contact info form for email, phone, mailing address, legal name, or other account changes. Tell us if it applies to one policy or all policies, and include the policy number when it is policy-specific.',
  consultation:
    'You can request a consultation on the website and share what coverage you need plus your target timeline. A licensed agent reviews your request and follows up with tailored next steps based on your situation, not a one-size-fits-all script.',
  'call-request':
    'Use the callback request form with your best phone number, preferred time window, and topic so the agent can prepare before calling. Add an alternate slot when possible to reduce missed-call delays.',
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
  const exactWidgetReply = matchAnyWidgetExactReply(userMessage);

  if (exactWidgetReply) {
    return res.status(200).json({
      reply: exactWidgetReply,
      source: 'knowledge-base',
      detectedIntent,
      followUpQuestions,
      suggestedActions,
    });
  }

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
        instructions: `${SYSTEM_PROMPT}\n\nUse the following Paladin facts when answering site-specific questions:\n${PALADIN_FACTS}\n\nUse the following request-form guidance when the user asks about a specific form:\n${REQUEST_FORM_GUIDE}\n\n${DOCUMENT_OPENAI_RULES}\n\n${CONSULTATION_OPENAI_RULES}\n\n${POLICY_OPENAI_RULES}\n\n${UPDATE_INFO_OPENAI_RULES}\n\n${CLAIMS_OPENAI_RULES}\n\n${CALL_REQUEST_OPENAI_RULES}\n\n${COVERAGE_OPENAI_RULES}\n\nUse the following universal applicant guidance for shared quote intake questions:\n${UNIVERSAL_APPLICANT_GUIDE}`,
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
