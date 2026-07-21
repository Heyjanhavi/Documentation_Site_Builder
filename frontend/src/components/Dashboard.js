import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Clock } from 'lucide-react';

export default function Dashboard({ pages, loading, onNewPage, onDeletePage }) {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">All your documentation pages in one place.</p>
        </div>
        <button className="btn-primary" onClick={onNewPage}>
          <Plus size={16} /> New Page
        </button>
      </div>

      {loading && <div className="loading-state">Loading pages...</div>}

      {!loading && pages.length === 0 && (
        <div className="empty-state">
          <FileText size={40} strokeWidth={1.5} />
          <h3>No pages yet</h3>
          <p>Create your first documentation page to get started.</p>
          <button className="btn-primary" onClick={onNewPage}><Plus size={16} /> New Page</button>
        </div>
      )}

      <div className="card-grid">
        {pages.map(page => (
          <div key={page.id} className="doc-card" onClick={() => navigate(`/editor/${page.id}`)}>
            <div className="doc-card-icon"><FileText size={18} /></div>
            <div className="doc-card-body">
              <h3>{page.title || 'Untitled'}</h3>
              <p>{(page.content || '').replace(/[#*`>_-]/g, '').slice(0, 90) || 'No content yet'}...</p>
            </div>
            <div className="doc-card-footer">
              <span className="doc-card-meta"><Clock size={12} /> v{page.version}</span>
              <button
                className="icon-btn-delete"
                onClick={(e) => { e.stopPropagation(); onDeletePage(page.id); }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
