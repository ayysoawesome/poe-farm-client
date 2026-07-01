import { z } from 'zod';

export const createApiDataResponseSchema = <TSchema extends z.ZodType>(
  schema: TSchema,
) =>
  z.object({
    data: schema,
  });

export const createApiResponseSchema = <TSchema extends z.ZodType>(
  schema: TSchema,
) => createApiDataResponseSchema(z.array(schema));
