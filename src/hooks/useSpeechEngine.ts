import { useState, useEffect, useCallback, useRef } from 'react';

export type SpeechState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface SpeechEngineOptions {
  language: string;
  onFinalTranscript: (transcript: string) => void;
}

export function useSpeechEngine({ language, onFinalTranscript }: SpeechEngineOptions) {
  const [state, setState] = useState<SpeechState>('IDLE');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef<any>(null);
  const onFinalRef = useRef(onFinalTranscript);
  const executedRef = useRef(false); // guard against double-execution

  // Always keep the callback ref current — avoids stale closure
  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState('ERROR');
      setErrorMsg('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setState('LISTENING');
      setInterimTranscript('');
      setErrorMsg('');
      executedRef.current = false;
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        // We have a FINAL result — execute immediately, do NOT wait for onend
        const normalized = finalText.trim();
        if (normalized && !executedRef.current) {
          executedRef.current = true;
          setInterimTranscript(normalized); // show for UI
          setState('PROCESSING');
          // Execute via ref — always fresh, never stale
          onFinalRef.current(normalized);
        }
      } else if (interimText) {
        // Interim only — show in UI, do NOT execute
        setInterimTranscript(interimText.trim());
      }
    };

    recognition.onerror = (event: any) => {
      const msg =
        event.error === 'not-allowed'
          ? 'Microphone access denied. Please allow microphone permissions.'
          : event.error === 'no-speech'
          ? 'No speech detected. Please try again.'
          : event.error === 'network'
          ? 'Network error during speech recognition.'
          : `Speech error: ${event.error}`;
      setState('ERROR');
      setErrorMsg(msg);
    };

    recognition.onend = () => {
      // Only go IDLE if we haven't already moved to PROCESSING/SUCCESS
      setState(prev => (prev === 'LISTENING' ? 'IDLE' : prev));
    };

    return () => {
      recognition.abort();
    };
  }, []); // Only run once

  // Update recognition language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && state !== 'LISTENING') {
      try {
        executedRef.current = false;
        setInterimTranscript('');
        setErrorMsg('');
        recognitionRef.current.start();
      } catch {
        // Already started — ignore
      }
    }
  }, [state]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state === 'LISTENING') {
      recognitionRef.current.stop();
    }
  }, [state]);

  return {
    state,
    setState,
    transcript: interimTranscript,
    errorMsg,
    startListening,
    stopListening,
  };
}
