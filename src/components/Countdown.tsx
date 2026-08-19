import { useEffect, useRef, useState } from 'react';

interface Props {
  deadline: number;
  className?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function FlipUnit({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    if (value !== display) {
      const mid = setTimeout(() => setDisplay(value), 225);
      setFlipKey((k) => k + 1);
      return () => clearTimeout(mid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ perspective: '200px' }} className="relative">
        <div
          key={flipKey}
          style={{ transformStyle: 'preserve-3d' }}
          className="animate-flipDown relative rounded-md bg-gradient-to-b from-white/15 to-white/5 px-2.5 py-1.5 font-display text-base font-bold tabular-nums text-white shadow-[0_2px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] sm:text-lg"
        >
          <span className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-black/30" />
          {display}
        </div>
      </div>
      <span className="text-[8px] uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}

export function Countdown({ deadline, className }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const raf = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      raf.current = window.setTimeout(() => {
        raf.current = window.setTimeout(tick, 1000) as unknown as number;
      }, 0) as unknown as number;
    };
    tick();
    return () => clearTimeout(raf.current);
  }, []);

  const diff = Math.max(0, deadline - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className={`flex items-start gap-1.5 font-display font-bold tabular-nums ${className ?? ''}`}>
      <FlipUnit value={pad(h)} label="hrs" />
      <span className="pt-1.5 text-base text-accent sm:text-lg">:</span>
      <FlipUnit value={pad(m)} label="min" />
      <span className="pt-1.5 text-base text-accent sm:text-lg">:</span>
      <FlipUnit value={pad(s)} label="seg" />
    </div>
  );
}
