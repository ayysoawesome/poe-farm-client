import { Outlet, useLocation } from '@tanstack/react-router';
import type { FC } from 'react';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import { Navigation } from './Navigation';

export const EconomyLayout: FC = () => {
  const location = useLocation();
  const leagueId = getLeagueIdFromPathname(location.pathname);

  return (
    <div className='grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]'>
      <Navigation leagueId={leagueId} />
      <div className='min-w-0'>
        <Outlet />
      </div>
    </div>
  );
};
