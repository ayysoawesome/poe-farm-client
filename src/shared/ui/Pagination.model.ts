export type TPaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

const createPageRange = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export const getPaginationItems = (
  currentPage: number,
  pageCount: number,
): TPaginationItem[] => {
  if (pageCount <= 0) return [];

  const normalizedCurrentPage = Math.min(Math.max(currentPage, 1), pageCount);
  const ranges = [
    createPageRange(1, Math.min(3, pageCount)),
    createPageRange(
      Math.max(1, normalizedCurrentPage - 2),
      Math.min(pageCount, normalizedCurrentPage + 2),
    ),
    createPageRange(Math.max(1, pageCount - 2), pageCount),
  ];
  const pageNumbers = Array.from(new Set(ranges.flat())).sort((a, b) => a - b);

  return pageNumbers.reduce<TPaginationItem[]>((items, pageNumber) => {
    const previousItem = items.at(-1);

    if (typeof previousItem === 'number') {
      const gap = pageNumber - previousItem;

      if (gap === 2) {
        items.push(previousItem + 1);
      } else if (gap > 2) {
        items.push(items.includes('start-ellipsis') ? 'end-ellipsis' : 'start-ellipsis');
      }
    }

    items.push(pageNumber);

    return items;
  }, []);
};
