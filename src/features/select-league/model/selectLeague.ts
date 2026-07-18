import type { TLeague } from '@/entities/league';

const LEAGUE_SCOPED_SECTIONS = new Set(['bosses', 'scarabs']);

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

export const getLeagueIdFromPathname = (pathname: string): string | null => {
  const [, firstSegment, secondSegment] = pathname.split('/');

  if (
    !firstSegment ||
    LEAGUE_SCOPED_SECTIONS.has(firstSegment) ||
    !LEAGUE_SCOPED_SECTIONS.has(secondSegment)
  ) {
    return null;
  }

  return decodeURIComponent(firstSegment);
};

export const buildLeaguePath = (
  pathname: string,
  leagueId: string,
): string => {
  const encodedLeagueId = encodeURIComponent(leagueId);
  const segments = pathname.split('/').filter(Boolean);

  if (LEAGUE_SCOPED_SECTIONS.has(segments[0] ?? '')) {
    return `/${[encodedLeagueId, ...segments].join('/')}`;
  }

  if (LEAGUE_SCOPED_SECTIONS.has(segments[1] ?? '')) {
    return `/${[encodedLeagueId, ...segments.slice(1)].join('/')}`;
  }

  return `/${encodedLeagueId}/bosses`;
};
