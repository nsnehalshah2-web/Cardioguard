import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) { setChecking(false); return; }
    getCurrentUser().then(setUser).catch(() => {
      sessionStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }).finally(() => setChecking(false));

    const handleAuthExpired = () => setUser(null);
    window.addEventListener('cardioguard:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('cardioguard:auth-expired', handleAuthExpired);
  }, []);

  const authenticate = (payload) => { sessionStorage.setItem(TOKEN_KEY, payload.access_token); setUser(payload.user); return payload.user; };
  const login = async (credentials) => authenticate(await loginUser({ ...credentials, email: credentials.email.trim().toLowerCase() }));
  const signup = async (data) => authenticate(await registerUser(data));
  const logout = () => { sessionStorage.removeItem(TOKEN_KEY); setUser(null); };

  return <AuthContext.Provider value={{ user, checking, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }