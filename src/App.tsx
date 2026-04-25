import { useState, useEffect, useRef } from 'react';
import { useMarkdown } from './hooks/useMarkdown';
import Prism from 'prismjs';

// Themes (Importing some common languages for Prism)
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';

const initialMarkdown = `# Markdown Pro Editor 🚀

Welcome to your professional workspace. This tool is designed for speed, security, and high-quality documentation.

## Quick Start
1. **Type** in the left pane.
2. **Preview** in the right pane.
3. **Download** your work as a \`.md\` file.

### Advanced Features
- **Code Highlighting:** 
  \`\`\`javascript
  console.log("Syntax highlighting is active!");
  \`\`\`
- **Tables:** Fully supported.
- **XSS Protection:** Your preview is sanitized for safety.

> "The best way to predict the future is to invent it." – Alan Kay

Ready to start? Clear this editor and begin your masterpiece.
`;

function App() {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem('md-pro-content');
    return saved || initialMarkdown;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('md-pro-theme') as 'light' | 'dark') || 'light';
  });
  const [fileName, setFileName] = useState('document');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { html } = useMarkdown(markdown);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = {
    words: markdown.trim() === "" ? 0 : markdown.trim().split(/\s+/).length,
    chars: markdown.length
  };

  useEffect(() => {
    localStorage.setItem('md-pro-content', markdown);
    localStorage.setItem('md-pro-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [markdown, theme]);

  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const insertMarkdown = (prefix: string, suffix: string = '', defaultValue: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end) || defaultValue;
    const before = markdown.substring(0, start);
    const after = markdown.substring(end);

    const newText = before + prefix + selectedText + suffix + after;
    setMarkdown(newText);

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    alert('HTML copied to clipboard!');
    setIsExportOpen(false);
  };

  const clearEditor = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
    }
    setIsExportOpen(false);
  };

  return (
    <div className="app-container">
      <header>
        <div className="header-left">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary-color)">
            <path d="M3 3H21C22.5523 3 23 3.44772 23 4V20C23 20.5523 22.5523 21 22 21H2C1.44772 21 1 20.5523 1 20V4C1 3.44772 1.44772 3 2 3ZM3 5V19H21V5H3ZM6 7H11V10H13V7H18V17H13V14H11V17H6V7ZM14 12V16H17V12H14ZM7 12V16H10V12H7Z"/>
          </svg>
          <div className="filename-container">
            <span className="label">Project Name</span>
            <div className="input-wrapper">
              <input 
                type="text" 
                value={fileName}
                onChange={(e) => setFileName(e.target.value.replace(/[^a-z0-9-_]/gi, '-'))}
                onFocus={(e) => e.target.select()}
                placeholder="document"
              />
              <span className="ext">.md</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="mobile-view-toggle">
            <button onClick={() => setView('edit')} className={view === 'edit' ? 'active' : ''}>Edit</button>
            <button onClick={() => setView('preview')} className={view === 'preview' ? 'active' : ''}>Preview</button>
          </div>
          <a href="docs.html" className="btn btn-ghost" title="Masterclass Guide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </a>
          <button className="btn btn-ghost theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
          
          <div className="export-dropdown">
            <button 
              className={`btn ${isExportOpen ? 'btn-active' : 'btn-primary'}`} 
              onClick={() => setIsExportOpen(!isExportOpen)}
            >
              Export
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', transform: isExportOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {isExportOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setIsExportOpen(false)} />
                <div className="dropdown-menu">
                  <button onClick={handleDownload}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download .md
                  </button>
                  <button onClick={copyHtml}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    Copy HTML
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={clearEditor} style={{ color: '#ff4d4d' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={`main-content view-${view}`}>
        <section className="pane editor-pane">
          <div className="pane-header">
            <span>Editor</span>
            <div className="stats">
              <span>{stats.words} words</span>
              <span className="dot"></span>
              <span>{stats.chars} chars</span>
            </div>
          </div>
          
          <div className="toolbar">
            <button onClick={() => insertMarkdown('**', '**', 'bold text')} title="Bold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
              Bold
            </button>
            <button onClick={() => insertMarkdown('_', '_', 'italic text')} title="Italic">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
              Italic
            </button>
            <button onClick={() => insertMarkdown('`', '`', 'code')} title="Inline Code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Code
            </button>
            <button onClick={() => insertMarkdown('```\n', '\n```', 'code block')} title="Code Block">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="7" y1="8" x2="17" y2="8"></line><line x1="7" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="12" y2="16"></line></svg>
              Block
            </button>
            <div className="divider"></div>
            <button onClick={() => insertMarkdown('# ', '', 'Heading 1')} title="H1">H1</button>
            <button onClick={() => insertMarkdown('## ', '', 'Heading 2')} title="H2">H2</button>
            <div className="divider"></div>
            <button onClick={() => insertMarkdown('- ', '', 'list item')} title="List">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              List
            </button>
            <button onClick={() => insertMarkdown('> ', '', 'quote')} title="Quote">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Quote
            </button>
            <button onClick={() => insertMarkdown('[', '](https://example.com)', 'link text')} title="Link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              Link
            </button>
            <button onClick={() => insertMarkdown('| Header | Header |\n| :--- | :--- |\n| Cell | Cell |', '', '')} title="Table">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
              Table
            </button>
            <button onClick={() => insertMarkdown('~~', '~~', 'strikethrough')} title="Strikethrough">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"></path><path d="M8 2h8"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              Strike
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            placeholder="Start writing..."
            autoFocus
          />
        </section>

        <section className="pane preview-pane">
          <div className="pane-header">Preview</div>
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />
        </section>
      </main>
    </div>
  );
}

export default App;
