import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUserString = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken) {
      setToken(storedToken);
    }

    try {
      if (storedUserString) {
        setUser(JSON.parse(storedUserString));
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    
    setLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);