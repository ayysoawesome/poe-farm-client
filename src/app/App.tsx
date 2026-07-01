import type { FC } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/shared/api';
import { router } from './router/router';
import { LeagueProvider } from './providers/LeagueContext';
import { I18nProvider } from './providers/I18nProvider';

export const App: FC = () => {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <LeagueProvider>
          <RouterProvider router={router} />
        </LeagueProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
};
