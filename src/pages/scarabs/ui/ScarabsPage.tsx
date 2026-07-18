import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { scarabService } from '@/entities/scarab';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import { queryKeys } from '@/shared/api';
import { UISkeleton } from '@/shared/ui';
import { GroupedScarabsTable } from './GroupedScarabsTable';
import { ScarabFreshnessNotice } from './ScarabFreshnessNotice';

export const ScarabsPage: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const leagueId = getLeagueIdFromPathname(location.pathname);

  const groupedQuery = useQuery({
    queryKey: queryKeys.scarabs.grouped(leagueId ?? ''),
    queryFn: () => scarabService.getGroupedScarabs(leagueId!),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || groupedQuery.isLoading) {
    return (
      <UISkeleton className='block h-[34rem] w-full rounded-md border border-border bg-surface shadow-panel' />
    );
  }

  if (groupedQuery.isError) {
    console.error(groupedQuery.error);
    return (
      <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
        {t('scarabs.errors.grouped')}
      </div>
    );
  }

  const groupedData = groupedQuery.data;

  if (!groupedData) {
    return (
      <section className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-muted'>
        {t('scarabs.empty.grouped')}
      </section>
    );
  }

  return (
    <div className='grid gap-6'>
      <ScarabFreshnessNotice freshness={groupedData.freshness} />
      <GroupedScarabsTable groups={groupedData.groups} />
    </div>
  );
};
