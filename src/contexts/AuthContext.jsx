import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp || !decoded?.id) {
        throw new Error('Token structure invalide');
      }

      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate < new Date()) {
        console.warn('Token expiré');
        logout();
        return;
      }

      setUser({
        id: decoded.id,
        email: decoded.email || '',
        name: decoded.name || ''
        
      });

      localStorage.setItem('token', token);
    } catch (err) {
      console.error('Échec décodage token :', err.message);
      logout();
    }
  }, [token]);

  const login = (jwt) => setToken(jwt);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
