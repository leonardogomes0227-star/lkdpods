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
      setDisplay(value);
      setFlipKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flip-digit">
        <div
          key={flipKey}
          className="flip-digit-inner rounded-md bg-white/10 px-2 py-1 font-display text-base font-bold tabular-nums text-white shadow-inner sm:text-lg"
        >
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
      <span className="pt-1 text-base text-accent sm:text-lg">:</span>
      <FlipUnit value={pad(m)} label="min" />
      <span className="pt-1 text-base text-accent sm:text-lg">:</span>
      <FlipUnit value={pad(s)} label="seg" />
    </div>
  );
}
