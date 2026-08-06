import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onFinish: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 600);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-neutral-950 text-white transition-opacity duration-600 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
        <div className="w-24 h-24 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/10 mb-6">
          🦍
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          LKD <span className="text-emerald-400">Imports</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mt-2 font-semibold">
          Tabacaria &amp; Vapes Underground
        </p>
      </div>

      <div className="absolute bottom-10 text-[10px] uppercase tracking-widest text-neutral-600 font-medium">
        Carregando experiência...
      </div>
    </div>
  );
};
