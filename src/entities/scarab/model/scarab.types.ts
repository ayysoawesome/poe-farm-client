import type { z } from 'zod';
import type {
  groupedScarabsResponseSchema,
  scarabBlockingCombinationsResponseSchema,
  scarabBlockingResultSchema,
  scarabFreshnessSchema,
  scarabGroupSchema,
  scarabGroupSummarySchema,
  scarabGroupsResponseSchema,
  scarabItemSchema,
} from './scarab.schemas';

export type TScarabGroup = z.infer<typeof scarabGroupSchema>;
export type TScarabItem = z.infer<typeof scarabItemSchema>;
export type TScarabFreshness = z.infer<typeof scarabFreshnessSchema>;
export type TScarabGroupSummary = z.infer<typeof scarabGroupSummarySchema>;
export type TScarabBlockingResult = z.infer<typeof scarabBlockingResultSchema>;
export type TGroupedScarabsResponse = z.infer<
  typeof groupedScarabsResponseSchema
>['data'];
export type TScarabGroupsResponse = z.infer<
  typeof scarabGroupsResponseSchema
>['data'];
export type TScarabBlockingCombinationsResponse = z.infer<
  typeof scarabBlockingCombinationsResponseSchema
>['data'];

export type TBlockingCombinationsQuery = {
  leagueId: string;
  maxBlockedGroups?: number;
  limit?: number;
};
