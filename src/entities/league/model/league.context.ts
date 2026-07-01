import { createContext } from 'react';
import type { TLeague } from './league.types';

interface ILeagueContext {
  selectedLeague: TLeague | null;
  setSelectedLeague: (league: TLeague | null) => void;
}

export const LeagueContext = createContext<ILeagueContext | null>(null);
