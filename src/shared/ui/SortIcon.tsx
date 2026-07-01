import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { FC } from 'react';

interface ISortIconProps {
  direction: false | 'asc' | 'desc';
}

export const SortIcon: FC<ISortIconProps> = ({ direction }) => {
  const Icon =
    direction === 'asc'
      ? ArrowUp
      : direction === 'desc'
        ? ArrowDown
        : ArrowUpDown;

  return (
    <Icon aria-hidden='true' className='size-4 shrink-0' strokeWidth={2} />
  );
};
