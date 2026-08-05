import { Countdown } from './Countdown';

interface Props {
  deadline: number;
}

export function FlashBanner({ deadline }: Props) {
  return (
    <div className="relative border-b border-line bg-ink">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-3 py-2.5 text-center sm:gap-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
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
