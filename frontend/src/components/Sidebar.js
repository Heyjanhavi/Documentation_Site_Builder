import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Plus, Search, UploadCloud, BookOpen, Trash2 } from 'lucide-react';

export default function Sidebar({ pages, onNewPage, onDeletePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BookOpen size={22} strokeWidth={2.2} />
        <span>DocFlow</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FileText size={16} /> Dashboard
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Search size={16} /> Search
        </NavLink>
        <NavLink to="/publish" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <UploadCloud size={16} /> Publish
        </NavLink>
      </nav>

      <button className="btn-new-page" onClick={onNewPage}>
        <Plus size={16} /> New Page
      </button>

      <div className="sidebar-pages">
        <div className="sidebar-pages-label">Pages</div>
        {pages.length === 0 && <div className="sidebar-empty">No pages yet</div>}
        {pages.map(page => (
          <div key={page.id} className="sidebar-page-row">
            <NavLink to={`/editor/${page.id}`} className={({ isActive }) => isActive ? 'sidebar-page active' : 'sidebar-page'}>
              {page.title || 'Untitled'}
            </NavLink>
            <button className="icon-btn-delete" title="Delete page" onClick={() => onDeletePage(page.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
