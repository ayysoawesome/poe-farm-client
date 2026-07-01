import type { FC } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/shared/api';
import { router } from './router/router';
import { LeagueProvider } from './providers/LeagueContext';

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LeagueProvider>
        <RouterProvider router={router} />
      </LeagueProvider>
    </QueryClientProvider>
  );
};
