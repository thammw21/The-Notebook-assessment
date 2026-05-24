import { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FONT_MAP = {
  mono: "'Courier New', Courier, monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Segoe UI', system-ui, sans-serif",
};

export default function App() {
  const {
    notes,
    activeNoteId,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotes();

  // 1. Setup panel and personalization state management
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('notebook_prefs');
    return saved ? JSON.parse(saved).theme : 'dark';
  });
  const [font, setFont] = useState<'mono' | 'serif' | 'sans'>(() => {
    const saved = localStorage.getItem('notebook_prefs');
    return saved ? JSON.parse(saved).font : 'mono';
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('notebook_prefs');
    return saved ? JSON.parse(saved).fontSize : 13;
  });

  // Find the currently active note
  const activeNote = notes.find((note) => note.id === activeNoteId);

  // Calculate word count and estimated reading time
  const wordCount = activeNote 
    ? activeNote.content.trim().split(/\s+/).filter(w => w.length > 0).length 
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute

  // 2. Sync preferences to the DOM and save to localStorage
  useEffect(() => {
    // Toggle theme classes
    document.body.classList.toggle('light', theme === 'light');
    
    // Set CSS variables for font size
    document.documentElement.style.setProperty('--editor-font-size', fontSize + 'px');
    document.documentElement.style.setProperty('--preview-font-size', (fontSize + 1) + 'px');
    
    // Save preferences locally
    localStorage.setItem('notebook_prefs', JSON.stringify({ theme, font, fontSize }));
  }, [theme, font, fontSize]);

  // Helper function to calculate relative time
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  // Helper function to handle downloading the markdown file
  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title || 'untitled'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="app">
      {/* PANEL 1: File Sidebar */}
      <aside id="sidebar">
        <div id="sidebar-header">
          <span id="logo">NOTEBOOK</span>
          <div className="header-actions">
            <button 
              id="settings-btn" 
              title="Settings"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              ⚙
            </button>
            <button id="new-file-btn" title="New file" onClick={createNote}>
              +
            </button>
          </div>
        </div>

        <ul id="file-list">
          {notes.map((note) => (
            <li
              key={note.id}
              className={note.id === activeNoteId ? 'active' : ''}
              onClick={() => setActiveNote(note.id)}
            >
              <span className="file-name">{note.title}.md</span>
              <span className="file-date">{timeAgo(note.lastModified)}</span>
            </li>
          ))}
        </ul>

        {/* Settings Drawer */}
        <div id="settings-drawer" className={isSettingsOpen ? 'open' : ''}>
          <div className="setting-row">
            <span className="setting-label">Theme</span>
            <div className="theme-toggle">
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">Editor Font</span>
            <div className="font-options">
              <button 
                className={`font-option ${font === 'mono' ? 'active' : ''}`}
                onClick={() => setFont('mono')}
              >
                Monospace
              </button>
              <button 
                className={`font-option ${font === 'serif' ? 'active' : ''}`}
                onClick={() => setFont('serif')}
              >
                Serif
              </button>
              <button 
                className={`font-option ${font === 'sans' ? 'active' : ''}`}
                onClick={() => setFont('sans')}
              >
                Sans-serif
              </button>
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">Font Size</span>
            <div className="slider-row">
              <input 
                type="range" 
                min="11" 
                max="20" 
                value={fontSize} 
                step="1" 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
              <span className="slider-val">{fontSize}px</span>
            </div>
          </div>
        </div>
      </aside>

      {activeNote ? (
        <>
          {/* PANEL 2: Markdown Editor */}
          <section id="editor-panel">
            <div className="panel-header">
              <span className="panel-dot"></span>
              <span className="panel-label">Editor</span>
              <button 
                title="Download as .md"
                onClick={handleDownload}
                style={{ background: 'transparent', border: '1px solid var(--text-faint)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.06em', marginRight: '6px' }}
              >
                Download
              </button>
              <button 
                id="delete-file-btn" 
                title="Delete this file"
                onClick={() => {
                  if (window.confirm(`Delete "${activeNote.title}"?`)) {
                    deleteNote(activeNote.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
            
            <textarea
              id="editor"
              placeholder="Start writing Markdown here..."
              spellCheck={false}
              style={{ fontFamily: FONT_MAP[font] }}
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, e.target.value)}
            />
            
            {/* Status Bar */}
            <div style={{ padding: '8px 18px', borderTop: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-panel)' }}>
              <span>{wordCount} words</span>
              <span>~{readingTime} min read</span>
            </div>
          </section>

          {/* PANEL 3: Live Preview */}
          <section id="preview-panel">
            <div className="panel-header">
              <span className="panel-dot faded"></span>
              <span className="panel-label">Preview</span>
            </div>
            <div 
              id="preview" 
              className={!activeNote.content.trim() ? 'empty' : ''}
              style={{ fontFamily: FONT_MAP[font] }}
            >
              {activeNote.content.trim() && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeNote.content}
                </ReactMarkdown>
              )}
            </div>
          </section>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Please select or create a file.</p>
        </div>
      )}
    </div>
  );
}