import { describe, expect, it } from 'vitest';
import type { TLeague } from '@/entities/league';
import { getDefaultLeague, reconcileSelectedLeague } from './selectLeague';

const league = (overrides: Partial<TLeague> & Pick<TLeague, 'id'>): TLeague => ({
  id: overrides.id,
  name: overrides.name ?? overrides.id,
  isActive: overrides.isActive ?? false,
});

describe('select league model', () => {
  it('uses the active league as default', () => {
    const leagues = [
      league({ id: 'standard' }),
      league({ id: 'mercenaries', isActive: true }),
    ];

    expect(getDefaultLeague(leagues)).toEqual(leagues[1]);
  });

  it('falls back to the first league when no active league exists', () => {
    const leagues = [league({ id: 'standard' }), league({ id: 'hardcore' })];

    expect(getDefaultLeague(leagues)).toEqual(leagues[0]);
  });

  it('keeps the selected league when it still exists after leagues refetch', () => {
    const selected = league({ id: 'hardcore' });
    const leagues = [
      league({ id: 'standard', isActive: true }),
      league({ id: 'hardcore' }),
    ];

    expect(reconcileSelectedLeague(leagues, selected)).toEqual(leagues[1]);
  });
});
