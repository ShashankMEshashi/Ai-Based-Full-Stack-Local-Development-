import React, { useState } from 'react';
import api from '../services/api';
import { Target, Sparkles, CheckCircle2, XCircle, Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function SkillMatcher() {
  const [candidateSkills, setCandidateSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSampleFill = (roleType) => {
    if (roleType === 'fullstack') {
      setCandidateSkills('React, Node.js, Express, MongoDB, JavaScript, HTML, CSS, Git, Machine Learning');
      setJobDescription('Full Stack AI Developer\nRequirements: React, Node.js, Express, MongoDB, TypeScript, Docker, Machine Learning');
    } else if (roleType === 'frontend') {
      setCandidateSkills('React, JavaScript, HTML, CSS, Tailwind, Redux, Git');
      setJobDescription('Senior Frontend Engineer\nRequirements: React, TypeScript, Next.js, Redux, Tailwind, GraphQL');
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!candidateSkills || !jobDescription) {
      setError('Please provide both candidate skills and target job description/role.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/ai/skill-match', { candidateSkills, jobDescription });
      if (res.success) {
        setResult(res.result);
      }
    } catch (err) {
      setError(err.message || 'Skill matching analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ background: 'rgba(127, 0, 255, 0.15)', padding: '6px', borderRadius: '8px', color: '#b388ff' }}>
            <Target size={20} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Career Skill Matcher & Recommender</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Evaluate candidate qualifications against target job requirements, pinpoint missing skill gaps, and receive tailored career upskilling advice.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        
        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sample Presets:</span>
          <button onClick={() => handleSampleFill('fullstack')} type="button" className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
            Full Stack AI Developer Role
          </button>
          <button onClick={() => handleSampleFill('frontend')} type="button" className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
            Senior Frontend Engineer
          </button>
        </div>

        {error && (
          <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleMatch}>
          <div className="form-group">
            <label className="form-label">Candidate Skills Portfolio (Comma or Space Separated)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. React, Node.js, Express, MongoDB, Python, Git, Docker, SQL..."
              value={candidateSkills}
              onChange={(e) => setCandidateSkills(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Job Title & Description Requirements</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Paste job posting or list required technologies (e.g. React, TypeScript, GraphQL, AWS)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '220px' }}>
            {loading ? 'Matching Vector Skills...' : <><Sparkles size={18} /> Compute Match & Gap Analysis</>}
          </button>
        </form>

      </div>

      {/* Results Display */}
      {result && (
        <div className="glass-card animate-fade-in" style={{ padding: '32px', border: '1px solid var(--border-glass-active)' }}>
          
          <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MATCH EVALUATION RESULT</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{result.targetRole}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800 }} className="gradient-text">{result.matchPercentage}%</span>
                <span className="badge badge-purple">Compatibility Score</span>
              </div>
            </div>

            {/* Progress Match Bar */}
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginTop: '14px' }}>
              <div style={{ width: `${result.matchPercentage}%`, height: '100%', background: 'var(--gradient-purple)', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            
            {/* Matching Skills */}
            <div style={{ background: 'rgba(0, 230, 118, 0.04)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> Verified Matching Skills ({result.matchingSkills?.length || 0})
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(result.matchingSkills || []).map(skill => (
                  <span key={skill} className="badge badge-positive" style={{ textTransform: 'none' }}>
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ background: 'rgba(255, 23, 68, 0.04)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 23, 68, 0.2)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ff5252', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} /> Missing Skill Gaps ({result.missingSkills?.length || 0})
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(result.missingSkills || []).length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No gaps identified!</span>
                ) : (
                  result.missingSkills.map(skill => (
                    <span key={skill} className="badge badge-negative" style={{ textTransform: 'none' }}>
                      ✕ {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* AI Tailored Recommendations */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={20} color="var(--accent-amber)" /> Strategic AI Actionable Recommendations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(result.recommendations || []).map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  <ArrowUpRight size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
