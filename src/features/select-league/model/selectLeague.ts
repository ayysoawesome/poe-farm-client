import type { TLeague } from '@/entities/league';

export const getDefaultLeague = (leagues: TLeague[]): TLeague | undefined =>
  leagues.find((league) => league.isActive) ?? leagues[0];

export const reconcileSelectedLeague = (
  leagues: TLeague[],
  selectedLeague: TLeague | null,
): TLeague | undefined => {
  if (!selectedLeague) return getDefaultLeague(leagues);

  return (
    leagues.find((league) => league.id === selectedLeague.id) ??
    getDefaultLeague(leagues)
  );
};
