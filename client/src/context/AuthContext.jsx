import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchUser = async () => {
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('http://localhost:5000/api/auth/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = async (email, password, role = 'customer') => {
    const endpoint = (role === 'provider') ? '/api/auth/provider/login' : '/api/auth/customer/login';
    const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const role = userData.role || 'customer';
    const endpoint = role === 'provider' ? '/api/auth/provider/register' : '/api/auth/customer/register';
    const res = await axios.post(`http://localhost:5000${endpoint}`, userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshProfile = () => fetchUser();

  const updateProfile = async (userData) => {
    const role = user?.role || 'customer';
    const endpoint = role === 'provider' ? '/api/auth/provider/profile' : '/api/auth/customer/profile';
    try {
      const res = await axios.put(`http://localhost:5000${endpoint}`, userData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error('Update Profile Error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
