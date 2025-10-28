import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, full_name: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        try {
          const response = await api.getCurrentUser();
          if ('user' in response) {
            setUser(response.user);
          } else {
            localStorage.removeItem('session_token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          localStorage.removeItem('session_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error || 'Ошибка входа' };
    } catch (error) {
      return { success: false, error: 'Ошибка сети' };
    }
  };

  const register = async (email: string, password: string, full_name: string, phone: string) => {
    try {
      const response = await api.register(email, password, full_name, phone);
      if (response.success) {
        const userResponse = await api.getCurrentUser();
        if ('user' in userResponse) {
          setUser(userResponse.user);
        }
        return { success: true };
      }
      return { success: false, error: response.error || 'Ошибка регистрации' };
    } catch (error) {
      return { success: false, error: 'Ошибка сети' };
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
