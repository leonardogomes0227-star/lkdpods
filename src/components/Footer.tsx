import React from 'react';
import { Instagram, ShieldCheck, Heart } from 'lucide-react';
import { STORE_CITY } from '../store';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        
        {/* Marca / Logo */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 font-extrabold shadow-md">
              🦍
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              LKD <span className="text-emerald-400">Imports</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Sua tabacaria com estilo e confiança em {STORE_CITY}. Os melhores descartáveis e acessórios das marcas mais desejadas.
          </p>
        </div>

        {/* Selo de Segurança */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-2xl text-xs text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ambiente 100% Seguro & Criptografado</span>
          </div>
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-semibold">
            Proibido para menores de 18 anos
          </p>
        </div>

        {/* Redes Sociais / Instagram */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Siga no Instagram
          </p>
          <a
            href="https://www.instagram.com/lkd_importes?igsh=cm45M2VnMzQ2czhk&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all transform hover:scale-105"
          >
            <Instagram className="w-4 h-4" />
            @lkd_importes
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
        <p>© {new Date().getFullYear()} LKD Imports — Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Feito com <Heart className="w-3 h-3 text-red-500 fill-red-500" /> para {STORE_CITY}
        </p>
      </div>
    </footer>
  );
};
