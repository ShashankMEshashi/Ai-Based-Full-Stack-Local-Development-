import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user.fullName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      setLoading(true);
      const res = await api.put('/user/profile', { fullName, bio });
      if (res.success) {
        updateUser(res.user);
        setMessage('Profile settings updated successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '6px', borderRadius: '8px', color: 'var(--accent-cyan)' }}>
          <User size={20} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Account Profile Settings</h1>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        
        {/* User Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
          <img src={user.avatar} alt={user.fullName} style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }} />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user.fullName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ marginTop: '6px' }}>
              <span className={`badge ${user.role === 'admin' ? 'badge-purple' : 'badge-positive'}`}>
                <Shield size={12} /> {user.role.toUpperCase()} ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {message && (
          <div className="alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {error && (
          <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Display Name</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Email Address (Read-only)</label>
            <input
              type="email"
              className="form-input"
              value={user.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Developer Bio & Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Tell us about your background or AI research interests..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '160px' }}>
            {loading ? 'Saving Changes...' : <><Save size={18} /> Save Profile</>}
          </button>
        </form>

      </div>

    </div>
  );
}
