// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('codesync_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('codesync_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const mockUser = {
      id: '1',
      username: email.split('@')[0],
      email: email,
    };
    setUser(mockUser);
    localStorage.setItem('codesync_user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  const signup = useCallback((email, password, username) => {
    const mockUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
    };
    setUser(mockUser);
    localStorage.setItem('codesync_user', JSON.stringify(mockUser));
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('codesync_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}