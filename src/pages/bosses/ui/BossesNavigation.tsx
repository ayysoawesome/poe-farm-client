import { Link } from '@tanstack/react-router';
import { ClockArrowLeft } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IBossesNavigationProps {
  leagueId: string | null;
}

export const BossesNavigation: FC<IBossesNavigationProps> = ({ leagueId }) => {
  const { t } = useTranslation();

  return (
    <aside className='shrink-0 rounded-md border border-border bg-surface h-fit text-xl'>
      <nav
        className='flex min-w-56 flex-col py-2'
        aria-label={t('bosses.navigationLabel')}
      >
        {leagueId ? (
          <Link
            className='flex min-h-12 items-center border-l-2 border-gold-bright bg-surface-soft px-4 font-semibold text-white transition hover:text-gold-bright'
            params={{ leagueId }}
            to='/$leagueId/bosses'
          >
            {t('bosses.title')}
          </Link>
        ) : (
          <Link
            className='flex min-h-12 items-center border-l-2 border-gold-bright bg-surface-soft px-4 font-semibold text-white transition hover:text-gold-bright'
            to='/bosses'
          >
            {t('bosses.title')}
          </Link>
        )}
        <div className='flex min-h-12 items-center gap-2 px-4 font-medium text-muted'>
          <span>{t('bosses.comingSoon')}</span>
          <ClockArrowLeft className='inline size-4' />
        </div>
      </nav>
    </aside>
  );
};
