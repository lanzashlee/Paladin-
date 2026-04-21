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
  {
    patterns: [/\breport\b.*\bclaim\b/i, /\bfile\b.*\bclaim\b/i],
    reply:
      'To report a claim, start the claim form on the website or call 805-692-6900. Share your policy number, date/time of loss, what happened, and any photos or documents you have. A licensed Paladin agent will follow up and walk you through carrier-specific next steps.',
  },
  {
    patterns: [/\boffice hours\b/i, /\bcontact details\b/i],
    reply:
      'Paladin office hours are Monday to Friday, 9:00 AM to 5:00 PM, and the office is closed on weekends. You can reach us at 805-692-6900, email support@paladinbusinessservices.net, or visit 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003. If it is after hours, send an email and an agent will respond the next business day.',
  },
  {
    patterns: [/\bproof of insurance\b/i, /\bcoi\b/i, /\bcertificate of insurance\b/i],
    reply:
      'For proof of insurance or a COI, submit a document request through the website. Include certificate holder details, job/property address, and any required endorsements like Waiver of Subrogation or Additional Insured. If urgent, call 805-692-6900 and ask for certificate processing support.',
  },
  {
    patterns: [/\brequest\b.*\bcallback\b/i, /\bcall me\b/i, /\bcall back\b/i],
    reply:
      'To request a callback, use the call request form and include your preferred phone number, best time window, and topic. This helps the assigned agent prepare before calling you. You can also call 805-692-6900 during business hours for immediate routing.',
  },
  {
    patterns: [/\bchange\b.*\bpolicy\b/i, /\bpolicy change\b/i, /\badd\b.*\bdriver\b/i, /\bremove\b.*\bdriver\b/i],
    reply:
      'Policy changes can be requested online or by phone. For updates like adding/removing a driver, vehicle, address, or coverage limits, provide the policy number, effective date, and complete change details so the carrier can process quickly. Some changes may require underwriting review before final approval.',
  },
  {
    patterns: [/\blicensed\b.*\bstates\b/i, /\bwhat states\b/i],
    reply:
      'Paladin is licensed in CA, AZ, ID, IL, IN, NV, NC, OH, and TX. If your risk or business operates across multiple states, we can help you identify the best next step and route you to the right policy workflow.',
  },
  {
    patterns: [/\bafter hours\b.*\bclaim\b/i],
    reply:
      'Yes, you can submit claim details after hours through the website. If there is immediate danger or emergency damage, contact emergency services first, then notify your carrier emergency line if available. Paladin will review your submission and follow up on the next business day.',
  },
  {
    patterns: [/\bhow quickly\b.*\bfollow up\b.*\bclaim\b/i],
    reply:
      'Paladin aims to follow up on new claim reports as soon as possible during business hours. Response time can vary by claim severity and carrier requirements, but submitting complete details and supporting documents usually speeds up handling.',
  },
  {
    patterns: [/\bclaim types\b/i, /\bwhat claim\b.*\bhelp\b/i],
    reply:
      'We can assist with common claim categories such as auto, home, commercial property, general liability, workers compensation, and related coverage claims. The exact process depends on your carrier and policy terms, and we can guide you through the right channel.',
  },
  {
    patterns: [/\bbundle\b.*\bcoverages\b/i],
    reply:
      'Yes, Paladin can review bundled options for business coverages such as general liability, property, commercial auto, workers compensation, and umbrella depending on eligibility. Bundling may improve pricing and simplify renewals, but final terms come from the carrier quote.',
  },
  {
    patterns: [/\bcompare\b.*\bcarriers\b/i],
    reply:
      'As an independent agency, Paladin can compare multiple carrier options for your risk profile. We look at coverage fit, limits, deductibles, exclusions, pricing, and service factors so you can make an informed choice instead of selecting only by premium.',
  },
  {
    patterns: [/\bumbrella\b.*\bgeneral liability\b/i, /\bgeneral liability\b.*\bumbrella\b/i],
    reply:
      'General liability is primary coverage for common third-party bodily injury and property damage claims. Umbrella coverage typically sits on top of eligible underlying policies and adds extra liability limits once those base limits are exhausted. It is designed to provide broader financial protection for larger claims.',
  },
];

const INTENT_LOCAL_RESPONSES = {
  claim:
    'You can report a claim through the website or by calling 805-692-6900. To avoid delays, include your policy number, incident date, location, what happened, and any photos/documents. A licensed Paladin agent will follow up and guide you through carrier-specific requirements.',
  'document-request':
    'You can request documents like COI, declarations, or endorsement copies using the document request form. Please include certificate holder details, delivery deadline, and any endorsement wording needed. If this is urgent, call 805-692-6900 during office hours for priority support.',
  'policy-change':
    'For policy changes, submit the request online or call the office with your policy number and requested effective date. Common updates include driver/vehicle changes, endorsements, contact updates, and limit changes. Some requests may require underwriting review before they are finalized.',
  'update-contact':
    'You can update contact information by submitting the update form with your policy number and the new details. Include phone, email, mailing address, or insured item changes as needed. Keeping this current helps avoid delays on claims, billing, and renewal notices.',
  consultation:
    'Paladin can provide a personalized consultation to compare carriers and recommend coverage options for your needs. Share your state, business/personal profile, target limits, and current pain points so the quote comparison is more accurate. You can start with a consultation request or callback request.',
  'call-request':
    'Use the call request form and include your best callback window, phone number, and topic so the agent is prepared. If you need immediate help during business hours, call 805-692-6900 directly. For after-hours requests, submit the form and the team will respond on the next business day.',
  'hours-contact':
    'Paladin office hours are Monday to Friday, 9:00 AM to 5:00 PM. Contact options are phone 805-692-6900, fax 805-830-1680, and email support@paladinbusinessservices.net. The office address is 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003.',
  'coverage-info':
    'Paladin supports a broad mix of coverage lines including general liability, commercial auto, workers compensation, cyber, flood, umbrella, home, auto, life, and health. The best structure depends on your risk profile, state, and contract requirements. A consultation can help you choose limits and endorsements that fit your goals.',
};

const INTENT_RULES = [
  {
    intent: 'claim',
    keywords: ['claim', 'accident', 'incident', 'loss', 'damage', 'file claim', 'report claim'],
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
    ],
  },
  {
    intent: 'update-contact',
    keywords: ['update contact', 'new address', 'phone number changed', 'email changed', 'mailing address'],
  },
  {
    intent: 'consultation',
    keywords: ['consultation', 'quote', 'compare carriers', 'new policy', 'best coverage', 'recommend'],
  },
  {
    intent: 'call-request',
    keywords: ['call me', 'call back', 'callback', 'talk to agent', 'speak with agent'],
  },
  {
    intent: 'hours-contact',
    keywords: ['hours', 'open', 'office hours', 'contact', 'phone', 'email', 'address', 'location'],
  },
  {
    intent: 'coverage-info',
    keywords: ['coverage', 'insurance types', 'workers comp', 'commercial auto', 'umbrella', 'cyber', 'flood'],
  },
];

const FALLBACK_FOLLOW_UP_QUESTIONS = [
  'Would you like me to guide you to the exact Paladin request form?',
  'Are you asking about personal insurance, business insurance, or both?',
  'Do you want a quick summary, or step-by-step next actions?',
];

const INTENT_FOLLOW_UPS = {
  claim: [
    'What was the date of the incident?',
    'What type of claim is it: auto, home, liability, property, or other?',
    'Do you want to open the claim report form now?'
  ],
  'document-request': [
    'Which document do you need: COI, declarations page, endorsement copy, or other?',
    'Do you need any special endorsements listed, like Waiver of Subrogation or P&NC?',
    'Do you want to open the document request form now?'
  ],
  'policy-change': [
    'What change do you need most: driver, vehicle, property, endorsement, or coverage limits?',
    'When should this change become effective?',
    'Do you want to open the policy change form now?'
  ],
  'update-contact': [
    'Which detail changed: phone, email, mailing address, or insured item details?',
    'Do you have your policy number available?',
    'Do you want to open the update contact info form now?'
  ],
  consultation: [
    'Are you looking for personal, commercial, or specialty coverage?',
    'Which state is the policy for: CA, AZ, ID, IL, IN, NV, NC, OH, or TX?',
    'Do you want to open the consultation request form now?'
  ],
  'call-request': [
    'What day and time window work best for a callback?',
    'What topic should the agent prepare for before calling?',
    'Do you want to open the call request form now?'
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
        instructions: `${SYSTEM_PROMPT}\n\nUse the following Paladin facts when answering site-specific questions:\n${PALADIN_FACTS}`,
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
