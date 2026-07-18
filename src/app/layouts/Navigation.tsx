import { Link } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib';

interface INavigationProps {
  leagueId: string | null;
}

export const Navigation: FC<INavigationProps> = ({ leagueId }) => {
  const { t } = useTranslation();
  const linkClassName =
    'flex min-h-12 items-center border-l-2 px-4 font-semibold transition hover:text-gold-bright';
  const activeProps = {
    className: cn(linkClassName, 'border-gold-bright bg-surface-soft text-white'),
  };
  const inactiveProps = {
    className: cn(linkClassName, 'border-transparent text-muted'),
  };

  return (
    <aside className='h-fit shrink-0 rounded-md border border-border bg-surface text-xl'>
      <nav
        className='flex min-w-56 flex-col py-2'
        aria-label={t('app.navigationLabel')}
      >
        {leagueId ? (
          <>
            <Link
              activeProps={activeProps}
              inactiveProps={inactiveProps}
              params={{ leagueId }}
              to='/$leagueId/bosses'
            >
              {t('bosses.title')}
            </Link>
            <Link
              activeOptions={{ exact: false }}
              activeProps={activeProps}
              inactiveProps={inactiveProps}
              params={{ leagueId }}
              to='/$leagueId/scarabs'
            >
              {t('scarabs.title')}
            </Link>
          </>
        ) : (
          <Link
            activeProps={activeProps}
            inactiveProps={inactiveProps}
            to='/bosses'
          >
            {t('bosses.title')}
          </Link>
        )}
      </nav>
    </aside>
  );
};
