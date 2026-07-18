import { createApiDataResponseSchema } from '@/shared/model';
import { z } from 'zod';

const itemCategorySchema = z.enum([
  'currency',
  'fragment',
  'scarab',
  'divination_card',
  'equipment',
  'gem',
  'map',
  'other',
]);

const moneySchema = z.object({
  chaos: z.number(),
  divine: z.number(),
});

export const scarabItemBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: itemCategorySchema,
  iconUrl: z.string().nullable(),
  tradeUrl: z.string().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export const scarabGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  isBlockable: z.boolean(),
});

export const scarabPriceSchema = z.object({
  chaos: z.number(),
  value: moneySchema.nullable(),
  source: z.string(),
  capturedAt: z.number().int(),
});

export const scarabFreshnessSchema = z.object({
  isComplete: z.boolean(),
  isStale: z.boolean(),
  missingPriceScarabCount: z.number().int().nonnegative(),
  stalePriceScarabCount: z.number().int().nonnegative(),
  latestPriceCapturedAt: z.number().int().nullable(),
  oldestPriceCapturedAt: z.number().int().nullable(),
  staleAfterMs: z.number().int().nonnegative(),
});

export const scarabItemSchema = z.object({
  item: scarabItemBaseSchema,
  group: scarabGroupSchema.nullable(),
  dropWeight: z.number().nonnegative().nullable(),
  isEnabled: z.boolean(),
  isIncludedInCalculation: z.boolean(),
  price: scarabPriceSchema.nullable(),
  data: z.object({
    source: z.string(),
    sourceUpdatedAt: z.number().int().nullable(),
    updatedAt: z.number().int(),
  }),
});

export const scarabGroupSummarySchema = z.object({
  groupId: z.string().nullable(),
  groupName: z.string(),
  isBlockable: z.boolean(),
  scarabCount: z.number().int().nonnegative(),
  groupIconUrl: z.string().nullable(),
  enabledScarabCount: z.number().int().nonnegative(),
  pricedScarabCount: z.number().int().nonnegative(),
  missingPriceScarabCount: z.number().int().nonnegative(),
  totalWeight: z.number().nonnegative(),
  pricedWeight: z.number().nonnegative(),
  expectedValue: z.number().nullable(),
  expectedValueMoney: moneySchema.nullable(),
});

export const scarabBlockingGroupSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  groupIconUrl: z.string().nullable(),
  isBlockable: z.boolean(),
});

export const groupedScarabGroupSchema = scarabGroupSummarySchema.extend({
  scarabs: z.array(scarabItemSchema),
});

export const scarabPoolSummarySchema = z.object({
  expectedValue: z.number().nullable(),
  expectedValueMoney: moneySchema.nullable(),
  totalWeight: z.number().nonnegative(),
  includedScarabCount: z.number().int().nonnegative(),
  missingPriceScarabCount: z.number().int().nonnegative(),
  missingPriceScarabIds: z.array(z.string()),
  stalePriceScarabIds: z.array(z.string()),
  isComplete: z.boolean(),
  isStale: z.boolean(),
});

export const scarabBlockingResultSchema = scarabPoolSummarySchema.extend({
  blockedGroupIds: z.array(z.string()),
  blockedGroups: z.array(scarabBlockingGroupSchema),
  baseline: scarabPoolSummarySchema,
  absoluteImprovement: z.number().nullable(),
  absoluteImprovementMoney: moneySchema.nullable(),
  percentageImprovement: z.number().nullable(),
  removedWeight: z.number().nonnegative(),
  remainingWeight: z.number().nonnegative(),
  removedScarabCount: z.number().int().nonnegative(),
  remainingScarabCount: z.number().int().nonnegative(),
  removedScarabIds: z.array(z.string()),
  remainingScarabIds: z.array(z.string()),
});

export const groupedScarabsResponseSchema = createApiDataResponseSchema(
  z.object({
    groups: z.array(groupedScarabGroupSchema),
    freshness: scarabFreshnessSchema,
  }),
);

export const scarabGroupsResponseSchema = createApiDataResponseSchema(
  z.object({
    groups: z.array(scarabGroupSummarySchema),
    freshness: scarabFreshnessSchema,
  }),
);

export const scarabBlockingCombinationsResponseSchema =
  createApiDataResponseSchema(
    z.object({
      combinations: z.array(scarabBlockingResultSchema),
      freshness: scarabFreshnessSchema,
    }),
  );

export const scarabBlockingCalculateResponseSchema =
  createApiDataResponseSchema(
    z.object({
      result: scarabBlockingResultSchema,
      freshness: scarabFreshnessSchema,
    }),
  );
