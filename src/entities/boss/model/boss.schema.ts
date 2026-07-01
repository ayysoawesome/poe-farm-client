import { itemSchema } from '@/entities/item';
import { createApiResponseSchema } from '@/shared/model';
import { z } from 'zod';

const moneySchema = z.object({
  chaos: z.number(),
  divine: z.number(),
});

export const profitSnapshotSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  syncRunId: z.string(),
  entryCostChaos: z.number(),
  expectedReturnChaos: z.number(),
  expectedProfitChaos: z.number(),
  roiPercent: z.number(),
  divineOrbChaosValue: z.number().positive(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int(),
  createdAt: z.number().int(),
});

export const profitResponseSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  entryCost: moneySchema,
  expectedReturn: moneySchema,
  expectedProfit: moneySchema,
  roiPercent: z.number(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int(),
});

export const bossSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().min(1),
  iconUrl: z.string().nullable(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export const bossWithProfitSchema = bossSchema.extend({
  latestProfit: profitSnapshotSchema.nullable(),
});

export const bossListResponseSchema =
  createApiResponseSchema(bossWithProfitSchema);

export const bossEntryComponentSchema = z.object({
  item: itemSchema,
  quantity: z.number(),
  unitPrice: moneySchema.nullable(),
  totalPrice: moneySchema.nullable(),
});

export const bossDropSchema = z.object({
  item: itemSchema,
  dropRate: z.number().nullable(),
  dropGroupId: z.string().nullable(),
  dropGroupType: z.enum(['one_of']).nullable(),
  price: moneySchema.nullable(),
});

export const bossDetailSchema = z.object({
  boss: bossSchema,
  entry: z.object({
    components: z.array(bossEntryComponentSchema),
    totalPrice: moneySchema.nullable(),
  }),
  drops: z.array(bossDropSchema),
});

export const bossDetailResponseSchema = z.object({
  data: bossDetailSchema,
});

export const profitHistoryResponseSchema =
  createApiResponseSchema(profitResponseSchema);
