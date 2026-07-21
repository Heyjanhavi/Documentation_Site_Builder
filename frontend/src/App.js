import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import SearchPage from './components/SearchPage';
import Publish from './components/Publish';
import { PagesAPI } from './api/client';

function AppShell() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshPages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PagesAPI.getAll();
      setPages(data);
      setError(null);
    } catch (e) {
      setError('Could not reach the backend. Is Spring Boot running on port 8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPages();
  }, [refreshPages]);

  const handleCreatePage = async () => {
    const newPage = await PagesAPI.create({ title: 'Untitled Page', content: '# Untitled Page\n\nStart writing...' });
    await refreshPages();
    navigate(`/editor/${newPage.id}`);
  };

  const handleDeletePage = async (id) => {
    await PagesAPI.remove(id);
    await refreshPages();
  };

  return (
    <div className="app-shell">
      <Sidebar pages={pages} onNewPage={handleCreatePage} onDeletePage={handleDeletePage} />
      <main className="main-content">
        {error && <div className="error-banner">{error}</div>}
        <Routes>
          <Route path="/" element={<Dashboard pages={pages} loading={loading} onNewPage={handleCreatePage} onDeletePage={handleDeletePage} />} />
          <Route path="/editor/:id" element={<Editor onSaved={refreshPages} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/publish" element={<Publish pageCount={pages.length} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
