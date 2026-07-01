import { describe, expect, expectTypeOf, it } from 'vitest';
import { z, ZodError } from 'zod';
import { parseSchema } from '../validation';
import { createApiDataResponseSchema, createApiResponseSchema } from '../../model';

describe('parseSchema', () => {
  it('returns the parsed schema output', () => {
    const schema = z.string().transform((value) => value.length);

    expect(parseSchema(schema, 'exile')).toBe(5);
  });

  it('throws the original ZodError for invalid input', () => {
    const schema = z.object({ level: z.number().int().positive() });

    expect(() => parseSchema(schema, { level: 0 })).toThrow(ZodError);
  });

  it('preserves wrapped schema output type', () => {
    const schema = createApiResponseSchema(z.object({ id: z.string() }));
    const parsed = schema.parse({ data: [{ id: 'mirror' }] });

    expectTypeOf(parsed).toEqualTypeOf<{ data: { id: string }[] }>();
  });

  it('preserves transformed schema output type inside arrays', () => {
    const schema = createApiResponseSchema(
      z.object({ value: z.string().transform((value) => value.length) }),
    );
    const parsed = schema.parse({ data: [{ value: 'mirror' }] });

    expectTypeOf(parsed).toEqualTypeOf<{ data: { value: number }[] }>();
  });

  it('preserves single data response output type', () => {
    const schema = createApiDataResponseSchema(z.object({ value: z.number() }));
    const parsed = schema.parse({ data: { value: 175 } });

    expectTypeOf(parsed).toEqualTypeOf<{ data: { value: number } }>();
  });
});
