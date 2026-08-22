import React, { useState } from 'react';
import api from '../services/api';
import { Brain, FileText, Sparkles, AlertCircle, CheckCircle2, Copy, BarChart2, Clock, Tag } from 'lucide-react';

export default function AIAnalyzer() {
  const [activeTab, setActiveTab] = useState('sentiment');
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleTexts = {
    sentimentPositive: "MindPulse AI is an exceptionally intuitive, powerful, and fast platform! The local machine learning analysis yields remarkably accurate sentiment scores without any cloud API latency.",
    sentimentNegative: "The server deployment process was terribly slow, confusing, and full of unexpected error crashes. Extremely frustrating experience.",
    summarizerText: "Artificial intelligence and local natural language processing (NLP) models are fundamentally transforming modern web application architecture. By running sentiment analysis, entity extraction, and text summarization locally inside Node.js execution environments, developers can eliminate expensive third-party API subscription costs, safeguard sensitive user privacy data, and guarantee sub-millisecond response latency."
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!text || text.trim().length < 5) {
      setError('Please enter at least 5 characters of text to analyze.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = activeTab === 'sentiment' ? '/ai/sentiment' : '/ai/summarize';
      const body = activeTab === 'sentiment' ? { text } : { text, sentences };
      
      const res = await api.post(endpoint, body);
      if (res.success) {
        setResult(res.result);
      }
    } catch (err) {
      setError(err.message || 'AI Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(typeof content === 'object' ? JSON.stringify(content, null, 2) : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '6px', borderRadius: '8px', color: 'var(--accent-cyan)' }}>
            <Brain size={20} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Sentiment & NLP Intelligence Suite</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Run real-time polarity classification, emotion breakdowns, key keyword extraction, or extractive text summarization.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => { setActiveTab('sentiment'); setResult(null); setError(''); }}
          className={activeTab === 'sentiment' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <Brain size={16} /> Sentiment & Emotion Analyzer
        </button>
        <button
          onClick={() => { setActiveTab('summarizer'); setResult(null); setError(''); }}
          className={activeTab === 'summarizer' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <FileText size={16} /> AI Text Summarizer
        </button>
      </div>

      {/* Form & Input Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        
        {/* Sample Prompt Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sample Prompts:</span>
          {activeTab === 'sentiment' ? (
            <>
              <button onClick={() => setText(sampleTexts.sentimentPositive)} type="button" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                Positive Review
              </button>
              <button onClick={() => setText(sampleTexts.sentimentNegative)} type="button" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                Negative Feedback
              </button>
            </>
          ) : (
            <button onClick={() => setText(sampleTexts.summarizerText)} type="button" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
              Tech Article
            </button>
          )}
        </div>

        {error && (
          <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label className="form-label">
              {activeTab === 'sentiment' ? 'Text to Analyze' : 'Source Document / Paragraph'}
            </label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder={activeTab === 'sentiment' ? "Enter text, product review, or feedback to evaluate sentiment..." : "Paste long text, article, or document to generate bullet summary..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>

          {activeTab === 'summarizer' && (
            <div className="form-group" style={{ maxWidth: '240px' }}>
              <label className="form-label">Summary Sentences Limit</label>
              <select className="form-select" value={sentences} onChange={(e) => setSentences(Number(e.target.value))}>
                <option value={2}>2 Sentences (Concise)</option>
                <option value={3}>3 Sentences (Standard)</option>
                <option value={5}>5 Sentences (Detailed)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '180px' }}>
            {loading ? 'Processing AI Pipeline...' : <><Sparkles size={18} /> Run AI Analysis</>}
          </button>
        </form>

      </div>

      {/* Results Display */}
      {result && (
        <div className="glass-card animate-fade-in" style={{ padding: '32px', border: '1px solid var(--border-glass-active)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={24} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Analysis Results</h3>
            </div>
            <button onClick={() => copyToClipboard(result)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Copy size={14} /> {copied ? 'Copied JSON!' : 'Copy Result'}
            </button>
          </div>

          {activeTab === 'sentiment' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Overall Polarity Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentiment Result</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <span className={`badge ${result.sentiment === 'Positive' ? 'badge-positive' : result.sentiment === 'Negative' ? 'badge-negative' : 'badge-neutral'}`} style={{ fontSize: '1.1rem', padding: '6px 16px' }}>
                      {result.sentiment}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      Score: {result.positivityPct}% Positive
                    </span>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONFIDENCE</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{result.confidence}</div>
                </div>
              </div>

              {/* Emotions Distribution Progress Bars */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={18} color="var(--accent-cyan)" /> Emotion Intensity Breakdown
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  {Object.entries(result.emotions || {}).map(([emotion, score]) => (
                    <div key={emotion} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: '6px' }}>
                        <span>{emotion}</span>
                        <span>{Math.round(score * 100)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${score * 100}%`, height: '100%', background: 'var(--gradient-glow)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords Tag Cloud */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} color="#b388ff" /> Top Key Concepts & Entities
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {(result.keywords || []).map(keyword => (
                    <span key={keyword} className="badge badge-purple" style={{ textTransform: 'none', padding: '6px 14px', fontSize: '0.85rem' }}>
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Compression Stats */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(0, 242, 254, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>COMPRESSION SAVINGS</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{result.compressionRatio}</div>
                </div>

                <div style={{ background: 'rgba(0, 230, 118, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>READABILITY LEVEL</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{result.readability}</div>
                </div>
              </div>

              {/* Executive Summary Box */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Generated Summary</h4>
                <div style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-cyan)', fontSize: '1rem', lineHeight: 1.6 }}>
                  {result.summary}
                </div>
              </div>

              {/* Bullet Points */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Key Bullet Highlights</h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                  {(result.keyPoints || []).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
