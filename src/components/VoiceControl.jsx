import { useEffect, useRef, useState } from 'react';

const normalizeNumberPair = (str) => {
  const nums = str.match(/-?\d+\.\d+/g);
  if (!nums || nums.length < 2) return null;
  return { lat: Number(nums[0]), lng: Number(nums[1]) };
};

const parseCommand = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('add') && lower.includes('marker')) {
    const coords = normalizeNumberPair(lower);
    return { type: 'addMarker', label: 'Voice', coords, priority: lower.includes('high') ? 'high' : 'medium' };
  }
  if (lower.includes('delete') || lower.includes('remove marker')) {
    const targetId = lower.match(/marker (\w{6,})/i)?.[1];
    return { type: 'removeMarker', targetId };
  }
  if (lower.includes('navigate') || lower.includes('route')) {
    const coords = normalizeNumberPair(lower);
    return { type: 'navigate', coords };
  }
  return null;
};

export default function VoiceControl({ onCommand }) {
  const recognitionRef = useRef(null);
  const onCommandRef = useRef(onCommand);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  // Keep callback ref in sync without re-creating recognition
  useEffect(() => { onCommandRef.current = onCommand; }, [onCommand]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      setLastTranscript(transcript);
      const action = parseCommand(transcript);
      if (action && onCommandRef.current) onCommandRef.current(action);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => { recognition.stop(); };
  }, []);

  const toggleListening = () => {
    if (!supported) return;
    if (!listening) {
      setLastTranscript('');
      recognitionRef.current?.start();
      setListening(true);
    } else {
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  if (!supported) return <span className="pill">Voice unsupported in this browser</span>;

  return (
    <button className={listening ? 'primary' : 'ghost'} onClick={toggleListening}>
      {listening ? 'Listening…' : 'Voice Control'}
      {lastTranscript && (
        <span className="small" style={{ display: 'block' }}>"{lastTranscript}"</span>
      )}
    </button>
  );
}
