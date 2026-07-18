import { describe, expect, it } from 'vitest';
import { getPaginationItems } from '../Pagination.model';

describe('getPaginationItems', () => {
  it('shows the first three pages, current page area, and last three pages', () => {
    expect(getPaginationItems(10, 20)).toEqual([
      1,
      2,
      3,
      'start-ellipsis',
      8,
      9,
      10,
      11,
      12,
      'end-ellipsis',
      18,
      19,
      20,
    ]);
  });

  it('does not add ellipses or duplicate page numbers when ranges overlap', () => {
    expect(getPaginationItems(4, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
