import {
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/shared/lib/cn';
import { ChevronDown } from 'lucide-react';

export interface IUISelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface IUISelectProps {
  label: string;
  options: IUISelectOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
}

export const UISelect = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
  className,
  buttonClassName,
}: IUISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );
  const isDisabled = disabled || options.length === 0;

  const handleSelect = (option: IUISelectOption) => {
    if (option.disabled) return;

    onValueChange(option.value);
    setIsOpen(false);
  };

  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    disabled: isDisabled,
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-controls': listboxId,
    onClick: () => setIsOpen((current) => !current),
  };

  return (
    <div className={cn('relative min-w-48 text-base', className)}>
      <button
        className={cn(
          'flex min-h-12 w-full items-center justify-between gap-3 rounded border border-border bg-surface px-4 text-left font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_7%)] transition hover:border-border-strong hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright disabled:cursor-not-allowed disabled:opacity-60',
          buttonClassName,
        )}
        {...buttonProps}
      >
        <span className='truncate'>{selectedOption?.label ?? placeholder}</span>
        <span
          className={cn(
            'text-gold-bright transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden='true'
        >
          <ChevronDown />
        </span>
      </button>

      {isOpen ? (
        <div
          className='absolute right-0 z-20 mt-2 max-h-72 w-full overflow-auto rounded border border-border-strong bg-surface-strong p-1 shadow-panel backdrop-blur-md'
          id={listboxId}
          role='listbox'
          aria-label={label}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                className={cn(
                  'flex min-h-11 w-full items-center rounded px-4 text-left text-base text-muted transition hover:bg-surface-soft hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-bright disabled:cursor-not-allowed disabled:opacity-50',
                  isSelected &&
                    'bg-surface-soft font-semibold text-gold-bright',
                )}
                key={option.value}
                type='button'
                role='option'
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => handleSelect(option)}
              >
                <span className='truncate'>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
