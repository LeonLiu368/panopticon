import { useEffect, useRef, useState } from 'react';

// Browser SpeechRecognition is fast and free; falls back to manual note entry.
export default function TranscriptRecorder({ onNavigate }) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [entries, setEntries] = useState([]);

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

  const handleCommand = (text) => {
    const lower = text.toLowerCase();
    const match = lower.match(/navigate to (.+)/);
    if (match && onNavigate) {
      const target = match[1].trim();
      onNavigate(target);
    }
  };

  const saveEntry = () => {
    if (!transcript) return;
    setEntries((e) => [{ id: crypto.randomUUID(), text: transcript, at: new Date() }, ...e]);
    handleCommand(transcript);
    setTranscript('');
    setListening(false);
    recognitionRef.current?.stop();
  };

  return (
    <div className="dashboard-card" style={{ marginTop: 12 }}>
      <div className="section-title">
        <strong>Incident Transcript Recorder</strong>
        {supported ? (
          <button className={listening ? 'primary' : 'ghost'} onClick={toggle}>
            {listening ? 'Stop & Save' : 'Start Recording'}
          </button>
        ) : (
          <span className="pill">Speech API unavailable</span>
        )}
      </div>
      {supported && (
        <>
          <div className="input-group">
            <label>Live transcript</label>
            <textarea rows={3} value={transcript} onChange={(e) => setTranscript(e.target.value)} />
          </div>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <div className="small">Uses browser SpeechRecognition (fast & free)</div>
            <button className="ghost" onClick={saveEntry} disabled={!transcript}>Save note</button>
          </div>
        </>
      )}
      {entries.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div className="small">Saved notes</div>
          {entries.map((e) => (
            <div key={e.id} className="marker-item" style={{ marginTop: 6 }}>
              <div>
                <strong>{e.at.toLocaleTimeString()}</strong>
                <div className="small">{e.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
