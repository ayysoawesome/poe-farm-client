import type { FC } from 'react';
import { Outlet } from '@tanstack/react-router';
import { SelectLeague } from '@/features/select-league';

export const RootLayout: FC = () => {
  return (
    <div className='relative min-h-dvh overflow-x-hidden bg-page bg-[linear-gradient(180deg,rgb(255_232_179_/_24%),rgb(8_7_6_/_60%)_44%,#060504_100%),radial-gradient(circle_at_15%_10%,rgb(248_206_114_/_30%),transparent_28rem),radial-gradient(circle_at_82%_12%,rgb(159_199_255_/_18%),transparent_24rem),url("/bg.jpg")] bg-cover bg-fixed bg-center before:pointer-events-none before:fixed before:inset-0 before:z-0 before:bg-[linear-gradient(90deg,rgb(255_244_213_/_14%),transparent_24%,transparent_74%,rgb(255_244_213_/_12%)),rgb(255_236_190_/_8%)] before:backdrop-brightness-125 before:backdrop-saturate-[1.12] before:content-[""] after:pointer-events-none after:fixed after:inset-0 after:z-0 after:bg-[linear-gradient(rgb(255_255_255_/_3%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_3%)_1px,transparent_1px)] after:bg-[length:4rem_4rem] after:[mask-image:linear-gradient(to_bottom,rgb(0_0_0_/_85%),transparent_72%)] after:content-[""]'>
      <header className='relative z-20 border-b border-border bg-page/72 shadow-sm backdrop-blur-md'>
        <div className='flex min-h-20 w-full justify-between items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8'>
          <a
            className='flex min-w-0 items-center gap-3 text-inherit no-underline'
            href='/'
          >
            <span
              className='grid size-12 shrink-0 place-items-center rounded border border-border-strong bg-[linear-gradient(145deg,rgb(242_201_109_/_28%),rgb(35_24_12_/_86%))] text-xl font-black text-gold-bright shadow-[inset_0_0_20px_rgb(255_225_139_/_16%)]'
              aria-hidden='true'
            >
              PF
            </span>
            <span className='min-w-0'>
              <span className='block truncate text-xl font-semibold leading-6 text-white'>
                PoE Farm
              </span>
              <span className='block truncate text-base font-medium uppercase text-muted'>
                Boss profitability
              </span>
            </span>
          </a>

          <div className='w-full max-w-64 sm:w-64'>
            <SelectLeague />
          </div>
        </div>
      </header>

      <main className='relative z-10 py-20 max-w-page mx-auto'>
        <Outlet />
      </main>
    </div>
  );
};
