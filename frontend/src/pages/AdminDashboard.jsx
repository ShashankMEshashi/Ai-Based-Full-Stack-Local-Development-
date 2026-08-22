import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Users, Brain, Activity, Trash2, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);

      if (usersRes.success) setUsers(usersRes.users);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      alert('Role update failed: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Warning: Deleting this user will permanently erase all associated AI history. Proceed?')) return;

    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ background: 'rgba(127, 0, 255, 0.15)', padding: '6px', borderRadius: '8px', color: '#b388ff' }}>
              <ShieldCheck size={20} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Console & System Analytics</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Manage user permissions, monitor global AI platform usage, and execute administrative actions.</p>
        </div>

        <button onClick={loadAdminData} className="btn-secondary">
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Global Metrics Bar */}
      {stats && (
        <div className="stats-grid">
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>REGISTERED USERS</span>
              <Users size={20} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>{stats.adminCount} Admins / {stats.userCount} Users</div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL AI PREDICTIONS</span>
              <Activity size={20} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalAnalyses}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>Across all system users</div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>SENTIMENT TESTS</span>
              <Brain size={20} color="#b388ff" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.sentimentAnalyses}</div>
            <div style={{ fontSize: '0.8rem', color: '#b388ff', marginTop: '4px' }}>NLP Engine Executions</div>
          </div>

        </div>
      )}

      {/* User Management Table */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Platform User Directory & Role Management</h3>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading user directory...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Details</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={u.avatar} alt={u.full_name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <span style={{ fontWeight: 600 }}>{u.full_name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-positive'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleToggleRole(u.id, u.role)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Toggle Role">
                        <UserCheck size={14} /> Toggle Role
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="btn-danger" style={{ padding: '6px 10px' }} title="Delete User">
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

    </div>
  );
}
