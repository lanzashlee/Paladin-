const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
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
    keywords: ['policy change', 'change policy', 'update policy', 'add driver', 'remove vehicle', 'coverage limit'],
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

  const matchedTopic = KNOWN_TOPICS.find((topic) =>
    topic.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (matchedTopic) {
    return matchedTopic.reply;
  }

  return 'I can help with office hours, contact details, claims, policy changes, proof of insurance, consultations, and Paladin coverage options. Try asking about one of those topics.';
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

    return res.status(502).json({ error: 'Failed to synthesize audio with ElevenLabs.' });
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
        max_output_tokens: 280,
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
