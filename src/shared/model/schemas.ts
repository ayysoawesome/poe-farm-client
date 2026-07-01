import { z } from 'zod';

export const createApiResponseSchema = <TSchema extends z.ZodType>(
  schema: TSchema,
) =>
  z.object({
    data: z.array(schema),
  });
