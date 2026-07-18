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
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TGroupedScarabsResponse } from '@/entities/scarab';
import { cn } from '@/shared/lib';
import { CurrencyAmount, SortIcon } from '@/shared/ui';
import { formatInteger } from '../model/scarabFormat';

interface IGroupedScarabsTableProps {
  groups: TGroupedScarabsResponse['groups'];
}

type TGroupedScarab =
  TGroupedScarabsResponse['groups'][number]['scarabs'][number];
type TGroupedScarabGroup = TGroupedScarabsResponse['groups'][number];
type TMoney = NonNullable<TGroupedScarab['price']>['value'];

interface IGroupedScarabsGroupTableProps {
  group: TGroupedScarabGroup;
  language: string;
}

const columnHelper = createColumnHelper<TGroupedScarab>();

const getWeightedValue = (scarab: TGroupedScarab) =>
  scarab.price &&
  scarab.isEnabled &&
  scarab.isIncludedInCalculation &&
  scarab.dropWeight
    ? scarab.dropWeight * scarab.price.chaos
    : null;

const getWeightedValueMoney = (scarab: TGroupedScarab): TMoney =>
  scarab.price?.value &&
  scarab.isEnabled &&
  scarab.isIncludedInCalculation &&
  scarab.dropWeight
    ? {
        chaos: scarab.dropWeight * scarab.price.value.chaos,
        divine: scarab.dropWeight * scarab.price.value.divine,
      }
    : null;

const getAveragePriceMoney = (group: TGroupedScarabGroup): TMoney => {
  const prices = group.scarabs.flatMap((scarab) =>
    scarab.price?.value ? [scarab.price.value] : [],
  );

  if (prices.length === 0) return null;

  return {
    chaos: prices.reduce((sum, price) => sum + price.chaos, 0) / prices.length,
    divine:
      prices.reduce((sum, price) => sum + price.divine, 0) / prices.length,
  };
};

const getCellClassName = (columnId: string) =>
  columnId === 'item' ? 'min-w-56 px-4 py-3' : 'whitespace-nowrap px-4 py-3';

const GroupedScarabsGroupTable: FC<IGroupedScarabsGroupTableProps> = ({
  group,
  language,
}) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.item.name, {
        id: 'item',
        header: t('common.item'),
        cell: ({ row, getValue }) => (
          <div className='flex min-w-0 items-center gap-2'>
            {row.original.item.iconUrl ? (
              <img
                src={row.original.item.iconUrl}
                alt=''
                className='size-7 shrink-0'
              />
            ) : null}
            <div className='min-w-0'>
              <span className='block truncate font-semibold text-white'>
                {getValue()}
              </span>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('dropWeight', {
        id: 'weight',
        header: t('scarabs.table.weight'),
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span className='block text-right text-muted'>
              {value ? formatInteger(value, language) : 'No data'}
            </span>
          );
        },
      }),
      columnHelper.accessor(
        (row) => row.price?.chaos ?? Number.NEGATIVE_INFINITY,
        {
          id: 'price',
          header: t('common.price'),
          cell: ({ row }) => (
            <CurrencyAmount
              chaosValue={row.original.price?.value?.chaos}
              divineValue={row.original.price?.value?.divine}
              className='w-full justify-end font-semibold'
              fallback={t('scarabs.table.missingPrice')}
              iconClassName='size-5'
            />
          ),
        },
      ),
      columnHelper.accessor(
        (row) => getWeightedValue(row) ?? Number.NEGATIVE_INFINITY,
        {
          id: 'weightedValue',
          header: t('scarabs.table.weightedValue'),
          cell: ({ row }) => {
            const weightedValueMoney = getWeightedValueMoney(row.original);

            return (
              <CurrencyAmount
                chaosValue={weightedValueMoney?.chaos}
                divineValue={weightedValueMoney?.divine}
                className='w-full justify-end font-semibold text-white'
                fallback={t('common.noData')}
                iconClassName='size-5'
              />
            );
          },
        },
      ),
      columnHelper.accessor('isIncludedInCalculation', {
        id: 'included',
        header: t('scarabs.table.included'),
        cell: ({ getValue }) => (
          <span
            className={cn(
              'block text-right font-semibold',
              getValue() ? 'text-profit' : 'text-loss',
            )}
          >
            {getValue() ? t('scarabs.table.yes') : t('scarabs.table.no')}
          </span>
        ),
      }),
    ],
    [language, t],
  );

  const table = useReactTable({
    columns,
    data: group.scarabs,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[48rem] table-fixed border-collapse text-base'>
        <colgroup>
          <col className='w-[42%]' />
          <col className='w-[14%]' />
          <col className='w-[16%]' />
          <col className='w-[18%]' />
          <col className='w-[10%]' />
        </colgroup>
        <thead className='border-b border-border text-left text-sm uppercase text-faint'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className={cn(
                    'whitespace-nowrap px-4 py-3 font-semibold',
                    header.id === 'item' ? '' : 'text-right',
                  )}
                  key={header.id}
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={cn(
                        'inline-flex w-full items-center gap-2 font-semibold uppercase text-faint transition hover:text-white',
                        header.id === 'item' ? 'justify-start' : 'justify-end',
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
              className='border-b border-white/[0.06] last:border-b-0 hover:bg-surface-soft'
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className={getCellClassName(cell.column.id)} key={cell.id}>
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

export const GroupedScarabsTable: FC<IGroupedScarabsTableProps> = ({
  groups,
}) => {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  if (groups.length === 0) {
    return (
      <section className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-muted'>
        {t('scarabs.empty.grouped')}
      </section>
    );
  }

  return (
    <section className='grid gap-4'>
      <div>
        <h1 className='m-0 text-3xl font-bold text-white'>
          {t('scarabs.title')}
        </h1>
        <p className='m-0 mt-2 text-lg text-muted'>
          {t('scarabs.description')}
        </p>
      </div>

      {groups.map((group) => (
        <GroupedScarabsGroup
          group={group}
          key={group.groupId ?? 'ungrouped'}
          language={language}
        />
      ))}
    </section>
  );
};

interface IGroupedScarabsGroupProps {
  group: TGroupedScarabGroup;
  language: string;
}

const GroupedScarabsGroup: FC<IGroupedScarabsGroupProps> = ({
  group,
  language,
}) => {
  const { t } = useTranslation();
  const averagePriceMoney = getAveragePriceMoney(group);

  return (
    <details
      open
      className='group overflow-hidden rounded-md border border-border bg-surface shadow-panel'
    >
      <summary className='list-none cursor-pointer border-b border-border bg-surface-strong px-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden'>
        <div className='flex items-start gap-3'>
          <div className='flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <img src={group.groupIconUrl ?? ''} className='size-8' />
                <h2 className='m-0 text-xl font-semibold text-white'>
                  {group.groupName}
                </h2>
                <span
                  className={cn(
                    'rounded border px-2 py-0.5 text-sm font-semibold uppercase',
                    group.isBlockable
                      ? 'border-profit/40 text-profit'
                      : 'border-border text-faint',
                  )}
                >
                  {group.isBlockable
                    ? t('scarabs.group.blockable')
                    : t('scarabs.group.notBlockable')}
                </span>
              </div>
              <p className='m-0 mt-1 text-sm text-muted'>
                {t('scarabs.group.summary', {
                  scarabs: group.scarabCount,
                  enabled: group.enabledScarabCount,
                  priced: group.pricedScarabCount,
                })}
              </p>
            </div>

            <dl className='grid grid-cols-2 gap-x-5 gap-y-2 text-right sm:grid-cols-3'>
              <div>
                <dt className='text-xs uppercase text-faint'>
                  {t('scarabs.group.totalWeight')}
                </dt>
                <dd className='m-0 font-semibold text-white'>
                  {formatInteger(group.totalWeight, language)}
                </dd>
              </div>
              <div>
                <dt className='text-xs uppercase text-faint'>
                  {t('scarabs.group.avgPrice')}
                </dt>
                <dd className='m-0 font-semibold text-white'>
                  <CurrencyAmount
                    chaosValue={averagePriceMoney?.chaos}
                    divineValue={averagePriceMoney?.divine}
                    className='justify-end'
                    fallback={t('common.noData')}
                    iconClassName='size-5'
                  />
                </dd>
              </div>
              <div>
                <dt className='text-xs uppercase text-faint'>
                  {t('scarabs.group.expectedValue')}
                </dt>
                <dd className='m-0 font-semibold text-value'>
                  <CurrencyAmount
                    chaosValue={group.expectedValueMoney?.chaos}
                    divineValue={group.expectedValueMoney?.divine}
                    className='justify-end'
                    fallback={t('common.noData')}
                    iconClassName='size-5'
                  />
                </dd>
              </div>
            </dl>
          </div>
          <ChevronDown className='mt-1 size-5 shrink-0 text-gold-bright transition-transform group-open:rotate-180' />
        </div>
      </summary>

      <GroupedScarabsGroupTable group={group} language={language} />
    </details>
  );
};
