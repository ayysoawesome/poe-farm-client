import { Link } from '@tanstack/react-router';
import { ClockArrowLeft } from 'lucide-react';
import type { FC } from 'react';

export const BossesNavigation: FC = () => {
  return (
    <aside className='shrink-0 rounded-md border border-border bg-surface'>
      <nav
        className='flex min-w-56 flex-col py-2'
        aria-label='Economy sections'
      >
        <Link
          className='flex min-h-12 items-center border-l-2 border-gold-bright bg-surface-soft px-4 font-semibold text-white transition hover:text-gold-bright'
          to='/bosses'
        >
          Bosses
        </Link>
        <div className='flex min-h-12 items-center gap-2 px-4 font-medium text-muted'>
          <span>Coming soon</span>
          <ClockArrowLeft className='inline size-4' />
        </div>
      </nav>
    </aside>
  );
};
