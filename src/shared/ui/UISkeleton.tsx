import type { ComponentPropsWithoutRef, FC } from 'react';
import { cn } from '@/shared/lib';

type TUISkeletonProps = ComponentPropsWithoutRef<'span'>;

export const UISkeleton: FC<TUISkeletonProps> = ({ className, ...props }) => {
  return (
    <span
      {...props}
      className={cn(
        'inline-block animate-pulse rounded bg-surface-soft',
        className,
      )}
      aria-hidden='true'
    />
  );
};
