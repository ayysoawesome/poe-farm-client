import type { ZodType } from 'zod';

export const parseSchema = <TOutput, TInput = unknown>(
  schema: ZodType<TOutput, TInput>,
  data: unknown,
): TOutput => schema.parse(data);
