import type { FC } from 'react';
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
  getProfitHistoryChartDomain,
  type IProfitHistoryChartPoint,
} from '../model/ProfitHistoryChart.model';

interface IProfitHistoryChartProps {
  history: TProfitResponse[];
}

const numberFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const currencyNames: Record<string, string> = {
  entryCost: 'Cost',
  expectedReturn: 'Return',
  expectedProfit: 'Profit',
};

const ProfitHistoryTooltip: FC<TooltipContentProps> = ({
  active,
  label,
  payload,
}) => {
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

          return (
            <div
              className='grid grid-cols-[auto_1fr] items-center gap-3'
              key={dataKey}
            >
              <span className='text-muted'>
                {currencyNames[dataKey] ?? item.name}
              </span>
              <CurrencyAmount
                className='justify-end text-right font-semibold text-white'
                divineValue={
                  typeof item.value === 'number' ? item.value : undefined
                }
                fallback='-'
                iconClassName='size-5'
              />
            </div>
          );
        })}
      </div>
      {typeof point?.roiPercent === 'number' ? (
        <p className='m-0 mt-2 border-t border-border pt-2 text-right text-faint'>
          ROI {Math.round(point.roiPercent)}%
        </p>
      ) : null}
    </div>
  );
};

export const ProfitHistoryChart: FC<IProfitHistoryChartProps> = ({
  history,
}) => {
  const chartData = buildProfitHistoryChartData(history);

  if (chartData.length === 0) {
    return (
      <div className='rounded border border-border bg-surface-soft px-4 py-8 text-base text-muted'>
        No profitability history has been stored for this boss yet.
      </div>
    );
  }

  const xAxisDomain = getProfitHistoryChartDomain(chartData);

  return (
    <figure
      aria-label='Profit history price chart'
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
                formatProfitHistoryChartDate(value)
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
                  {currencyNames[value] ?? value}
                </span>
              )}
              iconType='plainline'
              verticalAlign='top'
            />
            <Line
              dataKey='entryCost'
              dot={false}
              name='Entry cost'
              stroke='rgb(242 201 109)'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='expectedReturn'
              dot={false}
              name='Expected return'
              stroke='rgb(127 185 255)'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='expectedProfit'
              dot={{ r: 2 }}
              name='Expected profit'
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
