import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { FC } from 'react';
import { useState } from 'react';
import type { TBossDetail } from '@/entities/boss';
import { CurrencyAmount, SortIcon } from '@/shared/ui';

type TDrop = TBossDetail['drops'][number];

interface IBossDropsTableProps {
  drops: TDrop[];
}

const formatPercent = (value: number | null) => {
  if (value === null) return 'Unknown';

  return `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}%`;
};

const columnHelper = createColumnHelper<TDrop>();

const columns = [
  columnHelper.accessor((row) => row.item.name, {
    id: 'item',
    header: 'Item',
    cell: ({ getValue, row }) => (
      <div className='flex items-center gap-2'>
        {row.original.item.iconUrl && (
          <img
            src={row.original.item.iconUrl}
            alt={row.original.item.name}
            className='size-7 shrink-0'
          />
        )}
        <span className='font-semibold text-white'>{getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('dropRate', {
    header: 'Chance',
    cell: ({ getValue }) => (
      <span className='block text-right text-muted'>
        {formatPercent(getValue())}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.price?.chaos ?? 0, {
    id: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.price?.chaos}
        className='w-full justify-end font-semibold'
        divineValue={row.original.price?.divine}
        fallback='Unknown'
      />
    ),
  }),
];

export const BossDropsTable: FC<IBossDropsTableProps> = ({ drops }) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'price',
      desc: true,
    },
  ]);
  const table = useReactTable({
    columns,
    data: drops,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <section className='rounded-md border border-border bg-surface shadow-panel backdrop-blur-md h-fit'>
      <div className='border-b border-border bg-surface-strong px-4 py-3'>
        <h2 className='m-0 text-base font-semibold uppercase text-faint'>
          Drops
        </h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[40rem] border-collapse text-base'>
          <thead className='border-b border-border text-left text-base uppercase text-faint'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={[
                      'px-4 py-3',
                      header.id === 'dropRate' || header.id === 'price'
                        ? 'text-right'
                        : '',
                    ].join(' ')}
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={[
                          'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                          header.id === 'item'
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
