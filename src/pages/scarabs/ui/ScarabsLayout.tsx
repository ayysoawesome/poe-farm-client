import { Link, Outlet, useLocation } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import { cn } from '@/shared/lib';

export const ScarabsLayout: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const leagueId = getLeagueIdFromPathname(location.pathname);
  const tabClassName =
    'inline-flex min-h-11 items-center rounded border px-4 font-semibold transition hover:border-border-strong hover:text-gold-bright';
  const activeProps = {
    className: cn(tabClassName, 'border-gold-bright bg-surface-soft text-white'),
  };
  const inactiveProps = {
    className: cn(tabClassName, 'border-border bg-surface text-muted'),
  };

  return (
    <>
      {leagueId ? (
        <nav
          className='mb-4 flex flex-wrap gap-2'
          aria-label={t('scarabs.subroutes.label')}
        >
          <Link
            activeOptions={{ exact: true }}
            activeProps={activeProps}
            inactiveProps={inactiveProps}
            params={{ leagueId }}
            to='/$leagueId/scarabs'
          >
            {t('scarabs.subroutes.groups')}
          </Link>
          <Link
            activeProps={activeProps}
            inactiveProps={inactiveProps}
            params={{ leagueId }}
            to='/$leagueId/scarabs/blocking'
          >
            {t('scarabs.subroutes.blocking')}
          </Link>
        </nav>
      ) : null}
      <Outlet />
    </>
  );
};
