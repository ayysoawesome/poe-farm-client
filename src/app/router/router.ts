import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import { bossDetailRoute, bossesRoute, indexRoute } from './routes';

const routeTree = rootRoute.addChildren([
  indexRoute,
  bossDetailRoute,
  bossesRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}
