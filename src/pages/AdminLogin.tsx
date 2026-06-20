import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(form.login, form.password);
      if (ok) {
        navigate('/admin');
      } else {
        setError('Неверный логин или пароль');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans antialiased">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand))] opacity-10 blur-3xl" />

      <div className="relative w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <button onClick={() => navigate('/')} className="mx-auto mb-6 flex items-center justify-center gap-2 font-display text-2xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-xl brand-gradient text-white glow">F</span>
            FAMIDZ
          </button>
          <h1 className="font-display text-2xl font-extrabold">Вход в админ-панель</h1>
          <p className="mt-2 text-sm text-muted-foreground">Доступ только для администраторов</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-7 shadow-2xl shadow-black/30">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Логин</label>
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={form.login}
                  onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                  placeholder="admin"
                  autoComplete="username"
                  className="h-11 rounded-xl border-border bg-secondary pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-border bg-secondary pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!form.login || !form.password || loading}
              className="h-12 w-full rounded-xl bg-[hsl(var(--brand))] font-semibold text-[hsl(var(--brand-ink))] hover:bg-[hsl(199_89%_62%)] glow disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icon name="Loader" size={16} className="animate-spin" /> Проверяем…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon name="ShieldCheck" size={16} /> Войти
                </span>
              )}
            </Button>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-3 text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5"><Icon name="Info" size={12} className="text-[hsl(var(--brand))]" /> Логин: <span className="font-mono text-foreground">admin</span></p>
            <p className="flex items-center gap-1.5"><Icon name="Info" size={12} className="text-[hsl(var(--brand))]" /> Пароль: <span className="font-mono text-foreground">famidz2026</span></p>
          </div>
        </form>

        <button onClick={() => navigate('/')} className="mt-5 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ArrowLeft" size={14} /> Вернуться на сайт
        </button>
      </div>
    </div>
  );
}