import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { bossService } from '@/entities/boss';
import { queryKeys } from '@/shared/api';
import { CurrencyAmount, UISkeleton } from '@/shared/ui';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import { BossDropsTable } from './BossDropsTable';
import { BossEntryTable } from './BossEntryTable';
import { ProfitHistoryChart } from './ProfitHistoryChart';
import { ProfitSnapshotsTable } from './ProfitSnapshotsTable';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib';

const getProfitTone = (profit: number) =>
  profit >= 0 ? 'text-profit' : 'text-loss';

const backIconLinkClassName =
  'inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-soft text-gold-bright transition hover:border-border-strong hover:bg-surface-soft/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright';

export const BossDetailPage: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { bossId } = useParams({ strict: false });
  const leagueId = getLeagueIdFromPathname(location.pathname);
  const detailQuery = useQuery({
    queryKey: queryKeys.bosses.detail(bossId ?? '', leagueId ?? ''),
    queryFn: () => bossService.getBossById(bossId!, leagueId!),
    enabled: Boolean(leagueId && bossId),
  });
  const historyQuery = useQuery({
    queryKey: queryKeys.bosses.history(bossId ?? '', leagueId ?? ''),
    queryFn: () => bossService.getProfitHistory(bossId!, leagueId!),
    enabled: Boolean(leagueId && bossId),
  });

  if (!leagueId || !bossId || detailQuery.isLoading) {
    return (
      <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden px-4 py-6 text-text sm:px-6 lg:px-8'>
        <UISkeleton className='h-5 w-28' />

        <div className='mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]'>
          <div className='rounded-md border border-border bg-surface p-5 shadow-panel backdrop-blur-md'>
            <div className='flex items-center gap-3'>
              <UISkeleton className='size-15 shrink-0' />
              <UISkeleton className='h-10 w-56' />
            </div>
            <UISkeleton className='mt-4 h-5 w-full max-w-3xl' />
            <UISkeleton className='mt-3 h-5 w-2/3 max-w-2xl' />
          </div>

          <div className='grid gap-4 rounded-md border border-border bg-surface p-4 shadow-panel backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1'>
            {Array.from({ length: 3 }, (_, index) => (
              <div
                className='flex items-center justify-between gap-4'
                key={index}
              >
                <UISkeleton className='h-4 w-24' />
                <UISkeleton className='h-6 w-20' />
              </div>
            ))}
          </div>
        </div>

        <div className='mt-4 grid gap-4 lg:grid-cols-2'>
          <UISkeleton className='block h-72 w-full rounded-md border border-border bg-surface shadow-panel' />
          <UISkeleton className='block h-72 w-full rounded-md border border-border bg-surface shadow-panel' />
        </div>
      </section>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8'>
        {leagueId ? (
          <Link
            aria-label={t('bossDetail.backToBosses')}
            className={backIconLinkClassName}
            params={{ leagueId }}
            to='/$leagueId/bosses'
          >
            <ArrowLeft aria-hidden='true' className='size-5' />
          </Link>
        ) : (
          <Link
            aria-label={t('bossDetail.backToBosses')}
            className={backIconLinkClassName}
            to='/bosses'
          >
            <ArrowLeft aria-hidden='true' className='size-5' />
          </Link>
        )}
        <div className='mt-4 rounded border border-border bg-surface px-4 py-8 text-lg text-loss'>
          {t('bossDetail.errors.details')}
        </div>
      </section>
    );
  }

  const detail = detailQuery.data;
  const detailHistory = detail.profit.history;
  const fallbackHistory = historyQuery.data ?? [];
  const profitHistory =
    detailHistory.length > 0 ? detailHistory : fallbackHistory;
  const isHistoryLoading = detailHistory.length === 0 && historyQuery.isLoading;
  const isHistoryError = detailHistory.length === 0 && historyQuery.isError;
  const latest = detail.profit.latest ?? fallbackHistory[0];

  return (
    <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden text-text'>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='rounded-md border border-border bg-surface p-5 shadow-panel backdrop-blur-md flex gap-5'>
          {leagueId ? (
            <Link
              aria-label={t('bossDetail.backToBosses')}
              className={backIconLinkClassName}
              params={{ leagueId }}
              to='/$leagueId/bosses'
            >
              <ArrowLeft aria-hidden='true' className='size-5' />
            </Link>
          ) : (
            <Link
              aria-label={t('bossDetail.backToBosses')}
              className={backIconLinkClassName}
              to='/bosses'
            >
              <ArrowLeft aria-hidden='true' className='size-5' />
            </Link>
          )}
          <div className='flex flex-col'>
            <div className='flex gap-3 items-center'>
              {detail.boss.iconUrl && (
                <img
                  src={detail.boss.iconUrl}
                  alt={detail.boss.name}
                  className='size-15 shrink-0'
                />
              )}
              <h1 className='m-0 text-4xl font-semibold text-white'>
                {detail.boss.name}
              </h1>
            </div>
            <p className='mt-3 max-w-3xl text-lg leading-8 text-muted'>
              {detail.boss.description ?? detail.boss.slug}
            </p>
          </div>
        </div>

        <div className='grid gap-4 rounded-md border border-border bg-surface p-4 shadow-panel backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1'>
          <div className='flex items-center justify-between text-base'>
            <span className='text-muted'>{t('bossDetail.cost')}</span>
            <span className='font-semibold text-white sm:text-right lg:text-left'>
              <CurrencyAmount
                chaosValue={detail.entry.totalPrice?.chaos}
                className='justify-end text-xl font-semibold lg:justify-start'
                divineValue={detail.entry.totalPrice?.divine}
                fallback={t('common.unknown')}
              />
            </span>
          </div>
          <div className='flex items-center justify-between text-base'>
            <span className='text-muted'>{t('bossDetail.profitPerRun')}</span>
            <CurrencyAmount
              chaosValue={latest?.expectedProfit.chaos}
              className={[
                'justify-end text-xl font-semibold lg:justify-start',
                latest
                  ? getProfitTone(latest.expectedProfit.divine)
                  : 'text-muted',
              ].join(' ')}
              divineValue={latest?.expectedProfit.divine}
              signed
            />
          </div>
          <div className='flex items-center justify-between text-base'>
            <span className='text-muted'>{t('bosses.table.roi')}</span>
            <span
              className={cn(
                'font-semibold text-white sm:text-right lg:text-left text-xl',
                {
                  'text-muted': !latest,
                  'text-loss': latest?.expectedProfit.divine < 0,
                  'text-profit': latest?.expectedProfit.divine >= 0,
                },
              )}
            >
              {latest
                ? `${Math.round(latest.roiPercent)}%`
                : t('common.noData')}
            </span>
          </div>
        </div>
      </div>

      <div className='mt-4 grid gap-4 lg:grid-cols-2'>
        <BossEntryTable components={detail.entry.components} />
        <BossDropsTable drops={detail.drops} />
      </div>

      <section className='mt-4 rounded-md border border-border bg-surface p-4 shadow-panel backdrop-blur-md'>
        <div className='mb-3 flex items-center justify-between gap-4'>
          <h2 className='m-0 text-base font-semibold uppercase text-faint'>
            {t('bossDetail.history.title')}
          </h2>
          <span className='text-base text-muted'>
            {t('bossDetail.history.snapshotsCount', {
              count: profitHistory.length,
            })}
          </span>
        </div>
        {isHistoryLoading ? (
          <div className='rounded border border-border bg-black/20 p-4'>
            <div className='flex h-36 items-end gap-2'>
              {Array.from({ length: 8 }, (_, index) => (
                <UISkeleton
                  className='min-w-8 flex-1 rounded-t'
                  key={index}
                  style={{ height: `${28 + (index % 4) * 14}%` }}
                />
              ))}
            </div>
            <div className='mt-3 flex justify-between'>
              <UISkeleton className='h-4 w-24' />
              <UISkeleton className='h-4 w-24' />
            </div>
          </div>
        ) : isHistoryError ? (
          <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-loss'>
            {t('bossDetail.errors.history')}
          </div>
        ) : (
          <ProfitHistoryChart history={profitHistory} />
        )}
      </section>

      {profitHistory.length > 0 ? (
        <ProfitSnapshotsTable snapshots={profitHistory} />
      ) : null}
    </section>
  );
};
