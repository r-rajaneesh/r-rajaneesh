import React, { useState } from 'react';
import type { Config } from '../data/schema';
import { ConfigSchema } from '../data/schema';

interface Props {
  initialConfig: Config;
}

export default function AdminDashboard({ initialConfig }: Props) {
  const [json, setJson] = useState(JSON.stringify(initialConfig, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(json);
      const validated = ConfigSchema.safeParse(parsed);

      if (!validated.success) {
        setError(validated.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n'));
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated.data),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save to database. Check server logs.');
      }
    } catch (e) {
      setError('Invalid JSON format.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header glass-card">
        <div className="container">
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="actions">
              <a href="/" className="btn secondary small">View Site</a>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className={`btn primary small ${saving ? 'loading' : ''}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="editor-section">
          <div className="editor-header">
            <h3>Configuration JSON</h3>
            <p>Modify your portfolio data directly. Changes are validated against the schema before saving.</p>
          </div>
          
          <div className="editor-wrapper glass-card">
            <textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              spellCheck={false}
              className={error ? 'has-error' : ''}
            />
          </div>

          {error && (
            <div className="error-box reveal">
              <h4>Validation Error</h4>
              <pre>{error}</pre>
            </div>
          )}

          {success && (
            <div className="success-toast">
              Config updated successfully!
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-container {
          min-height: 100vh;
          background-color: var(--bg-secondary);
          padding-bottom: 5rem;
        }
        .admin-header {
          padding: 1rem 0;
          margin-bottom: 3rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .actions {
          display: flex;
          gap: 1rem;
        }
        .editor-section {
          max-width: 1000px;
          margin: 0 auto;
        }
        .editor-header {
          margin-bottom: 2rem;
        }
        .editor-wrapper {
          height: 600px;
          padding: 0;
          overflow: hidden;
        }
        textarea {
          width: 100%;
          height: 100%;
          padding: 2rem;
          border: none;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
          resize: none;
          outline: none;
        }
        textarea.has-error {
          border-left: 4px solid #dc2626;
        }
        .error-box {
          margin-top: 2rem;
          padding: 2rem;
          background: #fef2f2;
          border: 2px solid #dc2626;
          color: #dc2626;
        }
        .error-box pre {
          margin-top: 1rem;
          font-family: monospace;
          white-space: pre-wrap;
        }
        .success-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--accent);
          color: white;
          padding: 1rem 2rem;
          box-shadow: 8px 8px 0px var(--border);
          animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
