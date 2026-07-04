import { describe, expect, it } from 'vitest';
import { getBossDropsTableColumns } from '../ui/BossDropsTable';

describe('getBossDropsTableColumns', () => {
  it('uses fixed utility column widths and keeps item flexible', () => {
    expect(getBossDropsTableColumns(true)).toEqual([
      expect.objectContaining({ key: 'item', widthClassName: 'w-auto' }),
      expect.objectContaining({ key: 'quantity', widthClassName: 'w-14' }),
      expect.objectContaining({ key: 'chance', widthClassName: 'w-20' }),
      expect.objectContaining({ key: 'price', widthClassName: 'w-24' }),
    ]);
  });

  it('hides secondary columns on mobile but keeps price visible', () => {
    expect(getBossDropsTableColumns(true)).toEqual([
      expect.objectContaining({ key: 'item', mobileHidden: false }),
      expect.objectContaining({ key: 'quantity', mobileHidden: true }),
      expect.objectContaining({ key: 'chance', mobileHidden: true }),
      expect.objectContaining({ key: 'price', mobileHidden: false }),
    ]);
  });

  it('omits the quantity column when every row has a quantity of one', () => {
    expect(getBossDropsTableColumns(false).map((column) => column.key)).toEqual([
      'item',
      'chance',
      'price',
    ]);
  });

  it('uses compact header labels for narrow utility columns', () => {
    expect(getBossDropsTableColumns(true)).toEqual([
      expect.objectContaining({ key: 'item', headerLabelKey: 'common.item' }),
      expect.objectContaining({
        key: 'quantity',
        headerLabelKey: 'bossDetail.dropsTable.quantityShort',
      }),
      expect.objectContaining({
        key: 'chance',
        headerLabelKey: 'bossDetail.dropsTable.chanceShort',
      }),
      expect.objectContaining({ key: 'price', headerLabelKey: 'common.price' }),
    ]);
  });
});
