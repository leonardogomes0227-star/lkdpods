/**
 * Two large blurred lime/emerald glows that drift slowly behind all content.
 * Sits at z-0, pointer-events none, never blocks interaction.
 */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />

      {/* Glow 1 — top-left, lime */}
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-neon-500/[0.07] blur-[120px] animate-glow-drift-1" />

      {/* Glow 2 — bottom-right, emerald */}
      <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-emerald-500/[0.06] blur-[140px] animate-glow-drift-2" />

      {/* Vignette to keep edges dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,11,11,0.6)_100%)]" />
    </div>
  );
}
