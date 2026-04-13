import React, { useEffect, useMemo, useRef, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const AGORA_DEFAULT_CHANNEL = process.env.REACT_APP_AGORA_CHANNEL || 'paladin-voice';
const USE_ELEVENLABS_TTS = process.env.REACT_APP_USE_ELEVENLABS_TTS !== 'false';
const ENABLE_AGORA = process.env.REACT_APP_ENABLE_AGORA === 'true';
const VOICE_CHAT_STORAGE_KEY = 'paladin.voice-chat-widget.v1';
const INITIAL_ASSISTANT_MESSAGE = {
  role: 'assistant',
  text: 'Hi, I am your Paladin voice assistant. Ask me anything about insurance support and services.',
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

  const sampleQuestions = [
    'What are your office hours?',
    'How do I report a claim?',
    'What insurance types do you offer?',
    'How do I make changes to my existing policy?',
    'How do I request proof of insurance?',
    'What states are you licensed in?',
    'How can I contact Paladin?',
    'Do you offer workers compensation and commercial auto?',
  ];

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
      const errorBody = await response.text();
      throw new Error(errorBody || 'ElevenLabs synthesis failed.');
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
      setStatus('ElevenLabs unavailable. Using browser voice fallback.');
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
    setMessages((prev) => [...prev, { role: 'user', text: message }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/voice-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const payload = await response.json();
      const assistantText = payload.reply || payload.error || 'I ran into an issue. Please try again.';

      setMessages((prev) => [...prev, { role: 'assistant', text: assistantText }]);
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
      setMessages((prev) => [
        ...(prev[prev.length - 1]?.text ===
        'Connection failed. Please make sure backend server is running on http://localhost:5000 and try again.'
          ? prev
          : [
              ...prev,
              {
                role: 'assistant',
                text: 'Connection failed. Please make sure backend server is running on http://localhost:5000 and try again.',
              },
            ]),
      ]);
      setStatus('Connection issue. Please retry.');
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

  return (
    <div className="fixed inset-x-2 bottom-2 z-50 flex flex-col items-end sm:inset-x-auto sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="mb-2 flex w-full max-w-[96vw] flex-col overflow-hidden rounded-3xl border border-[#e7dccb] bg-white shadow-2xl shadow-[#012E72]/15 sm:mb-3 sm:w-[360px] sm:max-w-[92vw] max-h-[calc(100vh-5.25rem)] sm:max-h-[calc(100vh-7rem)]">
          <header className="relative overflow-hidden border-b border-[#e7dccb] bg-white px-4 py-4 text-[#012E72]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#002DB5]/10 blur-xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-14 w-24 rounded-full bg-[#F7F4EF] blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide">Paladin Voice Assistant</h2>
                <p className="mt-1 text-[11px] text-[#010407]/75">Ask about claims, billing, policy updates, and more</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isListening ? 'animate-pulse bg-[#34d399]' : 'bg-white/70'
                  }`}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (ENABLE_AGORA) {
                      disconnectAgoraVoice();
                    }
                  }}
                  className="rounded-lg border border-[#d8cbb8] bg-white px-2.5 py-1 text-xs text-[#012E72] hover:border-[#002DB5] hover:text-[#002DB5]"
                >
                  Close
                </button>
              </div>
            </div>
          </header>

          <div className="border-b border-[#e7dccb] bg-[#F7F4EF] px-4 py-2.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#012E72]">
              <span className="max-w-[74%] truncate">{status}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  isLoading
                    ? 'bg-[#fcd34d]/40 text-[#7c5200]'
                    : isListening
                    ? 'bg-[#86efac]/45 text-[#14532d]'
                    : 'bg-[#dbeafe] text-[#012E72]'
                }`}
              >
                {isLoading ? 'Thinking' : isListening ? 'Listening' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="min-h-[170px] flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-[#faf8f3] px-4 py-4 text-sm sm:min-h-[220px]">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={msg.role === 'assistant' ? 'max-w-[88%]' : 'ml-auto max-w-[88%]'}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.role === 'assistant'
                      ? 'border border-[#e7dccb] bg-white text-[#010407]'
                      : 'bg-gradient-to-br from-[#012E72] to-[#002DB5] text-white'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.role === 'assistant' && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFeedbackByMessageIndex((prev) => ({
                          ...prev,
                          [index]: prev[index] === 'helpful' ? null : 'helpful',
                        }))
                      }
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        feedbackByMessageIndex[index] === 'helpful'
                          ? 'border-[#0f766e] bg-[#d1fae5] text-[#14532d]'
                          : 'border-[#d8cbb8] bg-white text-[#012E72]'
                      }`}
                    >
                      Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFeedbackByMessageIndex((prev) => ({
                          ...prev,
                          [index]: prev[index] === 'not-helpful' ? null : 'not-helpful',
                        }))
                      }
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        feedbackByMessageIndex[index] === 'not-helpful'
                          ? 'border-[#b91c1c] bg-[#fee2e2] text-[#7f1d1d]'
                          : 'border-[#d8cbb8] bg-white text-[#012E72]'
                      }`}
                    >
                      Not Helpful
                    </button>
                    {index === lastAssistantMessageIndex && isLowConfidenceReply(msg.text) && (
                      <button
                        type="button"
                        onClick={openContactSupport}
                        className="rounded-full border border-[#002DB5] bg-[#002DB5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
                      >
                        Contact Support
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="max-h-[42vh] overflow-y-auto border-t border-[#e7dccb] bg-white px-4 py-3 sm:max-h-[36vh]">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceMuted((value) => !value)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  isVoiceMuted
                    ? 'border-[#d8cbb8] bg-[#F7F4EF] text-[#012E72]'
                    : 'border-[#002DB5] bg-[#002DB5] text-white'
                }`}
              >
                {isVoiceMuted ? 'Voice Muted' : 'Voice On'}
              </button>
              <button
                type="button"
                onClick={handleCopyLatestReply}
                className="rounded-full border border-[#d8cbb8] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#012E72] hover:border-[#002DB5] hover:text-[#002DB5]"
              >
                {copiedReply ? 'Copied' : 'Copy Reply'}
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="rounded-full border border-[#d8cbb8] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#012E72] hover:border-[#002DB5] hover:text-[#002DB5]"
              >
                Clear Chat
              </button>
            </div>

            <div className="mb-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#012E72]">Quick prompts</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sampleQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleSampleQuestion(question)}
                    disabled={isLoading}
                    className="whitespace-nowrap rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-3 py-1.5 text-xs font-medium text-[#012E72] hover:border-[#002DB5] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2 grid grid-cols-[1fr_auto] gap-2">
              <button
                type="button"
                onClick={handleMicToggle}
                disabled={!canUseMic}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition ${
                  isListening
                    ? 'bg-gradient-to-r from-[#0f766e] to-[#0d9488]'
                    : micEnabled
                    ? 'bg-gradient-to-r from-[#002DB5] to-[#012E72]'
                    : 'bg-gradient-to-r from-[#012E72] to-[#002DB5]'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isListening ? 'Listening now...' : micEnabled ? 'Turn Mic Off' : 'Turn Mic On'}
              </button>
              <button
                type="button"
                onClick={() => setAutoListen((prev) => !prev)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                  autoListen
                    ? 'border-[#012E72] bg-[#012E72] text-white'
                    : 'border-[#d8cbb8] bg-[#F7F4EF] text-[#012E72]'
                }`}
              >
                {autoListen ? 'Auto On' : 'Auto Off'}
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Type your question"
                className="w-full rounded-xl border border-[#d8cbb8] bg-white px-3 py-2 text-sm text-[#010407] outline-none focus:border-[#002DB5]"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="rounded-xl bg-[#012E72] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#002DB5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        className="group relative rounded-full bg-gradient-to-r from-[#012E72] to-[#002DB5] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/25 transition hover:translate-y-[-1px] hover:from-[#002DB5] hover:to-[#012E72] sm:px-5"
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isListening ? 'animate-pulse bg-[#6ee7b7]' : 'bg-white/75'}`}
            aria-hidden="true"
          />
          {isOpen ? 'Hide Voice Assistant' : 'Open Voice Assistant'}
        </span>
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ff7f11] px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default VoiceChatWidget;
