import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { bossService, type TProfitResponse } from '@/entities/boss';
import { useLeague } from '@/entities/league';
import { queryKeys } from '@/shared/api';
import { CurrencyAmount } from '@/shared/ui';
import { BossDropsTable } from './BossDropsTable';
import { BossEntryTable } from './BossEntryTable';
import { ProfitSnapshotsTable } from './ProfitSnapshotsTable';

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

const getProfitTone = (profit: number) =>
  profit >= 0 ? 'text-profit' : 'text-loss';

const HistoryChart: FC<{ history: TProfitResponse[] }> = ({ history }) => {
  const chronological = [...history].reverse();
  const values = chronological.map((item) => item.expectedProfit.divine);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const range = max - min || 1;

  if (chronological.length === 0) {
    return (
      <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-muted'>
        No profitability history has been stored for this boss yet.
      </div>
    );
  }

  return (
    <div className='rounded border border-border bg-black/20 p-4'>
      <div className='flex h-36 items-end gap-2'>
        {chronological.map((item) => {
          const height = ((item.expectedProfit.divine - min) / range) * 100;
          return (
            <div
              className='flex min-w-8 flex-1 flex-col items-center gap-2'
              key={item.id}
            >
              <div
                className={[
                  'w-full rounded-t border border-white/10',
                  item.expectedProfit.divine >= 0
                    ? 'bg-profit/45'
                    : 'bg-loss/45',
                ].join(' ')}
                style={{ height: `${Math.max(height, 8)}%` }}
                title={`${formatDate(item.calculatedAt)}: ${
                  item.expectedProfit.divine > 0 ? '+' : ''
                }${item.expectedProfit.divine.toFixed(2)} div`}
              />
            </div>
          );
        })}
      </div>
      <div className='mt-3 flex justify-between text-base text-faint'>
        <span>{formatDate(chronological[0].calculatedAt)}</span>
        <span>
          {formatDate(chronological[chronological.length - 1].calculatedAt)}
        </span>
      </div>
    </div>
  );
};

export const BossDetailPage: FC = () => {
  const { bossId } = useParams({ from: '/bosses/$bossId' });
  const { selectedLeague } = useLeague();
  const leagueId = selectedLeague?.id;
  const detailQuery = useQuery({
    queryKey: queryKeys.bosses.detail(bossId, leagueId ?? ''),
    queryFn: () => bossService.getBossById(bossId, leagueId!),
    enabled: Boolean(leagueId),
  });
  const historyQuery = useQuery({
    queryKey: queryKeys.bosses.history(bossId, leagueId ?? ''),
    queryFn: () => bossService.getProfitHistory(bossId, leagueId!),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || detailQuery.isLoading) {
    return (
      <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden px-4 py-8 text-lg text-muted sm:px-6 lg:px-8'>
        Loading boss details...
      </section>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8'>
        <Link className='text-base text-gold-bright hover:text-white' to='/'>
          Back to bosses
        </Link>
        <div className='mt-4 rounded border border-border bg-surface px-4 py-8 text-lg text-loss'>
          Failed to load boss details.
        </div>
      </section>
    );
  }

  const detail = detailQuery.data;
  const latest = historyQuery.data?.[0];

  return (
    <section className='mx-auto box-border w-[100dvw] max-w-page overflow-x-hidden px-4 py-6 text-text sm:px-6 lg:px-8'>
      <Link
        className='text-base font-semibold text-gold-bright hover:text-white'
        to='/bosses'
      >
        Back to bosses
      </Link>

      <div className='mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='rounded-md border border-border bg-surface p-5 shadow-panel backdrop-blur-md'>
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

        <div className='grid gap-4 rounded-md border border-border bg-surface p-4 shadow-panel backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1'>
          <div className='grid gap-1 text-base'>
            <span className='text-muted'>Entry cost</span>
            <span className='font-semibold text-white sm:text-right lg:text-left'>
              <CurrencyAmount
                chaosValue={detail.entry.totalPrice?.chaos}
                className='justify-end text-xl font-semibold lg:justify-start'
                divineValue={detail.entry.totalPrice?.divine}
                fallback='Unknown'
              />
            </span>
          </div>
          <div className='grid gap-1 text-base'>
            <span className='text-muted'>Latest profit</span>
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
          <div className='grid gap-1 text-base'>
            <span className='text-muted'>ROI</span>
            <span className='font-semibold text-white sm:text-right lg:text-left'>
              {latest ? `${Math.round(latest.roiPercent)}%` : 'No data'}
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
            Profit History
          </h2>
          <span className='text-base text-muted'>
            {historyQuery.data?.length ?? 0} stored snapshots
          </span>
        </div>
        {historyQuery.isLoading ? (
          <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-muted'>
            Loading profit history...
          </div>
        ) : historyQuery.isError ? (
          <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-loss'>
            Failed to load profit history.
          </div>
        ) : (
          <HistoryChart history={historyQuery.data ?? []} />
        )}
      </section>

      {historyQuery.data && historyQuery.data.length > 0 ? (
        <ProfitSnapshotsTable snapshots={historyQuery.data} />
      ) : null}
    </section>
  );
};
