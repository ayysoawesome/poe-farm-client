import {
  flexRender,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type TBossWithProfit } from '@/entities/boss';
import { CurrencyAmount, SortIcon } from '@/shared/ui';
import { cn } from '@/shared/lib';

interface IBossesTableProps {
  data: TBossWithProfit[];
  leagueId: string;
}

const columnHelper = createColumnHelper<TBossWithProfit>();

const formatPercent = (
  value: number | null | undefined,
  noDataText: string,
) => {
  if (value === null || value === undefined) return noDataText;

  return `${Math.round(value)}%`;
};

const getColumns = (leagueId: string, t: ReturnType<typeof useTranslation>['t']) => [
  columnHelper.accessor('name', {
    header: t('bosses.table.bossName'),
    cell: ({ row, getValue }) => (
      <Link
        className='text-xl font-semibold text-white transition hover:text-gold-bright flex gap-3 items-center'
        params={{ bossId: row.original.id, leagueId }}
        to='/$leagueId/bosses/$bossId'
      >
        {row.original.iconUrl && (
          <img className='size-10' src={row.original.iconUrl} />
        )}
        {getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor((row) => row.latestProfit?.entryCostChaos ?? 0, {
    id: 'entryCost',
    header: t('bosses.table.cost'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.latestProfit?.entryCostChaos}
        className='w-full justify-end'
        divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
      />
    ),
  }),
  columnHelper.accessor((row) => row.latestProfit?.expectedReturnChaos ?? 0, {
    id: 'expectedReturn',
    header: t('bosses.table.expectedReturn'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.latestProfit?.expectedReturnChaos}
        className='w-full justify-end'
        divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
      />
    ),
  }),
  columnHelper.accessor((row) => row.latestProfit?.expectedProfitChaos ?? 0, {
    id: 'expectedProfit',
    header: t('bosses.table.profit'),
    cell: ({ row }) => {
      const profit = row.original.latestProfit?.expectedProfitChaos;

      return (
        <CurrencyAmount
          chaosValue={profit}
          className={cn('w-full justify-end', {
            'text-loss': profit ? profit < 0 : undefined,
            'text-profit': profit ? profit > 0 : undefined,
          })}
          divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
          signed
        />
      );
    },
  }),
  columnHelper.accessor((row) => row.latestProfit?.roiPercent ?? 0, {
    id: 'roi',
    header: t('bosses.table.roi'),
    cell: ({ getValue }) => (
      <span
        className={cn('block text-right text-xl font-semibold text-white', {
          'text-loss': getValue() < 0,
          'text-profit': getValue() > 0,
        })}
      >
        {formatPercent(getValue(), t('common.noData'))}
      </span>
    ),
  }),
];

export const BossesTable: FC<IBossesTableProps> = ({ data, leagueId }) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'expectedProfit',
      desc: true,
    },
  ]);
  const columns = useMemo(() => getColumns(leagueId, t), [leagueId, t]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className='w-full overflow-x-auto rounded-md border border-border bg-surface'>
      <table className='w-full border-collapse text-lg'>
        <thead className='border-b border-border bg-surface-strong text-left text-base uppercase text-faint'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={[
                    'whitespace-nowrap px-6 py-4 font-semibold',
                    header.id === 'name' ? '' : 'text-right',
                  ].join(' ')}
                  key={header.id}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={[
                        'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                        header.id === 'name' ? 'justify-start' : 'justify-end',
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
              className='border-b border-white/6 last:border-b-0 hover:bg-surface-soft'
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className='whitespace-nowrap px-6 py-4' key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
