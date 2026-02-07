import { useState, useEffect } from 'react';

export default function AIRecommendation({ response, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (response) {
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [response]);

  if (!response) return null;

  const intent = response.intent || 'unknown';
  const parsed = response.parsed;
  const message = response.ai_message || '';

  return (
    <div className={`ai-recommendation-panel ${visible ? 'visible' : ''}`}>
      <div className="ai-rec-header">
        <span className="ai-rec-badge">AI DISPATCH</span>
        <span className={`ai-rec-intent ${intent}`}>{intent.toUpperCase()}</span>
        <button className="ghost" onClick={onDismiss} style={{ marginLeft: 'auto', padding: '2px 8px' }}>X</button>
      </div>

      {parsed && intent === 'dispatch' && (
        <div className="ai-rec-body">
          <div className="ai-rec-row">
            <span className="ai-rec-label">Unit</span>
            <span className="ai-rec-value">{parsed.unit_name || parsed.unit_id}</span>
          </div>
          <div className="ai-rec-row">
            <span className="ai-rec-label">Target</span>
            <span className="ai-rec-value">{parsed.target_name || parsed.target_id}</span>
          </div>
          {parsed.distance_meters && (
            <div className="ai-rec-row">
              <span className="ai-rec-label">Distance</span>
              <span className="ai-rec-value">{(parsed.distance_meters / 1000).toFixed(1)} km</span>
            </div>
          )}
          {parsed.eta_seconds && (
            <div className="ai-rec-row">
              <span className="ai-rec-label">ETA</span>
              <span className="ai-rec-value">{Math.ceil(parsed.eta_seconds / 60)} min</span>
            </div>
          )}
          {parsed.reasoning && (
            <div className="ai-rec-reasoning">{parsed.reasoning}</div>
          )}
        </div>
      )}

      {parsed && intent === 'navigate' && (
        <div className="ai-rec-body">
          <div className="ai-rec-row">
            <span className="ai-rec-label">Location</span>
            <span className="ai-rec-value">{parsed.target_name}</span>
          </div>
        </div>
      )}

      {message && (
        <div className="ai-rec-message">{message}</div>
      )}
    </div>
  );
}
