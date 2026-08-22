import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Target, Shield, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 0 40px 0' }} className="animate-fade-in">
        <div className="badge badge-purple" style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.85rem' }}>
          <Sparkles size={14} /> Powered by Local Machine Intelligence Engine
        </div>

        <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px' }}>
          Intelligent Text Analytics & <br />
          <span className="gradient-text">Skill Recommendation Engine</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto 36px auto' }}>
          MindPulse AI provides modern full-stack sentiment classification, text summarization, and vector-driven career skill recommendation — running 100% locally on Node.js and Express.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px', textDecoration: 'none' }}>
            Get Started Now <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '14px 28px', textDecoration: 'none' }}>
            Demo Account Login
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ margin: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Built-In Intelligent Capabilities</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Zero third-party API dependencies. Fast, secure, and accurate.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.1)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '20px', color: 'var(--accent-cyan)' }}>
              <Brain size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Sentiment & Emotion AI</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Classifies text polarity (Positive, Neutral, Negative), computes confidence scores, extracts top keywords, and analyzes emotional intensity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(127, 0, 255, 0.1)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '20px', color: '#b388ff' }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Career Skill Recommender</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Computes vector matching percentage between candidate profile skills and target job descriptions, identifying gaps and actionable recommendations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '20px', color: 'var(--accent-emerald)' }}>
              <Shield size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Full-Stack Security & Admin</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Includes JWT authentication, bcrypt password security, role-based user management, and real-time administrative system stats.
            </p>
          </div>

        </div>
      </section>

      {/* Tech Stack Bar */}
      <section className="glass-card-static" style={{ padding: '32px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Powered by Full-Stack Enterprise Stack
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <span><CheckCircle2 size={16} color="var(--accent-cyan)" inline /> React (Vite)</span>
          <span><CheckCircle2 size={16} color="var(--accent-cyan)" inline /> Node.js & Express</span>
          <span><CheckCircle2 size={16} color="var(--accent-cyan)" inline /> MySQL / MongoDB</span>
          <span><CheckCircle2 size={16} color="var(--accent-cyan)" inline /> Local NLP Machine Engine</span>
        </div>
      </section>

    </div>
  );
}
