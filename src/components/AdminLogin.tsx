import { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';

interface Props {
  onClose: () => void;
}

export function AdminLogin({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Aqui está a correção principal! Puxando a função do jeito certo:
  const { login } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Passando o email e senha para o store validar
    const success = login(email, password);
    
    if (success) {
      onClose();
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl animate-slide-up">
        
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-inkSoft hover:text-ink transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mb-8 mt-2 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accentSoft text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">Painel Admin</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Acesso restrito ao gerente da loja.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">
              E-mail
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-inkSoft">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lkdimports.com"
                className="w-full rounded-xl border border-line bg-bg py-3 pl-11 pr-4 text-sm text-ink placeholder-inkSoft/50 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">
              Senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-inkSoft">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-bg py-3 pl-11 pr-4 text-sm text-ink placeholder-inkSoft/50 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                required
              />
            </div>
            {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-ink py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-ink/90 active:scale-95"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-medium text-inkSoft/60">
          Credenciais padrão: admin@lkdimports.com / admin123
        </div>
      </div>
    </div>
  );
}
