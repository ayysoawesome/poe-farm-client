export const en = {
  app: {
    navigationLabel: 'Economy sections',
    subtitle: 'Boss profitability',
  },
  bossDetail: {
    backToBosses: 'Back to bosses',
    cost: 'Cost',
    drops: 'Drops',
    dropsTable: {
      chanceShort: 'Chance',
      quantityShort: 'Qty',
    },
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
  scarabs: {
    title: 'Scarab Optimizer',
    description:
      'Inspect scarab groups, market values, drop weights, and ranked Atlas blocking setups.',
    empty: {
      grouped: 'No scarab groups were returned for this league.',
      combinations: 'No blocking combinations were returned for these filters.',
    },
    errors: {
      grouped: 'Failed to load scarab data.',
      combinations: 'Failed to load blocking combinations.',
    },
    subroutes: {
      label: 'Scarab optimizer views',
      groups: 'Scarab groups',
      blocking: 'Blocking optimizer',
    },
    pagination: {
      summary: 'Page {{page}} of {{pages}} · {{total}} combinations',
      previous: 'Previous page',
      next: 'Next page',
    },
    freshness: {
      title: 'Price data may be incomplete',
      description:
        '{{missing}} scarab prices are missing and {{stale}} prices are stale. Missing prices are not treated as zero.',
    },
    group: {
      blockable: 'Blockable',
      notBlockable: 'Not blockable',
      summary:
        '{{scarabs}} scarabs, {{enabled}} enabled, {{priced}} priced',
      totalWeight: 'Total weight',
      avgPrice: 'Avg price',
      expectedValue: 'Weighted EV',
    },
    table: {
      weight: 'Weight',
      weightedValue: 'Weighted value',
      included: 'Included',
      missingPrice: 'Missing price',
      yes: 'Yes',
      no: 'No',
    },
    combinations: {
      navTitle: 'Scarab Blocking',
      title: 'Blocking Combinations',
      description:
        'Ranked server-calculated blocking setups compared with no scarab blocking.',
      rank: 'Rank',
      blockedGroups: 'Blocked groups',
      expectedValue: 'Expected value',
      baseline: 'No blocking',
      baselineValue: 'Baseline',
      delta: 'Delta',
      deltaPercent: 'Delta %',
      removedWeight: 'Removed weight',
      remainingWeight: 'Remaining weight',
      removedScarabs: 'Removed',
      remainingScarabs: 'Remaining',
    },
  },
} as const;
