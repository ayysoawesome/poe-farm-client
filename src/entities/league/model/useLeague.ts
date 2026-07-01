import { useContext } from 'react';
import { LeagueContext } from './league.context';

export const useLeague = () => {
  const context = useContext(LeagueContext);

  if (!context) {
    throw new Error('useLeague must be used within LeagueProvider');
  }

  return context;
};
