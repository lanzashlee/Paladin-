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
  text: 'Hi, I am your Paladin voice assistant. Ask me anything about insurance support and services.',
  timestamp: new Date().toISOString(),
};

const QUESTION_PACKS = {
  popular: [
    'How do I report a claim with Paladin?',
    'What are your office hours and contact details?',
    'How do I request proof of insurance or a COI?',
    'How do I request a callback from an agent?',
    'How do I make changes to an existing policy?',
    'What states is Paladin licensed in?',
  ],
  claims: [
    'What details should I prepare before reporting a claim?',
    'Can I submit a claim after business hours?',
    'How quickly will a licensed agent follow up on a claim?',
    'What claim types can Paladin help with?',
  ],
  policy: [
    'How do I add or remove a driver from my policy?',
    'How do I change coverage limits or deductibles?',
    'What information is needed for a policy change request?',
    'How do I update my contact info on file?',
  ],
  coverage: [
    'Do you offer workers compensation and commercial auto?',
    'Can Paladin bundle multiple business coverages?',
    'How can Paladin help compare multiple carriers?',
    'What is the difference between umbrella and general liability?',
  ],
};

const QUESTION_CATEGORY_LABELS = {
  popular: 'Popular',
  claims: 'Claims',
  policy: 'Policy',
  coverage: 'Coverage',
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
  const [autoListen, setAutoListen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedReply, setCopiedReply] = useState(false);
  const [feedbackByMessageIndex, setFeedbackByMessageIndex] = useState({});
  const [isAgoraConnected, setIsAgoraConnected] = useState(false);
  const [isAgoraConnecting, setIsAgoraConnecting] = useState(false);
  const [status, setStatus] = useState('Tap the mic and ask your question.');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MESSAGE]);
  const [questionCategory, setQuestionCategory] = useState('popular');
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
  const autoListenRef = useRef(false);
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
      if (typeof parsed.autoListen === 'boolean') {
        setAutoListen(parsed.autoListen);
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
      autoListen,
      isVoiceMuted,
      feedbackByMessageIndex,
    };

    try {
      window.localStorage.setItem(VOICE_CHAT_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore persistence errors in private mode/quota limits.
    }
  }, [messages, autoListen, isVoiceMuted, feedbackByMessageIndex]);

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
    autoListenRef.current = autoListen;
  }, [autoListen]);

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

      if (
        micEnabledRef.current &&
        autoListenRef.current &&
        isOpenRef.current &&
        !isLoadingRef.current &&
        !isSpeakingRef.current
      ) {
        if (recognitionRestartTimerRef.current) {
          clearTimeout(recognitionRestartTimerRef.current);
        }

        recognitionRestartTimerRef.current = setTimeout(() => {
          recognitionRestartTimerRef.current = null;
          resetVoiceBuffers();
          const restarted = startListeningNow();
          if (!restarted && micEnabledRef.current) {
            setStatus('Mic is on. Tap "Turn Mic Off" to stop listening.');
          }
        }, 450);

        return;
      }

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

      if (
        fromVoice &&
        micEnabledRef.current &&
        autoListenRef.current &&
        isOpenRef.current &&
        supportsSpeechRecognition &&
        recognitionRef.current
      ) {
        const restarted = startListeningNow();
        if (!restarted) {
          setStatus('Mic is on. Tap "Turn Mic Off" to stop listening.');
        }
      } else if (micEnabledRef.current) {
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

  const handleExportChat = () => {
    const chatText = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.text}`)
      .join('\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(chatText)}`);
    element.setAttribute('download', `paladin-chat-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-x-2 bottom-2 z-50 flex flex-col items-end sm:inset-x-auto sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="mb-2 flex w-full max-w-[96vw] flex-col overflow-hidden rounded-3xl border border-[#e7dccb] bg-white shadow-2xl shadow-[#012E72]/15 sm:mb-3 sm:w-[360px] sm:max-w-[92vw] max-h-[calc(100vh-5.25rem)] sm:max-h-[calc(100vh-7rem)]">
          <header className="border-b border-[#e7dccb] bg-white px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#012E72]">Voice Assistant</h2>
              <p className="text-xs text-[#010407]/60 mt-0.5">{status}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (ENABLE_AGORA) {
                  disconnectAgoraVoice();
                }
              }}
              className="text-[#010407]/60 hover:text-[#012E72] text-lg"
            >
              ✕
            </button>
          </header>

          <div className="min-h-[180px] flex-1 space-y-2 overflow-y-auto bg-white px-3 py-3 text-sm sm:min-h-[240px]">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[72%] break-words ${
                    msg.role === 'assistant'
                      ? 'bg-[#F7F4EF] text-[#010407]'
                      : 'bg-[#012E72] text-white'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2">
                <div className="rounded-lg px-3 py-2 bg-[#F7F4EF] text-[#010407]">
                  <div className="flex gap-1">
                    <span className="inline-block h-2 w-2 bg-[#002DB5] rounded-full"></span>
                    <span className="inline-block h-2 w-2 bg-[#002DB5] rounded-full opacity-60"></span>
                    <span className="inline-block h-2 w-2 bg-[#002DB5] rounded-full opacity-30"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-3 border-t border-[#e7dccb] bg-white px-3 py-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleMicToggle}
                disabled={!canUseMic}
                className={`rounded-lg px-2 py-2 text-xs font-bold text-white transition-all ${
                  isListening
                    ? 'bg-[#0f766e]'
                    : micEnabled
                    ? 'bg-[#002DB5]'
                    : 'bg-[#012E72]'
                } disabled:opacity-50`}
              >
                {isListening ? '🎤 On' : micEnabled ? '🎤 Off' : '🎙️'}
              </button>
              <button
                type="button"
                onClick={() => setIsVoiceMuted((value) => !value)}
                className={`rounded-lg px-2 py-2 text-xs font-bold transition-all ${
                  isVoiceMuted
                    ? 'bg-[#d8cbb8] text-[#012E72]'
                    : 'bg-[#012E72] text-white'
                }`}
              >
                {isVoiceMuted ? '🔇' : '🔊'}
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="rounded-lg bg-[#b91c1c] px-2 py-2 text-xs font-bold text-white hover:bg-[#991b1b] transition-all"
              >
                🗑️
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Ask something..."
                className="flex-1 rounded-lg border border-[#d8cbb8] bg-white px-3 py-2 text-sm text-[#010407] outline-none focus:border-[#002DB5] focus:ring-1 focus:ring-[#002DB5]/50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="rounded-lg bg-[#012E72] px-3 py-2 font-bold text-white hover:bg-[#002DB5] disabled:opacity-50"
              >
                ↲
              </button>
            </form>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(QUESTION_PACKS).map((categoryKey) => (
                  <button
                    key={categoryKey}
                    type="button"
                    onClick={() => setQuestionCategory(categoryKey)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      questionCategory === categoryKey
                        ? 'border-[#002DB5] bg-[#002DB5] text-white'
                        : 'border-[#d8cbb8] bg-[#F7F4EF] text-[#012E72] hover:border-[#002DB5]'
                    }`}
                  >
                    {QUESTION_CATEGORY_LABELS[categoryKey] || categoryKey}
                  </button>
                ))}
              </div>

              <div className="max-h-[82px] overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSampleQuestion(question)}
                      disabled={isLoading}
                      className="rounded-lg border border-[#d8cbb8] bg-[#F7F4EF] px-2 py-1 text-[10px] font-medium text-[#012E72] hover:border-[#002DB5] disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {followUpQuestions.length > 0 && (
                <div className="rounded-lg border border-[#e7dccb] bg-[#F7F4EF]/65 p-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#012E72]">Helpful follow-ups</p>
                  <div className="flex flex-wrap gap-1.5">
                    {followUpQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleSampleQuestion(question)}
                        disabled={isLoading}
                        className="rounded-md border border-[#d8cbb8] bg-white px-2 py-1 text-[10px] font-medium text-[#012E72] hover:border-[#002DB5] disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestedActions.length > 0 && (
                <div className="rounded-lg border border-[#e7dccb] bg-white p-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#012E72]">Take action</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedActions.map((action) => (
                      <button
                        key={action.id || `${action.type}-${action.label}`}
                        type="button"
                        onClick={() => executeSuggestedAction(action)}
                        className="rounded-md bg-[#012E72] px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-[#002DB5]"
                      >
                        {action.label || ACTION_LABEL_BY_TYPE[action.type] || 'Action'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
        className="group relative rounded-full bg-[#012E72] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/25 transition-all hover:bg-[#002DB5] hover:translate-y-[-2px] active:translate-y-0 sm:px-5"
      >
        <span className="flex items-center gap-2">
          {isOpen ? '✕' : '💬'}
          {isOpen ? 'Close' : 'Chat'}
        </span>
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#ff7f11] text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default VoiceChatWidget;
