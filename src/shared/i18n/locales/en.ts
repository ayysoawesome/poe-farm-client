export const en = {
  app: {
    subtitle: 'Boss profitability',
  },
  bossDetail: {
    backToBosses: 'Back to bosses',
    cost: 'Cost',
    drops: 'Drops',
    entry: 'Entry',
    errors: {
      details: 'Failed to load boss details.',
      history: 'Failed to load profit history.',
    },
    history: {
      chartLabel: 'Profit history price chart',
      empty: 'No profitability history has been stored for this boss yet.',
      entryCost: 'Entry cost',
      expectedProfit: 'Profit',
      expectedReturn: 'Return',
      roi: 'ROI {{value}}%',
      snapshotsCount: '{{count}} stored snapshot',
      snapshotsCount_other: '{{count}} stored snapshots',
      title: 'Profit History',
    },
    profitPerRun: 'Profit per run',
    snapshots: {
      calculated: 'Calculated',
      title: 'Stored Snapshots',
      unknownDrops: 'Unknown drops',
    },
  },
  bosses: {
    comingSoon: 'Coming soon',
    errors: {
      list: 'Failed to load bosses.',
    },
    navigationLabel: 'Economy sections',
    title: 'Bosses',
    table: {
      bossName: 'Boss name',
      cost: 'Cost',
      expectedReturn: 'Return',
      profit: 'Profit',
      roi: 'ROI',
    },
  },
  common: {
    chance: 'Drop chance',
    item: 'Item',
    noData: 'No data',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    unit: 'Cost',
    unknown: 'Unknown',
  },
  language: {
    label: 'Language',
  },
  league: {
    errors: {
      list: 'Failed to load leagues.',
    },
    label: 'League',
    loading: 'Loading leagues...',
    placeholder: 'Select league',
  },
  market: {
    noData: 'No data',
    relative: {
      hour_one: '{{count}} hour ago',
      hour_other: '{{count}} hours ago',
      minute_one: '{{count}} minute ago',
      minute_other: '{{count}} minutes ago',
      second_one: '{{count}} second ago',
      second_other: '{{count}} seconds ago',
    },
    updated: 'Updated',
  },
} as const;
