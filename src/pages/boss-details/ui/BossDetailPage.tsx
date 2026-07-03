import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from '@tanstack/react-router';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bossService, type TBossDetail } from '@/entities/boss';
import { queryKeys } from '@/shared/api';
import { CurrencyAmount, UISelect, UISkeleton } from '@/shared/ui';
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

type TVariantId = TBossDetail['selectedVariantId'];

const variantIds: TVariantId[] = ['default', 'low', 'mid', 'high'];

const getVariantIdFromSearch = (): TVariantId | null => {
  if (typeof window === 'undefined') return null;

  const variantId = new URLSearchParams(window.location.search).get(
    'variantId',
  );

  return variantIds.includes(variantId as TVariantId)
    ? (variantId as TVariantId)
    : null;
};

const updateVariantIdSearch = (variantId: TVariantId) => {
  const url = new URL(window.location.href);
  url.searchParams.set('variantId', variantId);
  window.history.replaceState(window.history.state, '', url);
};

export const BossDetailPage: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { bossId } = useParams({ strict: false });
  const leagueId = getLeagueIdFromPathname(location.pathname);
  const [requestedVariantId, setRequestedVariantId] = useState<TVariantId | null>(
    getVariantIdFromSearch,
  );
  const detailQuery = useQuery({
    queryKey: queryKeys.bosses.detail(
      bossId ?? '',
      leagueId ?? '',
      requestedVariantId,
    ),
    queryFn: () => bossService.getBossById(bossId!, leagueId!, requestedVariantId),
    enabled: Boolean(leagueId && bossId),
  });
  const variantOptions = useMemo(
    () => {
      const variants = detailQuery.data?.variants ?? [];

      return variants.map((variant) => ({
        value: variant.id,
        label: variant.label,
      }));
    },
    [detailQuery.data?.variants],
  );

  if (!leagueId || !bossId || detailQuery.isLoading) {
    return (
      <section className='mx-auto box-border max-w-page overflow-x-hidden text-text'>
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]'>
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
  const profitHistory = detail.profit.history;
  const latest = detail.profit.latest ?? profitHistory[0];

  const handleVariantChange = (value: string) => {
    const variantId = value as TVariantId;

    setRequestedVariantId(variantId);
    updateVariantIdSearch(variantId);
  };

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
          {variantOptions.length > 1 ? (
            <div className='sm:col-span-3 lg:col-span-1'>
              <UISelect
                buttonClassName='min-h-10'
                className='min-w-0'
                label='Boss variant'
                onValueChange={handleVariantChange}
                options={variantOptions}
                value={detail.selectedVariantId}
              />
            </div>
          ) : null}
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
        <BossDropsTable
          dropGroups={detail.dropGroups}
          drops={detail.drops}
          selectedVariantId={detail.selectedVariantId}
        />
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
        <ProfitHistoryChart history={profitHistory} />
      </section>

      {profitHistory.length > 0 ? (
        <ProfitSnapshotsTable snapshots={profitHistory} />
      ) : null}
    </section>
  );
};
