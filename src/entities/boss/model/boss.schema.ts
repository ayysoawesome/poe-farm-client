import { itemSchema } from '@/entities/item';
import { createApiResponseSchema } from '@/shared/model';
import { z } from 'zod';

const moneySchema = z.object({
  chaos: z.number(),
  divine: z.number(),
});

const quantityBucketSchema = z.enum(['default', 'low', 'mid', 'high']);

export const bossVariantSchema = z.object({
  id: quantityBucketSchema,
  label: z.string(),
  kind: z.enum(['default', 'quantity']),
  isDefault: z.boolean(),
});

export const profitSnapshotSchema = z.object({
  id: z.string(),
  bossId: z.string(),
  leagueId: z.string(),
  quantityBucket: quantityBucketSchema,
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
  quantityBucket: quantityBucketSchema,
  entryCost: moneySchema,
  expectedReturn: moneySchema,
  expectedProfit: moneySchema,
  roiPercent: z.number(),
  isComplete: z.boolean(),
  unknownDropCount: z.number().int().nonnegative(),
  calculatedAt: z.number().int(),
});

export const profitQuantityBucketSchema = profitResponseSchema.extend({
  quantityBucket: quantityBucketSchema,
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
  profitRange: z
    .object({
      min: profitResponseSchema.nullable(),
      max: profitResponseSchema.nullable(),
    })
    .optional(),
  variants: z.array(bossVariantSchema).optional().default([]),
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

export const bossDropGroupSchema = z.object({
  id: z.string(),
  type: z.enum(['quantity_scaled_fragments']),
  label: z.string(),
  selectedQuantity: z.number().optional(),
  quantityByBucket: z
    .object({
      low: z.number(),
      mid: z.number(),
      high: z.number(),
    })
    .optional(),
  items: z.array(
    z.object({
      item: itemSchema,
      dropRate: z.number().nullable(),
      price: moneySchema.nullable(),
    }),
  ),
});

export const bossDetailSchema = z.object({
  boss: bossSchema,
  variants: z.array(bossVariantSchema).optional().default([]),
  selectedVariantId: quantityBucketSchema.optional().default('default'),
  entry: z.object({
    components: z.array(bossEntryComponentSchema),
    totalPrice: moneySchema.nullable(),
  }),
  profit: z
    .object({
      latest: profitResponseSchema.nullable(),
      history: z.array(profitResponseSchema),
      quantityBuckets: z.array(profitQuantityBucketSchema).optional().default([]),
      range: z
        .object({
          min: profitResponseSchema.nullable(),
          max: profitResponseSchema.nullable(),
        })
        .optional()
        .default({ min: null, max: null }),
    })
    .nullish()
    .transform(
      (profit) =>
        profit ?? {
          latest: null,
          history: [],
          quantityBuckets: [],
          range: { min: null, max: null },
        },
    ),
  drops: z.array(bossDropSchema),
  dropGroups: z.array(bossDropGroupSchema).optional().default([]),
});

export const bossDetailResponseSchema = z.object({
  data: bossDetailSchema,
});

export const profitHistoryResponseSchema =
  createApiResponseSchema(profitResponseSchema);
