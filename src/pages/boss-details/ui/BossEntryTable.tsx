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
      <div className='flex min-w-0 items-center gap-2'>
        {row.original.item.iconUrl && (
          <img
            src={row.original.item.iconUrl}
            alt={row.original.item.name}
            className='size-6 shrink-0 sm:size-7'
          />
        )}
        <div className='min-w-0'>
          <span
            className='block min-w-0 truncate font-semibold text-white'
            title={getValue()}
          >
            {getValue()}
          </span>
          <div className='mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted sm:hidden'>
            <span>
              {t('common.quantity')}: {row.original.quantity}
            </span>
            <CurrencyAmount
              chaosValue={row.original.unitPrice?.chaos}
              className='font-semibold whitespace-nowrap'
              divineValue={row.original.unitPrice?.divine}
              fallback={t('common.unknown')}
              iconClassName='size-4'
            />
          </div>
        </div>
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
        className='w-full justify-end font-semibold whitespace-nowrap'
        chaosValue={row.original.unitPrice?.chaos}
        divineValue={row.original.unitPrice?.divine}
        fallback={t('common.unknown')}
        iconClassName='size-5 sm:size-6'
      />
    ),
  }),
  columnHelper.accessor((row) => row.totalPrice?.chaos ?? 0, {
    id: 'totalPrice',
    header: t('common.total'),
    cell: ({ row }) => (
      <CurrencyAmount
        chaosValue={row.original.totalPrice?.chaos}
        className='w-full justify-end font-semibold text-white whitespace-nowrap'
        divineValue={row.original.totalPrice?.divine}
        fallback={t('common.unknown')}
        iconClassName='size-5 sm:size-6'
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
    <section className='h-fit rounded-md border border-border bg-surface shadow-panel backdrop-blur-md'>
      <div className='border-b border-border bg-surface-strong px-4 py-3'>
        <h2 className='m-0 text-base font-semibold uppercase text-faint'>
          {t('bossDetail.entry')}
        </h2>
      </div>
      <table className='w-full table-fixed border-collapse text-sm sm:text-base'>
        <colgroup>
          <col className='w-auto' />
          <col className='hidden w-16 sm:table-column' />
          <col className='hidden w-24 md:table-column' />
          <col className='w-24 sm:w-28' />
        </colgroup>
        <thead className='border-b border-border text-left text-sm uppercase text-faint sm:text-base'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={[
                    'px-3 py-3',
                    header.id === 'quantity' ||
                    header.id === 'unitPrice' ||
                    header.id === 'totalPrice'
                      ? 'text-right'
                      : '',
                    header.id === 'quantity' ? 'hidden sm:table-cell' : '',
                    header.id === 'unitPrice' ? 'hidden md:table-cell' : '',
                  ].join(' ')}
                  key={header.id}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={[
                        'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                        header.id === 'item' ? 'justify-start' : 'justify-end',
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
              className='border-b border-white/6 last:border-b-0'
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={[
                    'px-3 py-3 align-middle',
                    cell.column.id === 'item' ? 'min-w-0' : '',
                    cell.column.id === 'quantity' ? 'hidden sm:table-cell' : '',
                    cell.column.id === 'unitPrice'
                      ? 'hidden md:table-cell'
                      : '',
                  ].join(' ')}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
