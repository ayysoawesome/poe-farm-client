import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';

import { BossDetailPage } from '@/pages/boss-details';
import { BossesPage } from '@/pages/bosses';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({
      to: '/bosses',
      replace: true,
      statusCode: 301,
    });
  },
});

export const bossesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bosses',
  component: BossesPage,
});

export const bossDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bosses/$bossId',
  component: BossDetailPage,
});
