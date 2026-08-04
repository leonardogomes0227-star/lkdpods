import { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';

interface Props {
  onClose: () => void;
}

export function AdminLogin({ onClose }: Props) {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) setError('Credenciais inválidas. Tente novamente.');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in rounded-3xl border border-ink-700 bg-ink-900 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-ink-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-500/15">
            <ShieldCheck className="h-7 w-7 text-neon-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Painel Admin</h1>
          <p className="mt-1 text-sm text-white/50">Acesso restrito ao gerente da loja.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lkdimports.com"
                className="w-full rounded-xl border border-ink-700 bg-ink-850 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-neon-500/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink-700 bg-ink-850 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-neon-500/50"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-neon-500 py-3 text-sm font-bold text-black transition hover:bg-neon-400 active:scale-[0.98]"
          >
            Entrar no Painel
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/30">
          Credenciais padrão: admin@lkdimports.com / admin123
        </p>
      </div>
    </div>
  );
}
