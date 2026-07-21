import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Download, History } from 'lucide-react';
import { PublishAPI } from '../api/client';

export default function Publish({ pageCount }) {
  const [history, setHistory] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const loadHistory = async () => {
    const data = await PublishAPI.history();
    setHistory(data);
  };

  useEffect(() => { loadHistory(); }, []);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await PublishAPI.publish();
      setLastResult(result);
      await loadHistory();
    } finally {
      setPublishing(false);
    }
  };

  const currentVersion = history.length > 0 ? history[0].version : 0;

  const handleExport = () => {
    // Simple client-side JSON export of the version history / snapshot as a stand-in
    // for a full static site generator.
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docflow-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Publish</h1>
          <p className="page-subtitle">Publish a new version of your documentation site.</p>
        </div>
      </div>

      <div className="publish-panel">
        <div className="publish-stat">
          <span className="publish-stat-label">Current Version</span>
          <span className="publish-stat-value">v{currentVersion}</span>
        </div>
        <div className="publish-stat">
          <span className="publish-stat-label">Pages Ready</span>
          <span className="publish-stat-value">{pageCount}</span>
        </div>

        <div className="publish-actions">
          <button className="btn-primary" onClick={handlePublish} disabled={publishing}>
            <UploadCloud size={16} /> {publishing ? 'Publishing...' : 'Publish'}
          </button>
          <button className="btn-secondary" onClick={handleExport} disabled={history.length === 0}>
            <Download size={16} /> Download
          </button>
        </div>

        {lastResult && (
          <div className="publish-success">
            <CheckCircle2 size={16} /> {lastResult.message}
          </div>
        )}
      </div>

      <div className="publish-history">
        <div className="publish-history-label"><History size={14} /> Version History</div>
        {history.length === 0 && <div className="sidebar-empty">No versions published yet.</div>}
        {history.map(v => (
          <div key={v.id} className="publish-history-row">
            <span className="version-badge">v{v.version}</span>
            <span>{v.pageCount} pages</span>
            <span className="publish-date">{new Date(v.publishedDate).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
