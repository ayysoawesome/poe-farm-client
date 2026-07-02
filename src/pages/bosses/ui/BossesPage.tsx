import type { FC, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { BossesNavigation } from './BossesNavigation';
import { BossesTable } from './BossesTabe';
import { queryKeys } from '@/shared/api';
import { bossService } from '@/entities/boss';
import { UISkeleton } from '@/shared/ui';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';

const BossesPageLayout: FC<{
  children: ReactNode;
  leagueId: string | null;
}> = ({ children, leagueId }) => {
  return (
    <div className='grid gap-4 px-4 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8'>
      <BossesNavigation leagueId={leagueId} />
      <div className='min-w-0'>{children}</div>
    </div>
  );
};

export const BossesPage: FC = () => {
  const location = useLocation();
  const leagueId = getLeagueIdFromPathname(location.pathname);

  const { data, isError, isLoading } = useQuery({
    queryKey: queryKeys.bosses.list(leagueId ?? ''),
    queryFn: () => bossService.getBosses(leagueId!),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || isLoading) {
    return (
      <BossesPageLayout leagueId={leagueId}>
        <UISkeleton className='block h-[28rem] w-full rounded-md border border-border bg-surface shadow-panel' />
      </BossesPageLayout>
    );
  }

  if (isError) {
    return (
      <BossesPageLayout leagueId={leagueId}>
        <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
          Failed to load bosses.
        </div>
      </BossesPageLayout>
    );
  }

  return (
    <BossesPageLayout leagueId={leagueId}>
      <BossesTable data={data ?? []} leagueId={leagueId} />
    </BossesPageLayout>
  );
};
