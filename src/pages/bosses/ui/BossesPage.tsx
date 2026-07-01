import type { FC, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BossesNavigation } from './BossesNavigation';
import { BossesTable } from './BossesTabe';
import { queryKeys } from '@/shared/api';
import { bossService } from '@/entities/boss';
import { useLeague } from '@/entities/league';

const BossesPageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='grid gap-4 px-4 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8'>
      <BossesNavigation />
      <div className='min-w-0'>{children}</div>
    </div>
  );
};

export const BossesPage: FC = () => {
  const { selectedLeague } = useLeague();
  const leagueId = selectedLeague?.id;

  const { data, isError, isLoading } = useQuery({
    queryKey: queryKeys.bosses.list(leagueId ?? ''),
    queryFn: () => bossService.getBosses(leagueId!),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || isLoading) {
    return (
      <BossesPageLayout>
        <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-muted'>
          Loading bosses...
        </div>
      </BossesPageLayout>
    );
  }

  if (isError) {
    return (
      <BossesPageLayout>
        <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
          Failed to load bosses.
        </div>
      </BossesPageLayout>
    );
  }

  return (
    <BossesPageLayout>
      <BossesTable data={data ?? []} />
    </BossesPageLayout>
  );
};
