import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Check } from 'lucide-react';
import { PagesAPI } from '../api/client';

export default function Editor({ onSaved }) {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const debounceRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    PagesAPI.getById(id).then(page => {
      if (cancelled) return;
      setTitle(page.title || '');
      setContent(page.content || '');
    });
    return () => { cancelled = true; };
  }, [id]);

  const persist = useCallback((newTitle, newContent) => {
    setSaveState('saving');
    PagesAPI.update(id, { title: newTitle, content: newContent }).then(() => {
      setSaveState('saved');
      onSaved && onSaved();
      setTimeout(() => setSaveState('idle'), 1200);
    });
  }, [id, onSaved]);

  const scheduleSave = (newTitle, newContent) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist(newTitle, newContent), 600);
  };

  const handleTitleChange = (e) => {
    const v = e.target.value;
    setTitle(v);
    scheduleSave(v, content);
  };

  const handleContentChange = (e) => {
    const v = e.target.value;
    setContent(v);
    scheduleSave(title, v);
  };

  return (
    <div className="editor-container">
      <div className="editor-titlebar">
        <input
          className="editor-title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Page title"
        />
        <div className={`save-indicator ${saveState}`}>
          {saveState === 'saving' && <><Save size={13} /> Saving...</>}
          {saveState === 'saved' && <><Check size={13} /> Saved</>}
        </div>
      </div>

      <div className="editor-split">
        <div className="editor-pane">
          <div className="pane-label">Markdown</div>
          <textarea
            className="markdown-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="# Start writing your documentation in Markdown..."
            spellCheck={false}
          />
        </div>
        <div className="preview-pane">
          <div className="pane-label">Preview</div>
          <div className="markdown-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
