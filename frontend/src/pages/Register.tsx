import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "../components/Icons";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
    setPending(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">✨</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Создать аккаунт</h1>
        <p className="text-sm text-zinc-500 mt-1">Присоединяйтесь к TechShop</p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-4 text-sm animate-fade-in">{error}</div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Имя</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required placeholder="Ваше имя" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required placeholder="you@example.com" />
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
                minLength={6}
                placeholder="Минимум 6 символов"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Создаём..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-sm text-zinc-500">
            Уже есть аккаунт? <Link to="/login" className="text-accent-light hover:text-accent font-medium transition-colors">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
