export default function IncidentReport({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-header">
          <h2>{report.title || 'Incident Report'}</h2>
          <button className="ghost" onClick={onClose}>X</button>
        </div>

        <div className="report-meta">
          <span className="pill">{report.status || 'preliminary'}</span>
          {report.generated_at && (
            <span className="small">Generated: {new Date(report.generated_at).toLocaleString()}</span>
          )}
        </div>

        {report.narrative && (
          <div className="report-section">
            <h3>Narrative</h3>
            <p>{report.narrative}</p>
          </div>
        )}

        {report.timeline?.length > 0 && (
          <div className="report-section">
            <h3>Timeline</h3>
            <div className="report-timeline">
              {report.timeline.map((entry, i) => (
                <div key={i} className="timeline-entry">
                  <span className="timeline-time">{entry.time}</span>
                  <span className="timeline-event">{entry.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.units_involved?.length > 0 && (
          <div className="report-section">
            <h3>Units Involved</h3>
            <div className="report-units">
              {report.units_involved.map((u, i) => (
                <span key={i} className="pill">{u}</span>
              ))}
            </div>
          </div>
        )}

        {report.evidence_notes && (
          <div className="report-section">
            <h3>Evidence Notes</h3>
            <p>{report.evidence_notes}</p>
          </div>
        )}

        {report.recommendations?.length > 0 && (
          <div className="report-section">
            <h3>Recommendations</h3>
            <ul>
              {report.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
