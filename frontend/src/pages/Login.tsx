import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "../components/Icons";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Добро пожаловать</h1>
        <p className="text-sm text-zinc-500 mt-1">Войдите в свой аккаунт</p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-4 text-sm animate-fade-in">{error}</div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required placeholder="admin@techshop.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Пароль</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                required
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-sm text-zinc-500">
            Нет аккаунта? <Link to="/register" className="text-accent-light hover:text-accent font-medium transition-colors">Зарегистрироваться</Link>
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-surface-1 rounded-lg border border-white/5">
        <p className="text-[11px] text-zinc-500 text-center">
          Тестовый аккаунт: <span className="text-zinc-400">admin@techshop.com</span> / <span className="text-zinc-400">admin123</span>
        </p>
      </div>
    </div>
  );
}
