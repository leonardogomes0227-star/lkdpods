export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] h-full w-full bg-bg overflow-hidden">
      {/* Blob orgânico superior esquerdo */}
      <div className="absolute -top-[15%] -left-[10%] h-[550px] w-[550px] rounded-full bg-accentSoft blur-[130px] animate-floatSlow" />

      {/* Blob inferior direito */}
      <div className="absolute -bottom-[15%] -right-[10%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px] animate-float" />

      {/* Grid sutil pra textura premium, quase invisível */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15181B08_1px,transparent_1px),linear-gradient(to_bottom,#15181B08_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Vinheta: escurece levemente as bordas, foca o centro */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_65%_65%_at_50%_40%,transparent_30%,black_100%)] bg-ink/[0.035]" />

      {/* Vinheta extra nas bordas absolutas pra profundidade real */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(21,24,27,0.06)]" />
    </div>
  );
}
