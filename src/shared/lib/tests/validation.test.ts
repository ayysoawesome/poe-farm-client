import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';
import { parseSchema } from '../validation';

describe('parseSchema', () => {
  it('returns the parsed schema output', () => {
    const schema = z.string().transform((value) => value.length);

    expect(parseSchema(schema, 'exile')).toBe(5);
  });

  it('throws the original ZodError for invalid input', () => {
    const schema = z.object({ level: z.number().int().positive() });

    expect(() => parseSchema(schema, { level: 0 })).toThrow(ZodError);
  });
});
