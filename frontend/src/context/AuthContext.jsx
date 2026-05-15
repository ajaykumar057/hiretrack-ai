import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(data);
    toast.success(`Welcome back, ${data.name.split(' ')[0]}! 👋`);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const res = await authAPI.googleLogin(credential);
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(data);
    toast.success(`Welcome back, ${data.name.split(' ')[0]}! 👋`);
    return data;
  };

  const register = async (name, email, password, targetRole) => {
    const res = await authAPI.register({ name, email, password, targetRole });
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(data);
    toast.success(`Welcome to HireTrack AI, ${data.name.split(' ')[0]}! 🚀`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (data) => {
    const res = await authAPI.updateProfile(data);
    setUser(res.data.data);
    toast.success('Profile updated! ✨');
    return res.data.data;
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, loginWithGoogle, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
