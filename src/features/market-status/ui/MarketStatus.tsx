import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { marketService } from '@/entities/market';
import { useLeague } from '@/entities/league';
import { queryKeys } from '@/shared/api';
import { CHAOS_ORB_ICON_URL, DIVINE_ORB_ICON_URL } from '@/shared/assets';
import {
  formatDivineChaosRate,
  formatFreshnessDate,
  getLatestFreshnessTimestamp,
} from '../model/marketStatus';

export const MarketStatus: FC = () => {
  const { selectedLeague } = useLeague();
  const { t } = useTranslation();
  const leagueId = selectedLeague?.id;

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

  const latestTimestamp = freshnessQuery.data
    ? getLatestFreshnessTimestamp(freshnessQuery.data)
    : null;

  const rateText = rateQuery.data
    ? formatDivineChaosRate(rateQuery.data.chaosValue)
    : rateQuery.isLoading
      ? '...'
      : t('market.noData');
  const freshnessText = freshnessQuery.isLoading
    ? '...'
    : formatFreshnessDate(latestTimestamp, t('market.noData'), (unit, count) =>
        t(`market.relative.${unit}`, { count }),
      );

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
        <span className='text-lg font-bold leading-none text-gold-bright'>
          {rateText}
        </span>
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
        <span className='truncate font-semibold text-white'>{freshnessText}</span>
      </div>
    </div>
  );
};
