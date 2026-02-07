import { useEffect, useRef, useState } from 'react';
import { parseVoiceCommand } from '../services/api';

// Browser SpeechRecognition is fast and free; falls back to manual note entry.
export default function TranscriptRecorder({ onNavigate, onDispatchCommand, onAIResponse, units, crimeZones, markers, aiEnabled = true }) {
  const recognitionRef = useRef(null);
  const downRef = useRef(false);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [entries, setEntries] = useState([]);
  const [aiLoading, setAILoading] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onresult = (event) => {
      let full = '';
      for (const res of event.results) full += res[0].transcript + ' ';
      setTranscript(full.trim());
    };

    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
  }, []);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (!listening) {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
    }
  };

  const handleCommandAI = async (text) => {
    setAILoading(true);
    try {
      const result = await parseVoiceCommand(text, units || [], crimeZones || [], markers || []);
      if (onAIResponse) onAIResponse(result);

      if (result.intent === 'navigate' && result.parsed && onNavigate) {
        onNavigate(result.parsed.target_name);
      } else if (result.intent === 'dispatch' && result.parsed && onDispatchCommand) {
        onDispatchCommand({
          unit: result.parsed.unit_name,
          crime: result.parsed.target_name,
          unitId: result.parsed.unit_id,
          targetId: result.parsed.target_id,
          targetType: result.parsed.target_type || 'crime',
          aiMessage: result.ai_message,
        });
      }
    } catch {
      // Fallback to regex parsing if AI server is down
      handleCommandFallback(text);
    } finally {
      setAILoading(false);
    }
  };

  const handleCommandFallback = (text) => {
    const lower = text.toLowerCase();
    const navMatch = lower.match(/(?:navigate|go) to (.+)/);
    if (navMatch && onNavigate) {
      onNavigate(navMatch[1].trim());
    }
    const dispatchMatch = lower.match(/(?:dispatch|send)\s+(.+?)\s+to\s+(.+)/);
    if (dispatchMatch && onDispatchCommand) {
      onDispatchCommand({ unit: dispatchMatch[1].trim(), crime: dispatchMatch[2].trim() });
    }
  };

  const saveEntry = () => {
    if (!transcript) return;
    setEntries((e) => [{ id: crypto.randomUUID(), text: transcript, at: new Date() }, ...e]);
    if (aiEnabled) {
      handleCommandAI(transcript);
    } else {
      handleCommandFallback(transcript);
    }
    setTranscript('');
    setListening(false);
    recognitionRef.current?.stop();
  };

  // Spacebar PTT: hold space to listen, release to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.code === 'Space' && !downRef.current) {
        downRef.current = true;
        e.preventDefault();
        if (!listening) {
          setTranscript('');
          recognitionRef.current?.start();
          setListening(true);
        }
      }
    };
    const handleKeyUp = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.code === 'Space' && downRef.current) {
        e.preventDefault();
        downRef.current = false;
        if (listening) {
          recognitionRef.current?.stop();
          setListening(false);
          // allow any final result event to land
          setTimeout(() => {
            if (transcript.trim()) saveEntry();
          }, 120);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [listening, transcript]);

  const expanded = listening || transcript.length > 0 || aiLoading;

  return (
    <div className={`voice-fab mic ${expanded ? 'expanded' : ''}`}>
      {supported ? (
        <button
          className={`mic-button ${listening ? 'live' : ''} ${aiLoading ? 'ai-loading' : ''}`}
          onClick={toggle}
          title="Hold SPACE or click — AI-powered dispatch"
          aria-label="Microphone voice control"
        >
          {aiLoading ? (
            <svg width="22" height="22" viewBox="0 0 24 24" className="ai-spinner">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#00b4ff" strokeWidth="2" strokeDasharray="31.4 31.4" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14c1.66 0 3-1.34 3-3V6a3 3 0 1 0-6 0v5c0 1.66 1.34 3 3 3Z" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 11v1a6 6 0 0 0 12 0v-1" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19v3" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 22h8" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      ) : (
        <span className="pill">Speech API unavailable</span>
      )}
      {supported && expanded && (
        <div className="voice-fab-panel">
          <div className="small" style={{ marginBottom: 6 }}>
            {aiLoading ? 'AI analyzing command...' : aiEnabled ? 'Say any command — AI-powered dispatch' : 'Say "dispatch [unit] to [zone]" or "go to [location]"'}
          </div>
          <textarea rows={2} value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          <div className="voice-footer" style={{ marginTop: 6 }}>
            <div className="small">{aiEnabled ? 'Dedalus AI + Multi-model' : 'Regex mode (AI off)'}</div>
            <button className="ghost" onClick={saveEntry} disabled={!transcript || aiLoading}>
              {aiLoading ? 'Processing...' : 'Apply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
