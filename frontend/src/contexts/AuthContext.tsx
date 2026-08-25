import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../api/client";
import { User } from "../types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.me().then((d) => setUser(d.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const d = await api.auth.login({ email, password });
    setUser(d.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const d = await api.auth.register({ name, email, password });
    setUser(d.user);
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
