import { createContext, useContext, useEffect, useState } from 'react';
import { apiLogin, apiRegister, apiMe, apiUpdateProfile, apiChangePassword } from './api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'vidyayan-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiMe(token)
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAuthResponse = data => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async payload => handleAuthResponse(await apiLogin(payload));
  const register = async payload => handleAuthResponse(await apiRegister(payload));
  const updateProfile = async payload => {
    const data = await apiUpdateProfile(token, payload);
    setUser(data.user);
    return data.user;
  };
  const changePassword = async payload => apiChangePassword(token, payload);
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, updateProfile, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.');
  return context;
}
