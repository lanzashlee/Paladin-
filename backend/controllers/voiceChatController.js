const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT =
  'You are Paladin Professional Insurance Solutions voice assistant. Keep answers clear, concise, and friendly. If asked for policy-specific legal advice, suggest contacting a licensed agent.';

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

const normalizeMessage = (message) =>
  String(message || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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

exports.askVoiceAssistant = async (req, res) => {
  const userMessage = req.body?.message;

  if (typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'A non-empty message is required.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ reply: buildLocalReply(userMessage), source: 'knowledge-base' });
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
        warning: 'Voice AI provider returned an error, so a local answer was used instead.',
        details: errorPayload,
      });
    }

    const payload = await response.json();
    const reply = extractText(payload) || buildLocalReply(userMessage);
    return res.status(200).json({ reply, source: 'openai' });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(200).json({
        reply: buildLocalReply(userMessage),
        source: 'knowledge-base',
        warning: 'Voice AI request timed out, so a local answer was used instead.',
      });
    }

    return res.status(200).json({
      reply: buildLocalReply(userMessage),
      source: 'knowledge-base',
      warning: 'Failed to process voice AI request, so a local answer was used instead.',
    });
  }
};
