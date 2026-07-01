import { useState, type FC, type PropsWithChildren } from 'react';
import { LeagueContext, type TLeague } from '@/entities/league';

export const LeagueProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState<TLeague | null>(null);

  return (
    <LeagueContext.Provider value={{ selectedLeague, setSelectedLeague }}>
      {children}
    </LeagueContext.Provider>
  );
};
