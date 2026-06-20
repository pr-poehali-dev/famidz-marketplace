import { createContext, useContext, useState, ReactNode } from 'react';

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'famidz2026';

interface AuthCtx {
  isAdmin: boolean;
  login: (login: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (l: string, p: string) => {
    if (l === ADMIN_LOGIN && p === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
