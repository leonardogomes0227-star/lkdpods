import logo from '../logo.png';

interface Props {
  visible: boolean;
}

export function SplashScreen({ visible }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-bg transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Anel base */}
          <span className="absolute inset-0 rounded-full border-2 border-line" />
          {/* Anel girando */}
          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent"
            style={{ animationDuration: '1s' }}
          />
          <img src={logo} alt="LKD Imports" className="h-11 w-11 object-contain" />
        </div>
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-inkSoft">
          LKD <span className="text-accent">Imports</span>
        </p>
      </div>
    </div>
  );
}
