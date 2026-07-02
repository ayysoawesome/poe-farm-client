import { useEffect, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { leagueService } from '@/entities/league';
import { queryKeys } from '@/shared/api';
import { UISkeleton } from '@/shared/ui';
import { getDefaultLeague } from '@/features/select-league/model/selectLeague';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const leaguesQuery = useQuery({
    queryKey: queryKeys.leagues.all,
    queryFn: () => leagueService.getLeagues(),
  });

  useEffect(() => {
    const defaultLeague = getDefaultLeague(leaguesQuery.data ?? []);

    if (!defaultLeague) return;

    navigate({
      to: '/$leagueId/bosses',
      params: { leagueId: defaultLeague.id },
      replace: true,
    });
  }, [leaguesQuery.data, navigate]);

  if (leaguesQuery.isError) {
    return (
      <section className='px-4 sm:px-6 lg:px-8'>
        <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
          Failed to load leagues.
        </div>
      </section>
    );
  }

  return (
    <section className='px-4 sm:px-6 lg:px-8'>
      <UISkeleton className='block h-[28rem] w-full rounded-md border border-border bg-surface shadow-panel' />
    </section>
  );
};
