import type { TProfitResponse } from '@/entities/boss';

export interface IProfitHistoryChartPoint {
  id: string;
  timestamp: number;
  label: string;
  entryCost: number;
  entryCostChaos: number;
  expectedReturn: number;
  expectedReturnChaos: number;
  expectedProfit: number;
  expectedProfitChaos: number;
  roiPercent: number;
}

type TProfitHistoryChartCurrencyKey =
  | 'entryCost'
  | 'expectedReturn'
  | 'expectedProfit';

const singlePointDomainPaddingMs = 30 * 60 * 1000;

const chaosValueByCurrencyKey = {
  entryCost: 'entryCostChaos',
  expectedReturn: 'expectedReturnChaos',
  expectedProfit: 'expectedProfitChaos',
} as const satisfies Record<
  TProfitHistoryChartCurrencyKey,
  keyof IProfitHistoryChartPoint
>;

export const formatProfitHistoryChartDate = (
  timestamp: number,
  language: string,
) =>
  new Intl.DateTimeFormat(language, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

export const buildProfitHistoryChartData = (
  history: TProfitResponse[],
  language = 'en',
): IProfitHistoryChartPoint[] =>
  [...history]
    .sort((left, right) => left.calculatedAt - right.calculatedAt)
    .map((snapshot) => ({
      id: snapshot.id,
      timestamp: snapshot.calculatedAt,
      label: formatProfitHistoryChartDate(snapshot.calculatedAt, language),
      entryCost: snapshot.entryCost.divine,
      entryCostChaos: snapshot.entryCost.chaos,
      expectedReturn: snapshot.expectedReturn.divine,
      expectedReturnChaos: snapshot.expectedReturn.chaos,
      expectedProfit: snapshot.expectedProfit.divine,
      expectedProfitChaos: snapshot.expectedProfit.chaos,
      roiPercent: snapshot.roiPercent,
    }));

export const getProfitHistoryChartTooltipCurrency = (
  point: IProfitHistoryChartPoint,
  dataKey: string,
): { chaosValue?: number; divineValue?: number } => {
  if (
    dataKey !== 'entryCost' &&
    dataKey !== 'expectedReturn' &&
    dataKey !== 'expectedProfit'
  ) {
    return {};
  }

  const divineValue = point[dataKey];
  const chaosKey = chaosValueByCurrencyKey[dataKey];
  const chaosValue =
    Math.abs(divineValue) > 1 ? undefined : Number(point[chaosKey]);

  return {
    chaosValue,
    divineValue,
  };
};

export const getProfitHistoryChartDomain = (
  chartData: IProfitHistoryChartPoint[],
): [number, number] => {
  const timestamps = chartData.map((point) => point.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  if (minTimestamp === maxTimestamp) {
    return [
      minTimestamp - singlePointDomainPaddingMs,
      maxTimestamp + singlePointDomainPaddingMs,
    ];
  }

  return [minTimestamp, maxTimestamp];
};
