import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import {
  bossDetailRoute,
  bossesRoute,
  economyRoute,
  indexRoute,
  legacyBossDetailRoute,
  legacyBossesRoute,
  scarabBlockingRoute,
  scarabsIndexRoute,
  scarabsRoute,
} from './routes';

const routeTree = rootRoute.addChildren([
  indexRoute,
  economyRoute.addChildren([
    bossDetailRoute,
    bossesRoute,
    scarabsRoute.addChildren([scarabsIndexRoute, scarabBlockingRoute]),
  ]),
  legacyBossDetailRoute,
  legacyBossesRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}
