import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BossesTable } from './BossesTabe';
import { queryKeys } from '@/shared/api';
import { bossService } from '@/entities/boss';
import { UISkeleton } from '@/shared/ui';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';

export const BossesPage: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const leagueId = getLeagueIdFromPathname(location.pathname);

  const { data, isError, isLoading } = useQuery({
    queryKey: queryKeys.bosses.list(leagueId ?? ''),
    queryFn: () => bossService.getBosses(leagueId!),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || isLoading) {
    return (
      <UISkeleton className='block h-[28rem] w-full rounded-md border border-border bg-surface shadow-panel' />
    );
  }

  if (isError) {
    return (
      <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
        {t('bosses.errors.list')}
      </div>
    );
  }

  return <BossesTable data={data ?? []} leagueId={leagueId} />;
};
