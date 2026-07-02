import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';

import { BossDetailPage } from '@/pages/boss-details';
import { BossesPage } from '@/pages/bosses';
import { HomePage } from '@/pages/home';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

export const legacyBossesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bosses',
  component: BossesPage,
});

export const legacyBossDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bosses/$bossId',
  component: BossDetailPage,
});

export const bossesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$leagueId/bosses',
  component: BossesPage,
});

export const bossDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$leagueId/bosses/$bossId',
  component: BossDetailPage,
});
