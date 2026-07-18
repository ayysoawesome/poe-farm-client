import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '@/shared/lib';
import { getPaginationItems } from './Pagination.model';

interface IPaginationProps {
  currentPage: number;
  pageCount: number;
  summary?: string;
  previousLabel: string;
  nextLabel: string;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  currentPage,
  pageCount,
  summary,
  previousLabel,
  nextLabel,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageChange,
}) => {
  const paginationItems = getPaginationItems(currentPage, pageCount);

  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-strong px-4 py-3'>
      {summary ? (
        <span className='text-sm font-medium text-muted'>{summary}</span>
      ) : null}
      <div className='flex flex-wrap items-center justify-end gap-2'>
        <button
          className='grid size-10 place-items-center rounded border border-border bg-surface text-gold-bright transition hover:border-border-strong hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-45'
          type='button'
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          aria-label={previousLabel}
        >
          <ChevronLeft className='size-5' />
        </button>
        <div className='flex flex-wrap items-center gap-1'>
          {paginationItems.map((item) =>
            typeof item === 'number' ? (
              <button
                className={cn(
                  'grid size-10 place-items-center rounded border text-sm font-semibold transition',
                  item === currentPage
                    ? 'border-gold-bright bg-surface-soft text-white'
                    : 'border-border bg-surface text-muted hover:border-border-strong hover:text-gold-bright',
                )}
                key={item}
                type='button'
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? 'page' : undefined}
              >
                {item}
              </button>
            ) : (
              <span
                className='grid size-10 place-items-center text-muted'
                key={item}
                aria-hidden='true'
              >
                <MoreHorizontal className='size-5' />
              </span>
            ),
          )}
        </div>
        <button
          className='grid size-10 place-items-center rounded border border-border bg-surface text-gold-bright transition hover:border-border-strong hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-45'
          type='button'
          onClick={onNextPage}
          disabled={!canNextPage}
          aria-label={nextLabel}
        >
          <ChevronRight className='size-5' />
        </button>
      </div>
    </div>
  );
};
