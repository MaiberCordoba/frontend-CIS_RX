// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeToken, isTokenExpired } from '@/utils/DecodeToken';
import { Usuario } from '@/modules/Users/types';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;           // 👈 Nuevo
  login: (token: string, refresh: string, userData?: Usuario) => void;
  logout: () => void;
  updateUser: (userData: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);   // 👈 Inicia en true

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          const decoded = decodeToken(storedToken);
          if (decoded) {
            setUser({ id: parseInt(decoded.user_id), username: '' } as Usuario);
          }
        }
      } else {
        const decoded = decodeToken(storedToken);
        if (decoded) {
          setUser({ id: parseInt(decoded.user_id), username: '' } as Usuario);
        }
      }
    } else if (storedToken && isTokenExpired(storedToken)) {
      localStorage.clear();
    }
    setLoading(false);   // 👈 Terminó la carga
  }, []);

  const login = (newToken: string, refreshToken: string, userData?: Usuario) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('refresh', refreshToken);
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      const decoded = decodeToken(newToken);
      if (decoded) {
        const fallbackUser = { id: parseInt(decoded.user_id), username: '' } as Usuario;
        setUser(fallbackUser);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const updateUser = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};