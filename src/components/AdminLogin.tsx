import React, { useState } from 'react';
import { useStore } from '../store';
import { Lock, X, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const setAuthed = useStore((state) => state.setAuthed);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123' || pass === 'Lkd@2026') {
      setAuthed(true);
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-inkSoft hover:bg-bg hover:text-ink transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">Painel Administrativo</h3>
            <p className="text-xs text-inkSoft">Acesso restrito para gestão da loja</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-inkSoft mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Digite a senha..."
              className={`w-full rounded-xl border px-4 py-3 text-sm text-ink outline-none transition-all ${
                error ? 'border-red-500 bg-red-50' : 'border-line focus:border-accent'
              }`}
              autoFocus
            />
            {error && <p className="mt-1 text-xs font-medium text-red-500">Senha incorreta!</p>}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white shadow-md hover:bg-accent transition-all active:scale-[0.98]"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
