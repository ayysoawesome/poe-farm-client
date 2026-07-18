import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';

import { EconomyLayout } from '@/app/layouts/EconomyLayout';
import { BossDetailPage } from '@/pages/boss-details';
import { BossesPage } from '@/pages/bosses';
import { HomePage } from '@/pages/home';
import {
  ScarabBlockingPage,
  ScarabsLayout,
  ScarabsPage,
} from '@/pages/scarabs';

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

export const economyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$leagueId',
  component: EconomyLayout,
});

export const bossesRoute = createRoute({
  getParentRoute: () => economyRoute,
  path: 'bosses',
  component: BossesPage,
});

export const scarabsRoute = createRoute({
  getParentRoute: () => economyRoute,
  path: 'scarabs',
  component: ScarabsLayout,
});

export const scarabsIndexRoute = createRoute({
  getParentRoute: () => scarabsRoute,
  path: '/',
  component: ScarabsPage,
});

export const scarabBlockingRoute = createRoute({
  getParentRoute: () => scarabsRoute,
  path: 'blocking',
  component: ScarabBlockingPage,
});

export const bossDetailRoute = createRoute({
  getParentRoute: () => economyRoute,
  path: 'bosses/$bossId',
  component: BossDetailPage,
});
