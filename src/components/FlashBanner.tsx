import { Zap } from 'lucide-react';
import { Countdown } from './Countdown';

interface Props {
  deadline: number;
}

export function FlashBanner({ deadline }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-danger/30 bg-gradient-to-r from-danger/20 via-danger/10 to-danger/20">
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-3 py-2.5 text-center sm:gap-3">
        {/* Live indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75 animate-live-pulse" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
        </span>

        <p className="text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
          <span className="hidden sm:inline">Promoção Relâmpago da Tabacaria encerrando em</span>
          <span className="sm:hidden">Relâmpago encerra em</span>
        </p>

        <Countdown deadline={deadline} />
      </div>
    </div>
  );
}
