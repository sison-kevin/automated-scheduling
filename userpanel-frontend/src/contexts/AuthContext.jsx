import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/check-auth');
      if (response.authenticated) {
        setUser(response.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/login', { email, password });
      if (response.success) {
        setUser(response.user);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await api.post('/api/register', { name, username, email, password });
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
