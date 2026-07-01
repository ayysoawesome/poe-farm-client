import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseService } from './baseService';
import { apiClient } from './apiClient';

vi.mock('./apiClient', () => ({
  apiClient: vi.fn(),
}));

class TestService extends BaseService {
  constructor() {
    super('/items');
  }

  list(queryParams: { leagueId: string; page: number }) {
    return this.get(undefined, queryParams);
  }
}

describe('BaseService', () => {
  beforeEach(() => {
    vi.mocked(apiClient).mockReset();
  });

  it('passes query params as an object to the api client', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({ data: [] });

    const service = new TestService();
    await service.list({ leagueId: 'mercenaries', page: 2 });

    expect(apiClient).toHaveBeenCalledWith('/items', {
      method: 'GET',
      body: undefined,
      query: { leagueId: 'mercenaries', page: 2 },
    });
  });
});
