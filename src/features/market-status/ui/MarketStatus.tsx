import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { marketService } from '@/entities/market';
import { queryKeys } from '@/shared/api';
import { CHAOS_ORB_ICON_URL, DIVINE_ORB_ICON_URL } from '@/shared/assets';
import { UISkeleton } from '@/shared/ui';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import {
  getMarketStatusDisplay,
  type TMarketStatusDisplayValue,
} from '../model/marketStatus';

const MarketStatusValue: FC<{
  className: string;
  skeletonClassName: string;
  value: TMarketStatusDisplayValue;
}> = ({ className, skeletonClassName, value }) => {
  if (value.kind === 'loading') {
    return <UISkeleton className={skeletonClassName} />;
  }

  return <span className={className}>{value.value}</span>;
};

export const MarketStatus: FC = () => {
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const leagueId = getLeagueIdFromPathname(location.pathname);

  const rateQuery = useQuery({
    queryKey: leagueId
      ? queryKeys.market.divineChaosRate(leagueId)
      : queryKeys.market.divineChaosRate(''),
    queryFn: () => marketService.getDivineChaosRate(leagueId!),
    enabled: Boolean(leagueId),
  });

  const freshnessQuery = useQuery({
    queryKey: leagueId
      ? queryKeys.market.freshnessStatus(leagueId)
      : queryKeys.market.freshnessStatus(''),
    queryFn: () => marketService.getFreshnessStatus(leagueId!),
    enabled: Boolean(leagueId),
  });

  const display = getMarketStatusDisplay({
    formatRelativeTime: (unit, count) =>
      t(`market.relative.${unit}`, { count }),
    isFreshnessLoading: freshnessQuery.isLoading,
    isRateLoading: rateQuery.isLoading,
    noDataText: t('market.noData'),
    language,
    rateValue: rateQuery.data?.chaosValue,
    status: freshnessQuery.data,
  });

  return (
    <div className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted'>
      <div className='flex h-12 items-center gap-1.5 rounded border border-border bg-surface px-3'>
        <img
          alt=''
          className='size-6'
          height='24'
          src={DIVINE_ORB_ICON_URL}
          width='24'
        />
        <span className='font-semibold text-white'>1</span>
        <span aria-hidden='true'>=</span>
        <MarketStatusValue
          className='text-lg font-bold leading-none text-gold-bright'
          skeletonClassName='h-5 w-12'
          value={display.rate}
        />
        <img
          alt=''
          className='size-6'
          height='24'
          src={CHAOS_ORB_ICON_URL}
          width='24'
        />
      </div>

      <div className='flex h-12 min-w-0 items-center gap-2 rounded border border-border bg-surface px-3'>
        <span className='text-faint'>{t('market.updated')}</span>
        <MarketStatusValue
          className='truncate font-semibold text-white'
          skeletonClassName='h-4 w-24'
          value={display.freshness}
        />
      </div>
    </div>
  );
};
