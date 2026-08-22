import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogOut, User, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-card-static" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '14px 28px', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--gradient-glow)', padding: '8px', borderRadius: '12px', display: 'flex' }}>
            <Zap size={22} color="#030712" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit' }} className="gradient-text">MindPulse AI</span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', marginTop: '-4px' }}>Local Intelligence Engine</span>
          </div>
        </Link>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
                <img src={user.avatar} alt={user.fullName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName}</span>
                {isAdmin ? (
                  <span className="badge badge-purple" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                    <Shield size={12} /> Admin
                  </span>
                ) : (
                  <span className="badge badge-positive" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                    User
                  </span>
                )}
              </div>

              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', textDecoration: 'none' }}>
                <Sparkles size={16} /> Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
