import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface IUIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const UIButton: FC<IUIButtonProps> = ({
  text,
  icon,
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) => {
  return (
    <button
      className={cn(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        className,
      )}
      type={type}
      {...props}
    >
      {icon}
      {text ?? children}
    </button>
  );
};
