import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TScarabBlockingResult } from '@/entities/scarab';
import { cn } from '@/shared/lib';
import { CurrencyAmount, Pagination, SortIcon } from '@/shared/ui';
import { formatPercentValue } from '../model/scarabFormat';

interface IBlockingCombinationsTableProps {
  combinations: TScarabBlockingResult[];
}

const columnHelper = createColumnHelper<TScarabBlockingResult>();
const PAGE_SIZE = 25;

const renderBlockedGroups = (
  blockedGroups: TScarabBlockingResult['blockedGroups'],
  fallback: string,
) => {
  if (blockedGroups.length === 0) return fallback;

  return (
    <div className='flex flex-wrap gap-2'>
      {blockedGroups.map((group) => (
        <span
          className='inline-flex min-w-0 items-center gap-2 rounded border border-border bg-surface-soft px-2 py-1'
          key={group.groupId}
        >
          {group.groupIconUrl ? (
            <img
              src={group.groupIconUrl}
              alt=''
              className='size-6 shrink-0'
              loading='lazy'
            />
          ) : null}
          <span className='min-w-0 whitespace-normal text-white'>
            {group.groupName}
          </span>
        </span>
      ))}
    </div>
  );
};

export const BlockingCombinationsTable: FC<IBlockingCombinationsTableProps> = ({
  combinations,
}) => {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'expectedValue', desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.blockedGroups.length, {
        id: 'blockedGroups',
        header: t('scarabs.combinations.blockedGroups'),
        cell: ({ row }) => (
          <div className='max-w-120 font-semibold'>
            {renderBlockedGroups(
              row.original.blockedGroups,
              t('scarabs.combinations.baseline'),
            )}
          </div>
        ),
      }),
      columnHelper.accessor(
        (row) => row.expectedValue ?? Number.NEGATIVE_INFINITY,
        {
          id: 'expectedValue',
          header: t('scarabs.combinations.expectedValue'),
          cell: ({ row }) => (
            <CurrencyAmount
              chaosValue={row.original.expectedValueMoney?.chaos}
              divineValue={row.original.expectedValueMoney?.divine}
              className='w-full justify-end font-semibold text-value'
              fallback={t('common.noData')}
              iconClassName='size-5'
            />
          ),
        },
      ),
      columnHelper.accessor(
        (row) => row.baseline.expectedValue ?? Number.NEGATIVE_INFINITY,
        {
          id: 'baseline',
          header: t('scarabs.combinations.baselineValue'),
          cell: ({ row }) => (
            <CurrencyAmount
              chaosValue={row.original.baseline.expectedValueMoney?.chaos}
              divineValue={row.original.baseline.expectedValueMoney?.divine}
              className='w-full justify-end text-muted'
              fallback={t('common.noData')}
              iconClassName='size-5'
            />
          ),
        },
      ),
      columnHelper.accessor(
        (row) => row.absoluteImprovement ?? Number.NEGATIVE_INFINITY,
        {
          id: 'absoluteImprovement',
          header: t('scarabs.combinations.delta'),
          cell: ({ row }) => (
            <CurrencyAmount
              className={cn(
                'w-full justify-end font-semibold',
                row.original.absoluteImprovement &&
                  row.original.absoluteImprovement > 0 &&
                  'text-profit',
                row.original.absoluteImprovement &&
                  row.original.absoluteImprovement < 0 &&
                  'text-loss',
              )}
              chaosValue={row.original.absoluteImprovementMoney?.chaos}
              divineValue={row.original.absoluteImprovementMoney?.divine}
              fallback={t('common.noData')}
              iconClassName='size-5'
              signed
            />
          ),
        },
      ),
      columnHelper.accessor(
        (row) => row.percentageImprovement ?? Number.NEGATIVE_INFINITY,
        {
          id: 'percentageImprovement',
          header: t('scarabs.combinations.deltaPercent'),
          cell: ({ row }) => (
            <span
              className={cn(
                'block text-right font-semibold',
                row.original.percentageImprovement &&
                  row.original.percentageImprovement > 0 &&
                  'text-profit',
                row.original.percentageImprovement &&
                  row.original.percentageImprovement < 0 &&
                  'text-loss',
              )}
            >
              {formatPercentValue(
                row.original.percentageImprovement,
                language,
                t('common.noData'),
              )}
            </span>
          ),
        },
      ),
    ],
    [language, t],
  );

  const table = useReactTable({
    columns,
    data: combinations,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { pagination, sorting },
  });
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();

  if (combinations.length === 0) {
    return (
      <section className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-muted'>
        {t('scarabs.empty.combinations')}
      </section>
    );
  }

  return (
    <section className='overflow-hidden rounded-md border border-border bg-surface shadow-panel'>
      <header className='border-b border-border bg-surface-strong px-4 py-4'>
        <h2 className='m-0 text-xl font-semibold text-white'>
          {t('scarabs.combinations.title')}
        </h2>
      </header>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[40rem] table-fixed border-collapse text-base'>
          <colgroup>
            <col className='w-[42%]' />
            <col className='w-[17%]' />
            <col className='w-[17%]' />
            <col className='w-[13%]' />
            <col className='w-[11%]' />
          </colgroup>
          <thead className='border-b border-border bg-surface-strong text-left text-sm uppercase text-faint'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={cn(
                      'whitespace-nowrap px-4 py-3 font-semibold',
                      header.id === 'blockedGroups' ? '' : 'text-right',
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={cn(
                          'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                          header.id === 'blockedGroups'
                            ? 'justify-start'
                            : 'justify-end',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        type='button'
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        <SortIcon direction={header.column.getIsSorted()} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                className={cn(
                  'border-b border-white/[0.06] last:border-b-0 hover:bg-surface-soft',
                  row.index === 0 && 'bg-profit/10',
                )}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className='whitespace-nowrap px-4 py-3' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        summary={t('scarabs.pagination.summary', {
          page: currentPage,
          pages: pageCount,
          total: combinations.length,
        })}
        previousLabel={t('scarabs.pagination.previous')}
        nextLabel={t('scarabs.pagination.next')}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
      />
    </section>
  );
};
