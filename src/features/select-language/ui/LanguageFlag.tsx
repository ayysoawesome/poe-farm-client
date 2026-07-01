import type { FC } from 'react';

interface ILanguageFlagProps {
  code: 'ru' | 'us';
}

export const LanguageFlag: FC<ILanguageFlagProps> = ({ code }) => {
  if (code === 'ru') {
    return (
      <svg
        className='h-4 w-6 shrink-0 overflow-hidden rounded-sm shadow-[0_0_0_1px_rgb(255_255_255_/_18%)]'
        viewBox='0 0 24 16'
        aria-hidden='true'
      >
        <rect width='24' height='16' fill='#fff' />
        <rect y='5.333' width='24' height='5.334' fill='#1c57a7' />
        <rect y='10.667' width='24' height='5.333' fill='#d52b1e' />
      </svg>
    );
  }

  return (
    <svg
      className='h-4 w-6 shrink-0 overflow-hidden rounded-sm shadow-[0_0_0_1px_rgb(255_255_255_/_18%)]'
      viewBox='0 0 24 16'
      aria-hidden='true'
    >
      <rect width='24' height='16' fill='#fff' />
      {Array.from({ length: 7 }, (_, index) => (
        <rect
          key={index}
          y={index * 2.4615}
          width='24'
          height='1.2308'
          fill='#b22234'
        />
      ))}
      <rect width='10.6' height='8.615' fill='#3c3b6e' />
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 6 }, (_, column) => (
          <circle
            key={`${row}-${column}`}
            cx={0.9 + column * 1.75}
            cy={0.8 + row * 1.55}
            r='0.18'
            fill='#fff'
          />
        )),
      )}
    </svg>
  );
};
