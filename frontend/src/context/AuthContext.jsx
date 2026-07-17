import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user credentials exist in localStorage on mount
    const savedUser = localStorage.getItem('wanderlust_user');
    const savedToken = localStorage.getItem('wanderlust_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const { token, username: returnedUsername } = response.data;
      if (token) {
        const userData = { username: returnedUsername || username };
        localStorage.setItem('wanderlust_token', token);
        localStorage.setItem('wanderlust_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server.' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to authenticate!'
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await authService.signup(username, email, password);
      // Spring Boot returns the created User details directly on successful signup
      if (response.data && response.data.username) {
        // Automatically log in the user after successful registration
        const loginResult = await login(username, password);
        if (loginResult.success) {
          return { success: true, message: 'Registration and login successful!' };
        }
        return { success: true, message: 'Registration successful! Please log in.' };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to register!'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Even if API request fails, clear local storage
      console.error('Logout API failed:', err);
    }
    localStorage.removeItem('wanderlust_token');
    localStorage.removeItem('wanderlust_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
