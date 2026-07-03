import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TBossDetail } from '@/entities/boss';
import { CurrencyAmount } from '@/shared/ui';

type TDrop = TBossDetail['drops'][number];
type TDropGroup = TBossDetail['dropGroups'][number];
type TVariantId = TBossDetail['selectedVariantId'];

type TDropRow = {
  id: string;
  item: TDrop['item'];
  dropRate: number | null;
  price: TDrop['price'];
  quantity?: number;
  quantityRowSpan?: number;
  skipQuantityCell?: boolean;
};

interface IBossDropsTableProps {
  drops: TDrop[];
  dropGroups: TDropGroup[];
  selectedVariantId: TVariantId;
}

const formatPercent = (value: number | null, unknownText: string) => {
  if (value === null) return unknownText;

  return `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}%`;
};

const getGroupQuantity = (
  group: TDropGroup,
  selectedVariantId: TVariantId,
) => {
  if (group.selectedQuantity !== undefined) return group.selectedQuantity;
  if (selectedVariantId === 'default') return 1;

  return group.quantityByBucket?.[selectedVariantId] ?? 1;
};

const getDropRows = (
  drops: TDrop[],
  dropGroups: TDropGroup[],
  selectedVariantId: TVariantId,
): TDropRow[] => {
  const groupedItemIds = new Set(
    dropGroups.flatMap((group) => group.items.map((item) => item.item.id)),
  );

  const dropRows: TDropRow[] = drops
    .filter((drop) => !groupedItemIds.has(drop.item.id))
    .map((drop) => ({
      id: drop.item.id,
      item: drop.item,
      dropRate: drop.dropRate,
      price: drop.price,
    }));

  const groupRows = dropGroups.flatMap((group) => {
    const quantity = getGroupQuantity(group, selectedVariantId);

    return group.items.map<TDropRow>((drop, index) => ({
      id: `${group.id}-${drop.item.id}`,
      item: drop.item,
      dropRate: drop.dropRate,
      price: drop.price,
      quantity: index === 0 ? quantity : undefined,
      quantityRowSpan: index === 0 ? group.items.length : undefined,
      skipQuantityCell: index > 0,
    }));
  });

  return [...dropRows, ...groupRows];
};

export const BossDropsTable: FC<IBossDropsTableProps> = ({
  dropGroups,
  drops,
  selectedVariantId,
}) => {
  const { t } = useTranslation();
  const rows = useMemo(
    () => getDropRows(drops, dropGroups, selectedVariantId),
    [dropGroups, drops, selectedVariantId],
  );
  const showQuantity = rows.some((row) => row.quantity && row.quantity !== 1);

  const renderHeader = (label: string, align: 'left' | 'right' = 'left') => (
    <th
      className={[
        'px-3 py-3 font-semibold uppercase text-faint',
        align === 'right' ? 'text-right' : 'text-left',
      ].join(' ')}
    >
      {label}
    </th>
  );

  return (
    <section className='h-fit rounded-md border border-border bg-surface shadow-panel backdrop-blur-md'>
      <div className='border-b border-border bg-surface-strong px-4 py-3'>
        <h2 className='m-0 text-base font-semibold uppercase text-faint'>
          {t('bossDetail.drops')}
        </h2>
      </div>
      <table className='w-full table-fixed border-collapse text-sm sm:text-base'>
        <thead className='border-b border-border text-left text-sm uppercase text-faint sm:text-base'>
          <tr>
            {renderHeader(t('common.item'))}
            {showQuantity ? renderHeader(t('common.quantity'), 'right') : null}
            {renderHeader(t('common.chance'), 'right')}
            {renderHeader(t('common.price'), 'right')}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className='border-b border-white/[0.06] last:border-b-0'
              key={row.id}
            >
              <td className='min-w-0 px-3 py-3 align-middle'>
                <div className='flex min-w-0 items-center gap-2'>
                  {row.item.iconUrl && (
                    <img
                      src={row.item.iconUrl}
                      alt={row.item.name}
                      className='size-6 shrink-0 sm:size-7'
                    />
                  )}
                  <span className='min-w-0 truncate font-semibold text-white'>
                    {row.item.name}
                  </span>
                </div>
              </td>
              {showQuantity && row.quantityRowSpan ? (
                <td
                  className='w-16 px-3 py-3 text-right align-middle font-semibold text-white'
                  rowSpan={row.quantityRowSpan}
                >
                  {row.quantity}
                </td>
              ) : showQuantity && !row.skipQuantityCell ? (
                <td className='w-16 px-3 py-3 text-right align-middle text-muted'>
                  1
                </td>
              ) : null}
              <td className='w-20 px-3 py-3 text-right align-middle text-muted'>
                {formatPercent(row.dropRate, t('common.unknown'))}
              </td>
              <td className='w-24 px-3 py-3 align-middle'>
                <CurrencyAmount
                  chaosValue={row.price?.chaos}
                  className='w-full justify-end font-semibold'
                  divineValue={row.price?.divine}
                  fallback={t('common.unknown')}
                  iconClassName='size-5 sm:size-6'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
