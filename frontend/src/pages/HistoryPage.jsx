import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, Trash2, Eye, Download, Search, Filter, AlertCircle, FileCode } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      if (res.success) {
        setHistory(res.history);
      }
    } catch (err) {
      setError('Failed to fetch analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      const res = await api.delete(`/user/history/${id}`);
      if (res.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
        if (selectedRecord?.id === id) setSelectedRecord(null);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindpulse_ai_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.input_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '6px', borderRadius: '8px', color: 'var(--accent-cyan)' }}>
              <History size={20} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Analysis History</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Review, inspect, or export your saved AI prediction records.</p>
        </div>

        <button onClick={handleExportJSON} className="btn-secondary" disabled={history.length === 0}>
          <Download size={16} /> Export JSON Data
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search input keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
        </div>

        <div style={{ minWidth: '200px' }}>
          <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Analysis Types</option>
            <option value="sentiment">Sentiment & Emotion</option>
            <option value="summarizer">Summaries</option>
            <option value="skill_match">Skill Matches</option>
          </select>
        </div>

      </div>

      {/* Main Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading AI prediction history...</div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No analysis records match your query.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Input Content Preview</th>
                <th>Result Summary</th>
                <th>Date Saved</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className={`badge ${item.type === 'sentiment' ? 'badge-positive' : item.type === 'skill_match' ? 'badge-purple' : 'badge-neutral'}`}>
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.input_text}
                    </div>
                  </td>
                  <td>
                    {item.type === 'sentiment' && (
                      <span style={{ fontWeight: 600, color: item.sentiment_label === 'Positive' ? 'var(--accent-emerald)' : item.sentiment_label === 'Negative' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                        {item.sentiment_label} ({Math.round(item.sentiment_score * 100)}%)
                      </span>
                    )}
                    {item.type === 'skill_match' && (
                      <span style={{ fontWeight: 600, color: '#b388ff' }}>
                        Match: {item.match_score}%
                      </span>
                    )}
                    {item.type === 'summarizer' && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Compressed summary
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setSelectedRecord(item)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} title="View Details">
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '6px 10px' }} title="Delete Record">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Detail Viewer */}
      {selectedRecord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto', padding: '28px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCode size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Record Detail #{selectedRecord.id}</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary" style={{ padding: '4px 10px' }}>
                ✕ Close
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Original Input Text</label>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {selectedRecord.input_text}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Result JSON Payload</label>
              <pre style={{ background: 'rgba(10,13,24,0.95)', padding: '16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                {JSON.stringify(selectedRecord.result_json, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
