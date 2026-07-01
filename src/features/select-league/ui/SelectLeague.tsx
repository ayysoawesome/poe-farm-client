import { useEffect, useMemo, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leagueService, useLeague, type TLeague } from '@/entities/league';
import { queryKeys } from '@/shared/api';
import { UISelect } from '@/shared/ui';
import { reconcileSelectedLeague } from '../model/selectLeague';

const EMPTY_LEAGUES: TLeague[] = [];

export const SelectLeague: FC = () => {
  const { selectedLeague, setSelectedLeague } = useLeague();
  const leaguesQuery = useQuery({
    queryKey: queryKeys.leagues.all,
    queryFn: () => leagueService.getLeagues(),
  });

  const leagues = leaguesQuery.data ?? EMPTY_LEAGUES;
  const options = useMemo(
    () =>
      leagues.map((league) => ({
        value: league.id,
        label: league.name,
      })),
    [leagues],
  );

  useEffect(() => {
    if (leagues.length === 0) return;

    const nextLeague = reconcileSelectedLeague(leagues, selectedLeague);
    if (nextLeague && nextLeague.id !== selectedLeague?.id) {
      setSelectedLeague(nextLeague);
    }
  }, [leagues, selectedLeague, setSelectedLeague]);

  const handleValueChange = (leagueId: string) => {
    const league = leagues.find((item) => item.id === leagueId);
    if (league) {
      setSelectedLeague(league);
    }
  };

  return (
    <UISelect
      label='League'
      options={options}
      value={selectedLeague?.id ?? null}
      onValueChange={handleValueChange}
      placeholder={
        leaguesQuery.isLoading
          ? 'Loading leagues...'
          : leaguesQuery.isError
            ? 'Failed to load leagues'
            : 'Select league'
      }
      disabled={leaguesQuery.isLoading || leaguesQuery.isError}
      className='w-full sm:w-56'
    />
  );
};
