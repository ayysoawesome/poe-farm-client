import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TProfitResponse } from '@/entities/boss';
import { CurrencyAmount, SortIcon } from '@/shared/ui';

interface IProfitSnapshotsTableProps {
  snapshots: TProfitResponse[];
}

const formatDate = (timestamp: number, language: string) =>
  new Intl.DateTimeFormat(language, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

const getProfitTone = (profit: number) =>
  profit >= 0 ? 'text-profit' : 'text-loss';

const columnHelper = createColumnHelper<TProfitResponse>();

const getColumns = (
  t: ReturnType<typeof useTranslation>['t'],
  language: string,
) => [
  columnHelper.accessor('calculatedAt', {
    header: t('bossDetail.snapshots.calculated'),
    cell: ({ getValue }) => (
      <span className='text-muted'>{formatDate(getValue(), language)}</span>
    ),
  }),
  columnHelper.accessor((row) => row.entryCost.chaos, {
    id: 'entryCost',
    header: t('bosses.table.cost'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.entryCost.chaos}
        className='w-full justify-end font-semibold text-muted'
        divineValue={row.original.entryCost.divine}
      />
    ),
  }),
  columnHelper.accessor((row) => row.expectedReturn.chaos, {
    id: 'expectedReturn',
    header: t('bosses.table.expectedReturn'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.expectedReturn.chaos}
        className='w-full justify-end font-semibold text-value'
        divineValue={row.original.expectedReturn.divine}
      />
    ),
  }),
  columnHelper.accessor((row) => row.expectedProfit.chaos, {
    id: 'expectedProfit',
    header: t('bosses.table.profit'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.expectedProfit.chaos}
        className={[
          'w-full justify-end font-semibold',
          getProfitTone(row.original.expectedProfit.divine),
        ].join(' ')}
        divineValue={row.original.expectedProfit.divine}
        signed
      />
    ),
  }),
  columnHelper.accessor('roiPercent', {
    header: t('bosses.table.roi'),
    cell: ({ getValue }) => (
      <span className='block text-right text-white'>
        {Math.round(getValue())}%
      </span>
    ),
  }),
  columnHelper.accessor('unknownDropCount', {
    header: t('bossDetail.snapshots.unknownDrops'),
    cell: ({ getValue }) => (
      <span className='block text-right text-muted'>{getValue()}</span>
    ),
  }),
];

export const ProfitSnapshotsTable: FC<IProfitSnapshotsTableProps> = ({
  snapshots,
}) => {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => getColumns(t, language), [language, t]);
  const table = useReactTable({
    columns,
    data: snapshots,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <section className='mt-4 rounded-md border border-border bg-surface shadow-panel backdrop-blur-md'>
      <div className='border-b border-border bg-surface-strong px-4 py-3'>
        <h2 className='m-0 text-base font-semibold uppercase text-faint'>
          {t('bossDetail.snapshots.title')}
        </h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[50rem] border-collapse text-base'>
          <thead className='border-b border-border text-left text-base uppercase text-faint'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={[
                      'px-4 py-3',
                      header.id === 'calculatedAt' ? '' : 'text-right',
                    ].join(' ')}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <button
                            className={[
                              'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                              header.id === 'calculatedAt'
                                ? 'justify-start'
                                : 'justify-end',
                            ].join(' ')}
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
                className='border-b border-white/[0.06] last:border-b-0'
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className='px-4 py-3' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
