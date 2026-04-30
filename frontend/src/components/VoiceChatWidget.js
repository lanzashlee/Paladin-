import React, { useEffect, useMemo, useRef, useState } from 'react';

const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (IS_LOCALHOST ? 'http://localhost:5000' : '');
const API_TARGET_LABEL = API_BASE_URL || 'same-origin /api';
const AGORA_DEFAULT_CHANNEL = process.env.REACT_APP_AGORA_CHANNEL || 'paladin-voice';
const USE_ELEVENLABS_TTS = process.env.REACT_APP_USE_ELEVENLABS_TTS !== 'false';
const ENABLE_AGORA = process.env.REACT_APP_ENABLE_AGORA === 'true';
const VOICE_CHAT_STORAGE_KEY = 'paladin.voice-chat-widget.v1';
const INITIAL_ASSISTANT_MESSAGE = {
  role: 'assistant',
  text: 'Hi, I am your Paladin voice assistant. Ask me about claims, documents, policy changes, contact updates, consultations, callback requests, or universal applicant information.',
  timestamp: new Date().toISOString(),
};

const QUESTION_PACKS = {
  popular: [
    'How do I report a claim with Paladin?',
    'How do I request proof of insurance or a COI?',
    'How do I make a policy change request?',
    'How do I update my contact information?',
    'How do I request a consultation with an agent?',
    'How do I request a callback from an agent?',
  ],
  consultation: [
    'What information do I need for a consultation request?',
    'Is the consultation request for personal or commercial coverage?',
    'What coverage type should I select on the consultation form?',
    'Can I request a consultation and a callback?',
    'What timeline should I include on the consultation request form?',
    'Who will follow up after I submit a consultation request?',
  ],
  documents: [
    'What do I need for a document request or COI?',
    'Which document types can I request?',
    'What should I include for Additional Insured or endorsement wording?',
    'What certificate holder details are needed on the document request form?',
    'Can I request declarations or endorsement copies too?',
    'What deadline information should I include on a document request?',
  ],
  policy: [
    'What information is needed for a policy change request?',
    'How do I add or remove a driver or vehicle?',
    'When should I include mortgagee or lienholder information?',
    'Can I change coverage limits or deductibles on the form?',
    'What effective date should I use for a policy change?',
    'Can I cancel a policy through the policy change request?',
  ],
  update: [
    'What do I need to update my contact info?',
    'Can I change my email, phone, or mailing address?',
    'Can I update one policy or all policies at once?',
    'When should I include my policy number on an update request?',
    'Can I use the form to update a legal name?',
    'What details should I include for other account updates?',
  ],
  claims: [
    'What details should I prepare before reporting a claim?',
    'Can I submit a claim after business hours?',
    'How quickly will a licensed agent follow up on a claim?',
    'What claim types can Paladin help with?',
    'What should I include for police report or estimated loss details?',
    'Can I report an auto, property, or liability claim through the form?',
  ],
  'universal-applicant': [
    'What information do I need to provide for my full legal name?',
    'Why do you need my date of birth?',
    'Can I enter a different phone number other than my personal one?',
    'How will you use my email address?',
    'What if I don\'t have a full SSN, can I skip that field?',
  ],
  call: [
    'What information do I need for a callback request?',
    'What day and time should I choose for a callback?',
    'Can I add an alternate time if the first one is unavailable?',
    'What topic should I include on the call request form?',
    'Do I need a policy number for a callback request?',
    'Can I request a callback after business hours?',
  ],
  coverage: [
    'Do you offer workers compensation and commercial auto?',
    'Can Paladin bundle multiple business coverages?',
    'How can Paladin help compare multiple carriers?',
    'What is the difference between umbrella and general liability?',
  ],
  'ho3': [
    'What property address do I need to enter for homeowners insurance?',
    'How does the county affect my homeowners insurance?',
    'What happens if I don\'t know the year my property was built?',
    'Do I need to provide the number of stories for my house?',
    'Is a pool covered under my homeowners insurance?',
  ],
  'ho6': [
    'What is the difference between a condo unit and a house when it comes to insurance?',
    'Why do you ask for the construction type of the building?',
    'How does the number of stories affect condo insurance?',
    'Do I need to provide a description of any renovations or upgrades to my condo?',
    'Is liability coverage included in condo insurance?',
  ],
  'ho4': [
    'What is renters insurance and what does it cover?',
    'How do I determine how much renters insurance I need?',
    'What does liability coverage in renters insurance cover?',
    'How does the type of rental unit affect my insurance?',
    'Do I need renters insurance if my landlord has insurance?',
  ],
  'commercial-auto': [
    'What is commercial auto insurance, and who needs it?',
    'How do you determine the premium for commercial auto insurance?',
    'Is there a difference in coverage for personal vs. commercial auto insurance?',
    'Why do I need to list all drivers for my commercial vehicles?',
    'Do I need to provide information on past accidents for commercial auto insurance?',
  ],
  'general-liability': [
    'What does general liability insurance cover?',
    'Why do I need to describe my business operations?',
    'How does my business revenue impact the cost of general liability insurance?',
    'Are subcontractors covered under my general liability policy?',
    'What is the difference between per occurrence and aggregate limits?',
  ],
  'workers-comp': [
    'What is workers\' compensation insurance, and who needs it?',
    'Why do I need to list each employee\'s job classification for workers\' compensation?',
    'How is my workers\' compensation premium calculated?',
    'What happens if my business has a history of workers\' compensation claims?',
    'Do I need to carry workers\' compensation insurance if I only have a few employees?',
  ],
  'earthquake': [
    'Is earthquake coverage included in my homeowners insurance?',
    'How do I determine if I need earthquake insurance?',
    'What factors affect the cost of earthquake insurance?',
    'Is there a deductible for earthquake insurance?',
    'Does earthquake insurance cover flood damage?',
  ],
  'flood': [
    'Why do I need flood insurance if my property isn\'t near water?',
    'How do I know if my property is in a flood zone?',
    'Is flood insurance required by law?',
    'What does flood insurance cover?',
    'Can I increase the coverage limit on my flood insurance policy?',
  ],
  'umbrella': [
    'What is umbrella insurance, and who needs it?',
    'Does umbrella insurance cover everything?',
    'Why do I need umbrella insurance if I already have liability coverage?',
    'How does the umbrella policy limit affect my coverage?',
    'Are there any exclusions with umbrella insurance?',
  ],
  'specialty': [
    'What is cyber liability insurance?',
    'Do I need to provide a description of my business operations for professional liability insurance?',
    'How do I determine the coverage needed for inland marine insurance?',
    'What is a surety bond, and when do I need one?',
    'What does pet insurance cover?',
  ],
  'carrier-directory': [
    'How do I know which insurance carrier to choose for my needs?',
    'What if I need a specialty insurance product not listed here?',
    'Can I change my insurance carrier after purchasing coverage?',
    'How do I file a claim with my insurance carrier?',
    'Does the carrier directory include all types of coverage?',
  ],
};

const QUESTION_CATEGORY_LABELS = {
  popular: 'POPULAR',
  consultation: 'CONSULTATION',
  documents: 'DOCUMENTS',
  policy: 'POLICY CHANGE',
  update: 'UPDATE INFO',
  claims: 'CLAIMS',
  'universal-applicant': 'UNIVERSAL APPLICANT',
  call: 'CALL REQUEST',
  coverage: 'COVERAGE',
  'ho3': 'HOMEOWNERS (HO3)',
  'ho6': 'CONDO (HO6)',
  'ho4': 'RENTERS (HO4)',
  'commercial-auto': 'COMMERCIAL AUTO',
  'general-liability': 'GENERAL LIABILITY',
  'workers-comp': 'WORKERS COMP',
  'earthquake': 'EARTHQUAKE',
  'flood': 'FLOOD',
  'umbrella': 'UMBRELLA',
  'specialty': 'SPECIALTY PRODUCTS',
  'carrier-directory': 'CARRIER DIRECTORY',
};

const ACTION_LABEL_BY_TYPE = {
  'open-request': 'Open form',
  'jump-contact': 'Contact',
  'call-phone': 'Call',
  email: 'Email',
};

function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedReply, setCopiedReply] = useState(false);
  const [feedbackByMessageIndex, setFeedbackByMessageIndex] = useState({});
  const [isAgoraConnected, setIsAgoraConnected] = useState(false);
  const [isAgoraConnecting, setIsAgoraConnecting] = useState(false);
  const [status, setStatus] = useState('Tap the mic and ask your question.');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MESSAGE]);
  const [questionCategory, setQuestionCategory] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [suggestedActions, setSuggestedActions] = useState([]);

  const recognitionRef = useRef(null);
  const recognitionRestartTimerRef = useRef(null);
  const voiceFinalizeTimerRef = useRef(null);
  const voiceBufferRef = useRef('');
  const interimBufferRef = useRef('');
  const lastVoiceMessageRef = useRef({ text: '', at: 0 });
  const speechVoicesRef = useRef([]);
  const preferredVoiceRef = useRef(null);
  const activeAudioRef = useRef(null);
  const activeAudioObjectUrlRef = useRef(null);
  const previousMessageCountRef = useRef(messages.length);
  const copyResetTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasHydratedRef = useRef(false);
  const isOpenRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const micEnabledRef = useRef(false);
  
  const agoraSdkRef = useRef(null);
  const agoraClientRef = useRef(null);
  const agoraMicTrackRef = useRef(null);
  const agoraUidRef = useRef(Math.floor(Math.random() * 100000) + 1);

  const sampleQuestions = QUESTION_PACKS[questionCategory] || QUESTION_PACKS.popular;

  const supportsSpeechRecognition = useMemo(
    () => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    []
  );

  const isLowConfidenceReply = (text) => {
    const value = String(text || '').toLowerCase();
    if (!value) {
      return false;
    }

    return /(not sure|i don't know|i do not know|can't|cannot|unable|issue|error|try again|contact support|human|agent)/i.test(
      value
    );
  };

  const openContactSupport = () => {
    window.dispatchEvent(
      new CustomEvent('paladin:open-contact-support', {
        detail: {
          source: 'voice-chat-widget',
          reason: 'low-confidence-handoff',
        },
      })
    );

    if (window.location.pathname === '/contact') {
      const target = document.getElementById('get-in-touch') || document.getElementById('quick-actions');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.location.assign('/contact#get-in-touch');
  };

  const openRequestFlow = (requestId) => {
    const requestKey = String(requestId || '').trim();
    if (!requestKey) {
      return;
    }

    const requestUrl = `/contact?request=${encodeURIComponent(requestKey)}#quick-actions`;

    if (window.location.pathname === '/contact') {
      window.history.replaceState({}, '', requestUrl);
      window.dispatchEvent(
        new CustomEvent('paladin:open-contact-request', {
          detail: { requestId: requestKey, source: 'voice-chat-widget' },
        })
      );

      const target = document.getElementById('quick-actions');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    window.location.assign(requestUrl);
  };

  const executeSuggestedAction = (action) => {
    if (!action || typeof action !== 'object') {
      return;
    }

    if (action.type === 'open-request') {
      openRequestFlow(action.requestId);
      return;
    }

    if (action.type === 'jump-contact') {
      openContactSupport();
      return;
    }

    if (action.type === 'call-phone' && action.value) {
      window.location.href = `tel:${action.value}`;
      return;
    }

    if (action.type === 'email' && action.value) {
      window.location.href = `mailto:${action.value}`;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const raw = window.localStorage.getItem(VOICE_CHAT_STORAGE_KEY);
      if (!raw) {
        hasHydratedRef.current = true;
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }
      
      if (typeof parsed.isVoiceMuted === 'boolean') {
        setIsVoiceMuted(parsed.isVoiceMuted);
      }
      if (parsed.feedbackByMessageIndex && typeof parsed.feedbackByMessageIndex === 'object') {
        setFeedbackByMessageIndex(parsed.feedbackByMessageIndex);
      }
    } catch (error) {
      // Ignore invalid localStorage data and continue with defaults.
    } finally {
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current || typeof window === 'undefined') {
      return;
    }

    const payload = {
      messages,
      isVoiceMuted,
      feedbackByMessageIndex,
    };

    try {
      window.localStorage.setItem(VOICE_CHAT_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore persistence errors in private mode/quota limits.
    }
  }, [messages, isVoiceMuted, feedbackByMessageIndex]);

  useEffect(() => {
    isOpenRef.current = isOpen;

    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    const previousCount = previousMessageCountRef.current;
    if (messages.length > previousCount) {
      const newMessages = messages.slice(previousCount);
      const assistantAdded = newMessages.filter((message) => message.role === 'assistant').length;

      if (!isOpen && assistantAdded > 0) {
        setUnreadCount((count) => count + assistantAdded);
      }
    }

    previousMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        String(event.key || '').toLowerCase() === 'v';

      if (isShortcut) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
        setUnreadCount(0);
        return;
      }

      if (event.key === 'Escape' && isOpenRef.current) {
        event.preventDefault();
        setIsOpen(false);
        if (ENABLE_AGORA) {
          disconnectAgoraVoice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    micEnabledRef.current = micEnabled;
  }, [micEnabled]);

  

  useEffect(() => {
    if (!ENABLE_AGORA || !isOpen || isAgoraConnected || isAgoraConnecting) {
      return;
    }

    connectAgoraVoice();
  }, [isOpen, isAgoraConnected, isAgoraConnecting]);

  useEffect(() => {
    return () => {
      if (agoraMicTrackRef.current) {
        agoraMicTrackRef.current.stop();
        agoraMicTrackRef.current.close();
        agoraMicTrackRef.current = null;
      }

      if (agoraClientRef.current) {
        agoraClientRef.current.leave();
      }

      if (recognitionRestartTimerRef.current) {
        clearTimeout(recognitionRestartTimerRef.current);
        recognitionRestartTimerRef.current = null;
      }

      if (voiceFinalizeTimerRef.current) {
        clearTimeout(voiceFinalizeTimerRef.current);
        voiceFinalizeTimerRef.current = null;
      }

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
        copyResetTimerRef.current = null;
      }

      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }

      if (activeAudioObjectUrlRef.current) {
        URL.revokeObjectURL(activeAudioObjectUrlRef.current);
        activeAudioObjectUrlRef.current = null;
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return undefined;
    }

    const selectPreferredVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      speechVoicesRef.current = voices;

      const femaleHints = ['female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira'];
      const preferred =
        voices.find((voice) => {
          const value = `${voice.name} ${voice.lang}`.toLowerCase();
          return voice.lang.toLowerCase().startsWith('en') && femaleHints.some((hint) => value.includes(hint));
        }) || voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));

      preferredVoiceRef.current = preferred || null;
    };

    selectPreferredVoice();
    window.speechSynthesis.onvoiceschanged = selectPreferredVoice;

    return () => {
      if (window.speechSynthesis.onvoiceschanged === selectPreferredVoice) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const clearVoiceFinalizeTimer = () => {
    if (voiceFinalizeTimerRef.current) {
      clearTimeout(voiceFinalizeTimerRef.current);
      voiceFinalizeTimerRef.current = null;
    }
  };

  const resetVoiceBuffers = () => {
    voiceBufferRef.current = '';
    interimBufferRef.current = '';
  };

  const buildVoiceTranscript = () =>
    `${voiceBufferRef.current} ${interimBufferRef.current}`.replace(/\s+/g, ' ').trim();

  const scheduleVoiceFinalize = (callback, delayMs = 1300) => {
    clearVoiceFinalizeTimer();
    voiceFinalizeTimerRef.current = setTimeout(() => {
      voiceFinalizeTimerRef.current = null;
      callback();
    }, delayMs);
  };

  const startListeningNow = () => {
    if (
      !supportsSpeechRecognition ||
      !recognitionRef.current ||
      isListening ||
      isLoadingRef.current ||
      isSpeakingRef.current
    ) {
      return false;
    }

    try {
      recognitionRef.current.start();
      return true;
    } catch (error) {
      return false;
    }
  };

  const stopListeningNow = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      // Ignore stop errors from inactive recognition.
    }

    clearVoiceFinalizeTimer();
  };

  useEffect(() => {
    if (!supportsSpeechRecognition) {
      setStatus('Voice recognition is not supported in this browser. You can still type your question.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    const flushVoiceTranscript = () => {
      const transcript = buildVoiceTranscript();
      if (!transcript) {
        return;
      }

      const now = Date.now();
      const isDuplicateRecent =
        transcript === lastVoiceMessageRef.current.text && now - lastVoiceMessageRef.current.at < 4000;

      resetVoiceBuffers();

      if (isDuplicateRecent) {
        return;
      }

      lastVoiceMessageRef.current = { text: transcript, at: now };
      sendMessage(transcript, { fromVoice: true });
    };

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Listening...');
    };

    recognition.onend = () => {
      setIsListening(false);
      clearVoiceFinalizeTimer();
      flushVoiceTranscript();

      if (micEnabledRef.current) {
        setStatus('Mic is on. Tap "Turn Mic Off" to stop listening.');
      } else {
        setStatus((prev) => (prev === 'Listening...' ? 'Tap the mic and ask your question.' : prev));
      }
    };

    recognition.onerror = (event) => {
      setStatus(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interim = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const chunk = (result?.[0]?.transcript || '').trim();
        if (!chunk) {
          continue;
        }

        if (result.isFinal) {
          voiceBufferRef.current = `${voiceBufferRef.current} ${chunk}`.replace(/\s+/g, ' ').trim();
          interimBufferRef.current = '';
        } else {
          interim = `${interim} ${chunk}`.replace(/\s+/g, ' ').trim();
        }
      }

      if (interim) {
        interimBufferRef.current = interim;
      }

      if (buildVoiceTranscript()) {
        setStatus('Listening... Finishing your sentence...');
        scheduleVoiceFinalize(flushVoiceTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      }

      if (recognitionRestartTimerRef.current) {
        clearTimeout(recognitionRestartTimerRef.current);
        recognitionRestartTimerRef.current = null;
      }

      clearVoiceFinalizeTimer();
      resetVoiceBuffers();
    };
  }, [supportsSpeechRecognition]);

  const speakWithBrowserVoice = (text) => {
    if (!('speechSynthesis' in window) || !text) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      if (preferredVoiceRef.current) {
        utterance.voice = preferredVoiceRef.current;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const speakWithElevenLabs = async (text) => {
    const response = await fetch(`${API_BASE_URL}/api/voice-chat/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const rawBody = await response.text();
      let errorMessage = 'ElevenLabs synthesis failed.';

      try {
        const parsed = rawBody ? JSON.parse(rawBody) : null;
        if (parsed?.error) {
          errorMessage = parsed.error;
        }
        if (parsed?.details) {
          errorMessage = `${errorMessage} ${String(parsed.details)}`.trim();
        }
      } catch (parseError) {
        if (rawBody) {
          errorMessage = rawBody;
        }
      }

      // Keep provider details out of user-facing UI; fallback messaging is handled in speak().
      console.warn('ElevenLabs TTS unavailable, using browser voice fallback.');
      throw new Error(errorMessage);
    }

    const audioBlob = await response.blob();
    const objectUrl = URL.createObjectURL(audioBlob);

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    if (activeAudioObjectUrlRef.current) {
      URL.revokeObjectURL(activeAudioObjectUrlRef.current);
      activeAudioObjectUrlRef.current = null;
    }

    await new Promise((resolve, reject) => {
      const audio = new Audio(objectUrl);
      activeAudioRef.current = audio;
      activeAudioObjectUrlRef.current = objectUrl;

      audio.onended = () => {
        if (activeAudioObjectUrlRef.current) {
          URL.revokeObjectURL(activeAudioObjectUrlRef.current);
          activeAudioObjectUrlRef.current = null;
        }
        activeAudioRef.current = null;
        resolve();
      };

      audio.onerror = () => {
        if (activeAudioObjectUrlRef.current) {
          URL.revokeObjectURL(activeAudioObjectUrlRef.current);
          activeAudioObjectUrlRef.current = null;
        }
        activeAudioRef.current = null;
        reject(new Error('Audio playback failed.'));
      };

      audio
        .play()
        .then(() => undefined)
        .catch((error) => {
          if (activeAudioObjectUrlRef.current) {
            URL.revokeObjectURL(activeAudioObjectUrlRef.current);
            activeAudioObjectUrlRef.current = null;
          }
          activeAudioRef.current = null;
          reject(error);
        });
    });
  };

  const speak = async (text) => {
    if (!text || isVoiceMuted) {
      return;
    }

    setIsSpeaking(true);

    try {
      if (USE_ELEVENLABS_TTS) {
        await speakWithElevenLabs(text);
      } else {
        await speakWithBrowserVoice(text);
      }
    } catch (error) {
      setStatus('Voice service is temporarily unavailable. Using browser voice fallback.');
      await speakWithBrowserVoice(text);
    } finally {
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (rawMessage, options = {}) => {
    const { fromVoice = false } = options;
    const message = String(rawMessage || '').trim();
    if (!message || isLoading) {
      return;
    }

    setIsLoading(true);
    setStatus('Thinking...');
    setMessages((prev) => [...prev, { role: 'user', text: message, timestamp: new Date().toISOString() }]);

    try {
      if (!API_BASE_URL && !IS_LOCALHOST) {
        throw new Error(
          'Missing REACT_APP_API_BASE_URL for production. Add it in Vercel frontend Environment Variables and redeploy.'
        );
      }

      const response = await fetch(`${API_BASE_URL}/api/voice-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const rawBody = await response.text();
      let payload = {};

      try {
        payload = rawBody ? JSON.parse(rawBody) : {};
      } catch (parseError) {
        payload = { error: rawBody || 'Unexpected response from server.' };
      }

      if (!response.ok) {
        throw new Error(payload.error || `Backend error (${response.status}).`);
      }

      const assistantText = payload.reply || payload.error || 'I ran into an issue. Please try again.';
      const payloadFollowUps = Array.isArray(payload.followUpQuestions) ? payload.followUpQuestions : [];
      const payloadActions = Array.isArray(payload.suggestedActions) ? payload.suggestedActions : [];

      setMessages((prev) => [...prev, { role: 'assistant', text: assistantText, timestamp: new Date().toISOString() }]);
      setFollowUpQuestions(payloadFollowUps.slice(0, 3));
      setSuggestedActions(payloadActions.slice(0, 3));
      setStatus('Speaking response...');
      await speak(assistantText);

      if (micEnabledRef.current) {
        setStatus('Mic is on. Tap "Turn Mic Off" to stop listening.');
      } else {
        setStatus('Tap the mic and ask your question.');
      }
    } catch (error) {
      const errorText = String(error?.message || '').trim();
      const userVisibleError =
        errorText || `Connection failed. Could not reach backend API at ${API_TARGET_LABEL}. Please try again.`;

      setMessages((prev) => [
        ...(prev[prev.length - 1]?.text === userVisibleError
          ? prev
          : [
              ...prev,
              {
                role: 'assistant',
                text: userVisibleError,
                timestamp: new Date().toISOString(),
              },
            ]),
      ]);
      setStatus('Connection issue. Please retry.');
      setFollowUpQuestions([]);
      setSuggestedActions([]);
    } finally {
      setIsLoading(false);
      setTextInput('');
    }
  };

  const disconnectAgoraVoice = async () => {
    if (agoraMicTrackRef.current) {
      agoraMicTrackRef.current.stop();
      agoraMicTrackRef.current.close();
      agoraMicTrackRef.current = null;
    }

    if (agoraClientRef.current) {
      await agoraClientRef.current.leave();
      agoraClientRef.current = null;
    }

    setIsAgoraConnected(false);
    setStatus('Agora voice channel disconnected.');
  };

  const connectAgoraVoice = async () => {
    if (isAgoraConnected || isAgoraConnecting) {
      return;
    }

    setIsAgoraConnecting(true);
    setStatus('Connecting Agora voice channel...');

    try {
      if (!agoraSdkRef.current) {
        const module = await import('agora-rtc-sdk-ng');
        agoraSdkRef.current = module.default;
      }

      const AgoraRTC = agoraSdkRef.current;
      const tokenEndpoint = `${API_BASE_URL}/api/agora/token?channel=${encodeURIComponent(AGORA_DEFAULT_CHANNEL)}&uid=${agoraUidRef.current}`;
      let tokenResponse;

      try {
        tokenResponse = await fetch(tokenEndpoint);
      } catch (fetchError) {
        throw new Error(`Cannot reach Agora token endpoint at ${tokenEndpoint}. Make sure backend is running.`);
      }

      const rawTokenBody = await tokenResponse.text();
      let tokenPayload = {};

      try {
        tokenPayload = rawTokenBody ? JSON.parse(rawTokenBody) : {};
      } catch (parseError) {
        tokenPayload = { error: rawTokenBody || 'Invalid token response from server.' };
      }

      if (!tokenResponse.ok) {
        throw new Error(tokenPayload.error || 'Failed to fetch Agora token.');
      }

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.stop();
        }
      });

      await client.join(tokenPayload.appId, tokenPayload.channel, tokenPayload.token, tokenPayload.uid);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([micTrack]);

      agoraClientRef.current = client;
      agoraMicTrackRef.current = micTrack;
      setIsAgoraConnected(true);
      setStatus('Agora voice channel connected. You can now talk in realtime channel audio.');
    } catch (error) {
      setStatus(error.message || 'Failed to connect Agora voice channel.');
      if (agoraClientRef.current) {
        await agoraClientRef.current.leave();
      }
      if (agoraMicTrackRef.current) {
        agoraMicTrackRef.current.stop();
        agoraMicTrackRef.current.close();
      }
      agoraClientRef.current = null;
      agoraMicTrackRef.current = null;
      setIsAgoraConnected(false);
    } finally {
      setIsAgoraConnecting(false);
    }
  };

  const handleMicToggle = () => {
    if (!supportsSpeechRecognition || !recognitionRef.current || isLoading || isSpeaking) {
      return;
    }

    if (micEnabled) {
      setMicEnabled(false);
      if (recognitionRestartTimerRef.current) {
        clearTimeout(recognitionRestartTimerRef.current);
        recognitionRestartTimerRef.current = null;
      }
      clearVoiceFinalizeTimer();
      resetVoiceBuffers();
      stopListeningNow();
      setStatus('Mic is off.');
      return;
    }

    resetVoiceBuffers();
    setMicEnabled(true);
    const started = startListeningNow();
    if (!started) {
      setStatus('Mic is on. Tap "Turn Mic Off" to stop listening.');
    }
  };

  const handleSampleQuestion = (question) => {
    sendMessage(question);
  };

  const handleTextSubmit = (event) => {
    event.preventDefault();
    sendMessage(textInput);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setFeedbackByMessageIndex({});
    setFollowUpQuestions([]);
    setSuggestedActions([]);
    setStatus('Conversation reset. Ask a new question.');
    setUnreadCount(0);
  };

  const handleCopyLatestReply = async () => {
    const latestAssistant = [...messages].reverse().find((message) => message.role === 'assistant')?.text;
    if (!latestAssistant || !navigator?.clipboard?.writeText) {
      setStatus('Copy is not available in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(latestAssistant);
      setCopiedReply(true);
      setStatus('Latest reply copied.');

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }

      copyResetTimerRef.current = setTimeout(() => {
        setCopiedReply(false);
        copyResetTimerRef.current = null;
      }, 1800);
    } catch (error) {
      setStatus('Unable to copy the latest reply.');
    }
  };

  

  const canUseMic = supportsSpeechRecognition && !isLoading && !isSpeaking;
  const lastAssistantMessageIndex = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === 'assistant') {
        return index;
      }
    }
    return -1;
  }, [messages]);

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDeleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
    setFeedbackByMessageIndex((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col items-end justify-end p-4">
      {isOpen && (
        <section className="mb-4 pointer-events-auto relative flex h-[600px] w-[360px] min-h-0 flex-col overflow-visible rounded-2xl border border-[#d7e5ff] bg-gradient-to-b from-[#f8fbff] to-white shadow-[0_20px_45px_-25px_rgba(2,37,91,0.45)]">
          <header className="relative shrink-0 overflow-hidden border-b border-[#d7e5ff] bg-[#072e73] px-4 py-4 text-white">
            <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[#00c2a8]/35 blur-xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-10 h-20 w-20 rounded-full bg-[#2f7ff0]/30 blur-xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold tracking-wide">Paladin Voice AI</h2>
                <p className="mt-2 inline-flex max-w-full items-center truncate rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/95">
                  {status}
                </p>
                {ENABLE_AGORA && (
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/80">
                    {isAgoraConnected ? '🔊 Live Voice: Connected' : isAgoraConnecting ? '⏳ Live Voice: Connecting' : '⊘ Live Voice: Idle'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (ENABLE_AGORA) {
                    disconnectAgoraVoice();
                  }
                }}
                className="shrink-0 rounded-lg border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                ✕
              </button>
            </div>
          </header>

          {selectedCategory && (
            <div className="absolute top-16 left-3 right-3 z-10 rounded-lg border border-[#cfe0ff] bg-gradient-to-b from-white to-[#f9fcff] p-3 shadow-lg opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#08337e]">{QUESTION_CATEGORY_LABELS[selectedCategory] || selectedCategory}</p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-bold text-[#08337e] hover:text-[#0a4ab3]"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1 max-h-[220px] overflow-y-auto">
                {sampleQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      handleSampleQuestion(question);
                      setSelectedCategory(null);
                    }}
                    disabled={isLoading}
                    className="w-full text-left rounded-md border border-[#cfe0ff] bg-white px-2 py-1.5 text-xs font-medium text-[#08337e] transition-colors hover:border-[#0a4ab3] hover:bg-[#f0f6ff] disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="min-h-[220px] flex-[1.35] space-y-2 overflow-y-auto bg-gradient-to-b from-[#f2f7ff] via-[#f8fbff] to-[#ffffff] px-3 py-3 text-sm overscroll-contain">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`group flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`mb-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    msg.role === 'assistant'
                      ? 'bg-[#0a4ab3] text-white'
                      : 'border border-[#bfd5ff] bg-white text-[#08337e]'
                  }`}
                >
                  {msg.role === 'assistant' ? 'AI' : 'U'}
                </div>
                <div
                  className={`max-w-[75%] break-words rounded-2xl px-3 py-2 shadow-sm ${
                    msg.role === 'assistant'
                      ? 'border border-[#dce8ff] bg-white text-[#0b1f3f]'
                      : 'bg-gradient-to-br from-[#0a4ab3] to-[#072e73] text-white'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                  <div className={`mt-1 text-[9px] ${msg.role === 'assistant' ? 'text-[#6e7e98]' : 'text-white/75'}`}>
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(index)}
                  className="mb-1 hidden rounded-md border border-[#d7e5ff] bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#6e7e98] transition-colors hover:border-[#0a4ab3] hover:text-[#0a4ab3] md:group-hover:inline-flex"
                  aria-label="Delete message"
                >
                  Del
                </button>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2">
                <div className="rounded-2xl border border-[#dce8ff] bg-white px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#0a4ab3]"></span>
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#0a4ab3]/70 [animation-delay:120ms]"></span>
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#0a4ab3]/40 [animation-delay:220ms]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 space-y-2 border-t border-[#d7e5ff] bg-white/95 px-3 py-3">
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={handleMicToggle}
                disabled={!canUseMic}
                title={isListening ? 'Stop recording' : micEnabled ? 'Microphone is active' : 'Activate microphone'}
                className={`rounded-lg px-2 py-2 text-xs font-semibold text-white transition-all ${
                  isListening
                    ? 'bg-[#059669]'
                    : micEnabled
                    ? 'bg-[#0a4ab3]'
                    : 'bg-[#6b7280]'
                } disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md`}
              >
                {isListening ? 'Listening' : micEnabled ? 'Mic On' : 'Mic Off'}
              </button>
              <button
                type="button"
                onClick={() => setIsVoiceMuted((value) => !value)}
                title={isVoiceMuted ? 'Audio is muted' : 'Audio is enabled'}
                className={`rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                  isVoiceMuted
                    ? 'bg-[#dc2626] text-white'
                    : 'bg-[#0a4ab3] text-white'
                } hover:shadow-md`}
              >
                {isVoiceMuted ? 'Muted' : 'Audio On'}
              </button>
              <button
                type="button"
                onClick={handleCopyLatestReply}
                disabled={lastAssistantMessageIndex === -1}
                title="Copy the latest response"
                className="rounded-lg border border-[#bfd5ff] bg-white px-2 py-2 text-xs font-semibold text-[#08337e] transition-colors hover:border-[#0a4ab3] hover:text-[#0a4ab3] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copiedReply ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation history"
                className="rounded-lg bg-[#dc2626] px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#b91c1c] hover:shadow-md"
              >
                Clear
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="flex flex-row gap-1.5">
              <input
                type="text"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Ask something..."
                className="flex-1 rounded-lg border border-[#bfd5ff] bg-[#fdfefe] px-3 py-2 text-xs text-[#0b1f3f] outline-none transition-shadow focus:border-[#0a4ab3] focus:ring-2 focus:ring-[#0a4ab3]/25"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="rounded-lg bg-gradient-to-br from-[#0a4ab3] to-[#072e73] px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
              >
                Send
              </button>
            </form>

            <div className="max-h-[140px] space-y-2 overflow-y-auto pr-1">
              <div className="space-y-2">
                <div className="overflow-x-auto pb-1">
                  <div className="flex flex-nowrap gap-1">
                    {Object.keys(QUESTION_PACKS).map((categoryKey) => (
                      <button
                        key={categoryKey}
                        type="button"
                        onClick={() => {
                          setQuestionCategory(categoryKey);
                          setSelectedCategory(categoryKey);
                        }}
                        className={`rounded-full border px-2 py-1 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
                          questionCategory === categoryKey
                            ? 'border-[#0a4ab3] bg-[#0a4ab3] text-white'
                            : 'border-[#bfd5ff] bg-[#f3f8ff] text-[#08337e] hover:border-[#0a4ab3]'
                        }`}
                      >
                        {QUESTION_CATEGORY_LABELS[categoryKey] || categoryKey}
                      </button>
                    ))}
                  </div>
                </div>

                {suggestedActions.length > 0 && (
                  <div className="rounded-lg border border-[#cfe0ff] bg-white p-2">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#08337e]">Next Steps</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedActions.map((action) => (
                        <button
                          key={action.id || `${action.type}-${action.label}`}
                          type="button"
                          onClick={() => executeSuggestedAction(action)}
                          className="rounded-md bg-gradient-to-br from-[#0a4ab3] to-[#072e73] px-2 py-1 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                        >
                          {action.label || ACTION_LABEL_BY_TYPE[action.type] || 'Action'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        className="pointer-events-auto group relative h-16 w-16 flex items-center justify-center overflow-hidden rounded-full border border-[#74a2ef] bg-gradient-to-br from-[#0a4ab3] to-[#072e73] font-semibold text-white shadow-lg shadow-[#072e73]/35 transition-all hover:-translate-y-0.5 active:translate-y-0"
        title={isOpen ? 'Close assistant' : 'Open AI Assistant'}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex flex-col items-center justify-center text-center leading-tight">
          <span className="text-[10px]">AI</span>
          <span className="text-[9px] font-medium">Assistant</span>
        </span>
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#059669] text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default VoiceChatWidget;
