import {
  flexRender,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';
import type { ComponentProps, FC } from 'react';
import { useState } from 'react';
import { type TBossWithProfit } from '@/entities/boss';
import { CurrencyAmount, SortIcon } from '@/shared/ui';

interface IBossesTableProps {
  data: TBossWithProfit[];
}

const columnHelper = createColumnHelper<TBossWithProfit>();
const tableCurrencyClassName = 'text-xl font-semibold';

type TCurrencyAmountProps = ComponentProps<typeof CurrencyAmount>;

const getCurrencyClassName = (
  className: string,
): TCurrencyAmountProps['className'] =>
  `w-full justify-end ${tableCurrencyClassName} ${className}`;

const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'No data';

  return `${Math.round(value)}%`;
};

const getProfitClassName = (profit: number | null | undefined) => {
  if (profit === null || profit === undefined) return 'text-muted';

  return profit >= 0 ? 'text-profit' : 'text-loss';
};

const columns = [
  columnHelper.accessor('name', {
    header: 'Boss',
    cell: ({ row, getValue }) => (
      <Link
        className='text-xl font-semibold text-white transition hover:text-gold-bright flex gap-3 items-center'
        params={{ bossId: row.original.id }}
        to='/bosses/$bossId'
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
    header: 'Entry',
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.latestProfit?.entryCostChaos}
        className={getCurrencyClassName('text-muted')}
        divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
      />
    ),
  }),
  columnHelper.accessor((row) => row.latestProfit?.expectedReturnChaos ?? 0, {
    id: 'expectedReturn',
    header: 'Return',
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.latestProfit?.expectedReturnChaos}
        className={getCurrencyClassName('text-value')}
        divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
      />
    ),
  }),
  columnHelper.accessor((row) => row.latestProfit?.expectedProfitChaos ?? 0, {
    id: 'expectedProfit',
    header: 'Profit',
    cell: ({ row }) => {
      const profit = row.original.latestProfit?.expectedProfitChaos;

      return (
        <CurrencyAmount
          chaosValue={profit}
          className={getCurrencyClassName(getProfitClassName(profit))}
          divineOrbChaosValue={row.original.latestProfit?.divineOrbChaosValue}
          signed
        />
      );
    },
  }),
  columnHelper.accessor((row) => row.latestProfit?.roiPercent ?? 0, {
    id: 'roi',
    header: 'ROI',
    cell: ({ getValue }) => (
      <span className='block text-right text-xl font-semibold text-white'>
        {formatPercent(getValue())}
      </span>
    ),
  }),
];

export const BossesTable: FC<IBossesTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
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
      <table className='w-full min-w-[46rem] border-collapse text-lg'>
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
                  {header.isPlaceholder
                    ? null
                    : (
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
              className='border-b border-white/[0.06] last:border-b-0 hover:bg-surface-soft'
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
