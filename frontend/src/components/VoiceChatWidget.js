import React, { useEffect, useMemo, useRef, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const AGORA_DEFAULT_CHANNEL = process.env.REACT_APP_AGORA_CHANNEL || 'paladin-voice';

function VoiceChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [autoListen, setAutoListen] = useState(false);
  const [isAgoraConnected, setIsAgoraConnected] = useState(false);
  const [isAgoraConnecting, setIsAgoraConnecting] = useState(false);
  const [status, setStatus] = useState('Tap the mic and ask your question.');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I am your Paladin voice assistant. Ask me anything about insurance support and services.',
    },
  ]);

  const recognitionRef = useRef(null);
  const recognitionRestartTimerRef = useRef(null);
  const voiceFinalizeTimerRef = useRef(null);
  const voiceBufferRef = useRef('');
  const interimBufferRef = useRef('');
  const lastVoiceMessageRef = useRef({ text: '', at: 0 });
  const speechVoicesRef = useRef([]);
  const preferredVoiceRef = useRef(null);
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

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

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
    if (!isOpen || isAgoraConnected || isAgoraConnecting) {
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

  const speak = (text) => {
    if (!('speechSynthesis' in window) || !text) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      if (preferredVoiceRef.current) {
        utterance.voice = preferredVoiceRef.current;
      }

      const finalize = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onend = finalize;
      utterance.onerror = finalize;
      window.speechSynthesis.speak(utterance);
    });
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

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section className="mb-3 w-[320px] max-w-[90vw] rounded-2xl border border-[#d8cbb8] bg-white shadow-xl">
          <header className="flex items-center justify-between rounded-t-2xl bg-[#012E72] px-4 py-3 text-white">
            <h2 className="text-sm font-semibold">Paladin Voice Assistant</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-xs hover:bg-white/20"
            >
              Close
            </button>
          </header>

          <div className="h-64 space-y-2 overflow-y-auto px-3 py-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  msg.role === 'assistant'
                    ? 'bg-[#f7f4ef] text-[#010407]'
                    : 'ml-auto bg-[#012E72] text-white'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t border-[#ece5da] px-3 py-3">
            <p className="mb-2 text-xs text-[#012E72]">{status}</p>

            <div className="mb-2 flex flex-wrap gap-2">
              {sampleQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSampleQuestion(question)}
                  disabled={isLoading}
                  className="rounded-full border border-[#d8cbb8] px-3 py-1 text-xs text-[#012E72] hover:border-[#012E72] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={handleMicToggle}
                disabled={!supportsSpeechRecognition || isLoading || isSpeaking}
                className="flex-1 rounded-lg bg-[#012E72] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isListening ? 'Listening...' : micEnabled ? 'Turn Mic Off' : 'Turn Mic On'}
              </button>
              <button
                type="button"
                onClick={() => setAutoListen((prev) => !prev)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                  autoListen
                    ? 'border-[#012E72] bg-[#012E72] text-white'
                    : 'border-[#012E72] text-[#012E72]'
                }`}
              >
                {autoListen ? 'Auto-Listen On' : 'Auto-Listen Off'}
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Or type your question"
                className="w-full rounded-lg border border-[#d8cbb8] px-3 py-2 text-sm outline-none focus:border-[#012E72]"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="rounded-lg border border-[#012E72] px-3 py-2 text-xs font-semibold text-[#012E72] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full bg-[#012E72] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#002DB5]"
      >
        {isOpen ? 'Hide AI Chat' : 'Voice AI Chat'}
      </button>
    </div>
  );
}

export default VoiceChatWidget;
