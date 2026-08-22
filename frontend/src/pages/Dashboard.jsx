import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Brain, Target, FileText, Sparkles, TrendingUp, History, ArrowRight, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/user/history');
        if (res.success) {
          setHistory(res.history);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalCount = history.length;
  const sentimentCount = history.filter(h => h.type === 'sentiment').length;
  const summaryCount = history.filter(h => h.type === 'summarizer').length;
  const skillCount = history.filter(h => h.type === 'skill_match').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(127, 0, 255, 0.08) 100%)', border: '1px solid var(--border-glass-active)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} /> AI Workspace Ready
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Welcome, {user.fullName}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '600px' }}>
              Run real-time sentiment analysis, summarize lengthy articles, or calculate candidate skill match scores using our local machine learning algorithms.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/ai-analyzer" className="btn-primary" style={{ textDecoration: 'none' }}>
              <Brain size={18} /> Launch AI Analyzer
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="stats-grid">
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL AI ANALYSES</span>
            <TrendingUp size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : totalCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>Saved across sessions</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>SENTIMENT TESTS</span>
            <Brain size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : sentimentCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>NLP Polarity & Emotions</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>SKILL MATCHES</span>
            <Target size={20} color="#b388ff" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : skillCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#b388ff', marginTop: '4px' }}>Vector Gap Analysis</div>
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>SUMMARIES</span>
            <FileText size={20} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{loading ? '...' : summaryCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '4px' }}>Extractive Concepts</div>
        </div>
      </div>

      {/* Main Action & Recent History Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Quick Launch Suite */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>AI Tool Suite</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <Link to="/ai-analyzer" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
                <div style={{ background: 'rgba(0, 242, 254, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
                  <Brain size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Sentiment & Emotion NLP</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Extract sentiment score, top topics, and emotional intensity.</p>
                </div>
              </div>
            </Link>

            <Link to="/skill-matcher" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
                <div style={{ background: 'rgba(127, 0, 255, 0.1)', padding: '12px', borderRadius: '12px', color: '#b388ff' }}>
                  <Target size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>AI Career Skill Recommender</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Compare candidate skills against job roles and find skill gaps.</p>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Recent Prediction Activity Feed */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent AI Activity</h3>
            <Link to="/history" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading predictions...</p>
          ) : history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No AI analyses performed yet. Try running your first analysis!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {history.slice(0, 4).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <span className={`badge ${item.type === 'sentiment' ? 'badge-positive' : item.type === 'skill_match' ? 'badge-purple' : 'badge-neutral'}`} style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                      {item.type.replace('_', ' ')}
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                      {item.input_text}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
