import { useEffect, useMemo, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { leagueService, type TLeague } from '@/entities/league';
import { queryKeys } from '@/shared/api';
import { UISelect } from '@/shared/ui';
import {
  buildLeaguePath,
  getLeagueIdFromPathname,
  reconcileSelectedLeague,
} from '../model/selectLeague';

const EMPTY_LEAGUES: TLeague[] = [];

export const SelectLeague: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leaguesQuery = useQuery({
    queryKey: queryKeys.leagues.all,
    queryFn: () => leagueService.getLeagues(),
  });

  const leagues = leaguesQuery.data ?? EMPTY_LEAGUES;
  const selectedLeagueId = getLeagueIdFromPathname(location.pathname);
  const selectedLeague =
    leagues.find((league) => league.id === selectedLeagueId) ?? null;
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
    if (nextLeague && nextLeague.id !== selectedLeagueId) {
      navigate({
        to: buildLeaguePath(location.pathname, nextLeague.id),
        replace: true,
      });
    }
  }, [leagues, location.pathname, navigate, selectedLeague, selectedLeagueId]);

  const handleValueChange = (leagueId: string) => {
    navigate({
      to: buildLeaguePath(location.pathname, leagueId),
      replace: true,
    });
  };

  return (
    <UISelect
      label='League'
      options={options}
      value={selectedLeagueId}
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
