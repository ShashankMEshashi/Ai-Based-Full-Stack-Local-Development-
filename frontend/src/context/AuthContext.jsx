import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mindpulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('mindpulse_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('mindpulse_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('mindpulse_token', res.token);
      localStorage.setItem('mindpulse_user', JSON.stringify(res.user));
      return res.user;
    }
  };

  const register = async (fullName, email, password, role) => {
    const res = await api.post('/auth/register', { fullName, email, password, role });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('mindpulse_token', res.token);
      localStorage.setItem('mindpulse_user', JSON.stringify(res.user));
      return res.user;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mindpulse_token');
    localStorage.removeItem('mindpulse_user');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('mindpulse_user', JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
