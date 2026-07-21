import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, FileText } from 'lucide-react';
import { SearchAPI } from '../api/client';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const data = await SearchAPI.search(query.trim());
      setResults(data);
      setSearched(true);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="search-container">
      <div className="search-box">
        <SearchIcon size={20} />
        <input
          ref={inputRef}
          className="search-input"
          placeholder="Search across all documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!searched && (
        <div className="search-hint">Search titles and full page content — results update as you type.</div>
      )}

      {searched && results.length === 0 && (
        <div className="empty-state">
          <SearchIcon size={36} strokeWidth={1.5} />
          <h3>No results for "{query}"</h3>
          <p>Try a different keyword.</p>
        </div>
      )}

      <div className="search-results">
        {results.map(r => (
          <div key={r.pageId} className="search-result-card" onClick={() => navigate(`/editor/${r.pageId}`)}>
            <div className="search-result-title"><FileText size={15} /> {r.title}</div>
            <div className="search-result-snippet">{r.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
