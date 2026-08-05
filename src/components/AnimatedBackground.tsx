export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] h-full w-full bg-ink-950">
      {/* Glow Neon Superior Esquerdo */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-neon-500/10 blur-[120px]" />
      
      {/* Glow Neon Inferior Direito (com pulso lento) */}
      <div className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px] animate-pulse" />
      
      {/* Grid sutil para textura e profundidade premium */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Máscara de desfoque para o grid não ficar forte demais no meio da tela */}
      <div className="absolute inset-0 bg-ink-950 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)]" />
    </div>
  );
}
