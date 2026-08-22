import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BrainCircuit, Target, History, User, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/ai-analyzer', label: 'Sentiment & NLP Suite', icon: BrainCircuit },
    { path: '/skill-matcher', label: 'AI Skill Recommender', icon: Target },
    { path: '/history', label: 'Analysis History', icon: History },
    { path: '/profile', label: 'My Profile', icon: User }
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin Management', icon: ShieldCheck });
  }

  return (
    <aside className="glass-card-static" style={{ width: '260px', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 12px 12px' }}>
        Navigation Menu
      </div>

      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: isActive ? 'linear-gradient(90deg, rgba(0, 242, 254, 0.15) 0%, rgba(127, 0, 255, 0.05) 100%)' : 'transparent',
              color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent'
            })}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </aside>
  );
}
