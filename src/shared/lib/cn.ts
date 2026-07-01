import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы (clsx) и разрешает конфликты Tailwind-утилит (tailwind-merge).
 * Пример: cn('px-2 py-1', condition && 'px-4') => 'py-1 px-4'
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
