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
import type { TBossDetail } from '@/entities/boss';
import { CurrencyAmount, SortIcon } from '@/shared/ui';

type TEntryComponent = TBossDetail['entry']['components'][number];

interface IBossEntryTableProps {
  components: TEntryComponent[];
}

const columnHelper = createColumnHelper<TEntryComponent>();

const getColumns = (t: ReturnType<typeof useTranslation>['t']) => [
  columnHelper.accessor((row) => row.item.name, {
    id: 'item',
    header: t('common.item'),
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
  columnHelper.accessor('quantity', {
    header: t('common.quantity'),
    cell: ({ getValue }) => (
      <span className='block text-right text-muted'>{getValue()}</span>
    ),
  }),
  columnHelper.accessor((row) => row.unitPrice?.chaos ?? 0, {
    id: 'unitPrice',
    header: t('common.unit'),
    cell: ({ row }) => (
      <CurrencyAmount
        className='w-full justify-end font-semibold'
        chaosValue={row.original.unitPrice?.chaos}
        divineValue={row.original.unitPrice?.divine}
        fallback={t('common.unknown')}
      />
    ),
  }),
  columnHelper.accessor((row) => row.totalPrice?.chaos ?? 0, {
    id: 'totalPrice',
    header: t('common.total'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.totalPrice?.chaos}
        className='w-full justify-end font-semibold text-white'
        divineValue={row.original.totalPrice?.divine}
        fallback={t('common.unknown')}
      />
    ),
  }),
];

export const BossEntryTable: FC<IBossEntryTableProps> = ({ components }) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'totalPrice',
      desc: true,
    },
  ]);
  const columns = useMemo(() => getColumns(t), [t]);
  const table = useReactTable({
    columns,
    data: components,
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
          {t('bossDetail.entry')}
        </h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-xl border-collapse text-base'>
          <thead className='border-b border-border text-left text-base uppercase text-faint'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={[
                      'px-4 py-3',
                      header.id === 'quantity' ||
                      header.id === 'unitPrice' ||
                      header.id === 'totalPrice'
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
