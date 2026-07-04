import { describe, expect, it } from 'vitest';
import { shouldUseChaosCurrencyValue } from './CurrencyAmount';

describe('shouldUseChaosCurrencyValue', () => {
  it('uses chaos values unless the divine value exceeds one', () => {
    expect(shouldUseChaosCurrencyValue(0.99, true)).toBe(true);
    expect(shouldUseChaosCurrencyValue(1, true)).toBe(true);
    expect(shouldUseChaosCurrencyValue(1.01, true)).toBe(false);
  });

  it('uses divine values when no chaos value is available', () => {
    expect(shouldUseChaosCurrencyValue(0.5, false)).toBe(false);
  });
});
