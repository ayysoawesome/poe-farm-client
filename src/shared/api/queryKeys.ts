/**
 * Hierarchical query-key factory (entity → scope → id). All keys are arrays of
 * JSON-serializable parts so partial keys invalidate everything beneath them —
 * e.g. invalidating `conversations.all` clears lists, details and messages.
 */
export const queryKeys = {
  leagues: {
    all: ['leagues'] as const,
  },
  bosses: {
    all: ['bosses'] as const,
    list: (leagueId: string) => [...queryKeys.bosses.all, 'list', leagueId] as const,
    detail: (id: string, leagueId: string, variantId?: string | null) =>
      [...queryKeys.bosses.all, 'detail', id, leagueId, variantId ?? null] as const,
    history: (id: string, leagueId: string) =>
      [...queryKeys.bosses.all, 'history', id, leagueId] as const,
  },
  market: {
    all: ['market'] as const,
    divineChaosRate: (leagueId: string) =>
      [...queryKeys.market.all, 'divine-chaos-rate', leagueId] as const,
    freshnessStatus: (leagueId: string) =>
      [...queryKeys.market.all, 'freshness-status', leagueId] as const,
  },
  scarabs: {
    all: ['scarabs'] as const,
    grouped: (leagueId: string) =>
      [...queryKeys.scarabs.all, 'grouped', leagueId] as const,
    groups: (leagueId: string) =>
      [...queryKeys.scarabs.all, 'groups', leagueId] as const,
    blockingCombinations: (
      leagueId: string,
      maxBlockedGroups: number,
      limit: number,
    ) =>
      [
        ...queryKeys.scarabs.all,
        'blocking-combinations',
        leagueId,
        maxBlockedGroups,
        limit,
      ] as const,
    blockingCalculate: (leagueId: string, blockedGroupIds: string[]) =>
      [
        ...queryKeys.scarabs.all,
        'blocking-calculate',
        leagueId,
        blockedGroupIds.join(','),
      ] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    list: () => [...queryKeys.conversations.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.conversations.all, 'detail', id] as const,
    messages: (conversationId: string) =>
      [...queryKeys.conversations.all, 'messages', conversationId] as const,
  },
} as const;
