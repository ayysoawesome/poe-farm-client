import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { TProfitResponse } from '@/entities/boss';
import { CurrencyAmount } from '@/shared/ui';
import {
  buildProfitHistoryChartData,
  formatProfitHistoryChartDate,
  getProfitHistoryChartTooltipCurrency,
  getProfitHistoryChartDomain,
  type IProfitHistoryChartPoint,
} from '../model/ProfitHistoryChart.model';

interface IProfitHistoryChartProps {
  history: TProfitResponse[];
}

const ProfitHistoryTooltip: FC<TooltipContentProps> = ({
  active,
  label,
  payload,
}) => {
  const { t } = useTranslation();

  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload as IProfitHistoryChartPoint | undefined;

  return (
    <div className='rounded-md border border-border bg-surface-strong px-3 py-2 text-sm shadow-panel'>
      <p className='m-0 font-semibold text-white'>{point?.label ?? label}</p>
      <div className='mt-2 grid gap-1'>
        {payload.map((item) => {
          const dataKey = String(item.dataKey ?? item.name);
          const labelKey = `bossDetail.history.${dataKey}`;
          const currency = point
            ? getProfitHistoryChartTooltipCurrency(point, dataKey)
            : {
                chaosValue: undefined,
                divineValue:
                  typeof item.value === 'number' ? item.value : undefined,
              };

          return (
            <div
              className='grid grid-cols-[auto_1fr] items-center gap-3'
              key={dataKey}
            >
              <span className='text-muted'>{t(labelKey)}</span>
              <CurrencyAmount
                className='justify-end text-right font-semibold text-white'
                chaosValue={currency.chaosValue}
                divineValue={currency.divineValue}
                fallback='-'
                iconClassName='size-5'
              />
            </div>
          );
        })}
      </div>
      {typeof point?.roiPercent === 'number' ? (
        <p className='m-0 mt-2 border-t border-border pt-2 text-right text-faint'>
          {t('bossDetail.history.roi', {
            value: Math.round(point.roiPercent),
          })}
        </p>
      ) : null}
    </div>
  );
};

export const ProfitHistoryChart: FC<IProfitHistoryChartProps> = ({
  history,
}) => {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const chartData = buildProfitHistoryChartData(history, language);
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }),
    [language],
  );

  if (chartData.length === 0) {
    return (
      <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-muted'>
        {t('bossDetail.history.empty')}
      </div>
    );
  }

  const xAxisDomain = getProfitHistoryChartDomain(chartData);

  return (
    <figure
      aria-label={t('bossDetail.history.chartLabel')}
      className='m-0 rounded border border-border bg-black/20 p-4'
    >
      <div className='h-72 min-w-0'>
        <ResponsiveContainer height='100%' width='100%'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ bottom: 8, left: 0, right: 12, top: 8 }}
          >
            <CartesianGrid
              stroke='rgb(238 195 119 / 16%)'
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis
              dataKey='timestamp'
              domain={xAxisDomain}
              minTickGap={28}
              stroke='rgb(129 115 96)'
              tickFormatter={(value: number) =>
                formatProfitHistoryChartDate(value, language)
              }
              tickLine={false}
              tickMargin={10}
              type='number'
            />
            <YAxis
              stroke='rgb(129 115 96)'
              tickFormatter={(value: number) => numberFormatter.format(value)}
              tickLine={false}
              tickMargin={8}
              width={44}
            />
            <Tooltip
              content={(props) => <ProfitHistoryTooltip {...props} />}
              cursor={{ stroke: 'rgb(242 201 109 / 42%)' }}
              isAnimationActive='auto'
            />
            <Legend
              formatter={(value: string) => (
                <span className='text-sm text-muted'>
                  {t(`bossDetail.history.${value}`)}
                </span>
              )}
              iconType='plainline'
              verticalAlign='top'
            />
            <Line
              dataKey='entryCost'
              dot={false}
              name='entryCost'
              stroke='rgb(242 201 109)'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='expectedReturn'
              dot={false}
              name='expectedReturn'
              stroke='rgb(127 185 255)'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='expectedProfit'
              dot={{ r: 2 }}
              name='expectedProfit'
              stroke='rgb(123 214 139)'
              strokeWidth={2}
              type='monotone'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
};
