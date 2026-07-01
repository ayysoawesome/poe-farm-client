import type { FC } from 'react';
import { CHAOS_ORB_ICON_URL, DIVINE_ORB_ICON_URL } from '@/shared/assets';
import { cn } from '@/shared/lib';

interface ICurrencyAmountProps {
  chaosValue?: number | null;
  divineValue?: number | null;
  divineOrbChaosValue?: number | null;
  signed?: boolean;
  className?: string;
  iconClassName?: string;
  fallback?: string;
}

const formatNumber = (value: number) => {
  const rounded =
    Math.abs(value) >= 10 ? Math.round(value) : Number(value.toFixed(1));

  return rounded.toLocaleString('en');
};

const formatChaos = (value: number) => {
  return Math.round(value).toLocaleString('en');
};

export const CurrencyAmount: FC<ICurrencyAmountProps> = ({
  chaosValue,
  divineValue,
  divineOrbChaosValue,
  signed = false,
  className,
  iconClassName,
  fallback = 'No data',
}) => {
  const resolvedDivineValue =
    divineValue ??
    (chaosValue !== null &&
    chaosValue !== undefined &&
    divineOrbChaosValue
      ? chaosValue / divineOrbChaosValue
      : undefined);

  if (
    resolvedDivineValue === null ||
    resolvedDivineValue === undefined ||
    Number.isNaN(resolvedDivineValue)
  ) {
    return <span className='text-muted'>{fallback}</span>;
  }

  const canUseChaos = chaosValue !== null && chaosValue !== undefined;
  const shouldUseChaos = canUseChaos && Math.abs(resolvedDivineValue) < 1;
  const displayValue = shouldUseChaos ? chaosValue : resolvedDivineValue;
  const sign = signed && displayValue > 0 ? '+' : '';

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {sign}
      {shouldUseChaos ? formatChaos(displayValue) : formatNumber(displayValue)}
      <img
        alt=''
        className={cn('size-7 shrink-0', iconClassName)}
        height='28'
        src={shouldUseChaos ? CHAOS_ORB_ICON_URL : DIVINE_ORB_ICON_URL}
        width='28'
      />
    </span>
  );
};
