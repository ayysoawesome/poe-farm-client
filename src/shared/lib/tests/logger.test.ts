import { FetchError } from 'ofetch';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createErrorLogger } from '../logger';

describe('error logger', () => {
  it('normalizes a standard Error into one structured console call', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    logger.error(new Error('Something failed'));

    expect(write).toHaveBeenCalledOnce();
    expect(write).toHaveBeenCalledWith('[unknown]', {
      category: 'unknown',
      name: 'Error',
      message: 'Something failed',
      timestamp: '2026-06-21T12:00:00.000Z',
    });
  });

  it('does not throw or retry when the writer throws', () => {
    const write = vi.fn(() => {
      throw new Error('Console unavailable');
    });
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    expect(() => logger.error(new Error('Something failed'))).not.toThrow();
    expect(write).toHaveBeenCalledOnce();
  });

  it('classifies and compacts Zod validation errors', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const result = z
      .object({ user: z.object({ email: z.email() }) })
      .safeParse({ user: { email: 'bad' } });

    if (result.success) {
      throw new Error('Expected schema parsing to fail');
    }

    const originalMessage = result.error.message;
    logger.error(result.error);

    expect(write).toHaveBeenCalledWith(
      '[validation]',
      expect.objectContaining({
        category: 'validation',
        name: 'ZodError',
        message: originalMessage,
        issues: [
          {
            path: 'user.email',
            code: 'invalid_format',
            message: expect.any(String),
          },
        ],
      }),
    );
  });

  it('classifies an ofetch error and extracts request metadata', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const error = new FetchError('Request failed');

    Object.defineProperties(error, {
      status: { value: 401 },
      statusText: { value: 'Unauthorized' },
      request: { value: 'https://example.test/profile' },
      options: { value: { method: 'POST' } },
      data: { value: { reason: 'expired' } },
    });

    logger.error(error);

    expect(write).toHaveBeenCalledWith(
      '[api]',
      expect.objectContaining({
        category: 'api',
        status: 401,
        statusText: 'Unauthorized',
        method: 'POST',
        url: 'https://example.test/profile',
        responseData: { reason: 'expired' },
      }),
    );
  });

  it('uses Request.method before ofetch options method', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const error = new FetchError('Request failed');

    Object.defineProperties(error, {
      request: {
        value: new Request('https://example.test/profile', {
          method: 'PATCH',
        }),
      },
      options: { value: { method: 'POST' } },
    });

    logger.error(error);

    expect(write).toHaveBeenCalledWith(
      '[api]',
      expect.objectContaining({
        method: 'PATCH',
        url: 'https://example.test/profile',
      }),
    );
  });

  it.each([
    ['string request', (url: string) => url],
    ['Request instance', (url: string) => new Request(url)],
  ])('redacts sensitive query parameters for a %s', (_, createRequest) => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const rawUrl =
      'https://example.test/profile?access_token=access-secret&api_key=api-secret&password=password-secret&view=compact';
    const error = new FetchError(`Request failed for ${rawUrl}`);

    Object.defineProperty(error, 'request', {
      value: createRequest(rawUrl),
    });

    logger.error(error);

    const record = write.mock.calls[0]?.[1] as
      | { message?: string; url?: string }
      | undefined;

    expect(record?.url).toContain('view=compact');
    expect(record?.url).toContain('access_token=%5BREDACTED%5D');
    expect(record?.url).toContain('api_key=%5BREDACTED%5D');
    expect(record?.url).toContain('password=%5BREDACTED%5D');
    expect(record?.message).toContain(record?.url);

    for (const secret of ['access-secret', 'api-secret', 'password-secret']) {
      expect(record?.url).not.toContain(secret);
      expect(record?.message).not.toContain(secret);
    }
  });

  it('allows an explicit category to override inference', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    logger.error(new Error('Session expired'), { category: 'auth' });

    expect(write).toHaveBeenCalledWith(
      '[auth]',
      expect.objectContaining({ category: 'auth' }),
    );
  });

  it('redacts nested sensitive values using separator-insensitive keys', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    logger.error(new Error('Login failed'), {
      context: {
        user: {
          password: 'plain-text',
          access_token: 'access-token',
          API_KEY: 'api-key',
          profile: { nickname: 'exile' },
        },
        authorization: 'Bearer secret',
      },
    });

    expect(write).toHaveBeenCalledWith(
      '[unknown]',
      expect.objectContaining({
        context: {
          user: {
            password: '[REDACTED]',
            access_token: '[REDACTED]',
            API_KEY: '[REDACTED]',
            profile: { nickname: 'exile' },
          },
          authorization: '[REDACTED]',
        },
      }),
    );
  });

  it('sanitizes API response data and marks cyclic references', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const data: Record<string, unknown> = { token: 'secret' };
    data.self = data;
    const error = new FetchError('Request failed');
    Object.defineProperty(error, 'data', { value: data });

    logger.error(error);

    expect(write).toHaveBeenCalledWith(
      '[api]',
      expect.objectContaining({
        responseData: {
          token: '[REDACTED]',
          self: '[Circular]',
        },
      }),
    );
  });

  it('serializes shared references while preserving cycle detection', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const shared = { value: 'safe' };
    const cyclic: Record<string, unknown> = { value: 'cyclic' };
    cyclic.self = cyclic;

    logger.error(new Error('Shared references'), {
      context: { a: shared, b: shared, cyclic },
    });

    expect(write).toHaveBeenCalledWith(
      '[unknown]',
      expect.objectContaining({
        context: {
          a: { value: 'safe' },
          b: { value: 'safe' },
          cyclic: { value: 'cyclic', self: '[Circular]' },
        },
      }),
    );
  });

  it('omits unavailable API metadata', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    logger.error(new FetchError('Request failed'));

    const record = write.mock.calls[0]?.[1];
    expect(record).not.toHaveProperty('status');
    expect(record).not.toHaveProperty('statusText');
    expect(record).not.toHaveProperty('method');
    expect(record).not.toHaveProperty('url');
    expect(record).not.toHaveProperty('responseData');
  });

  it('includes stack only in development', () => {
    const error = new Error('Development failure');
    const developmentWrite = vi.fn();
    const productionWrite = vi.fn();

    createErrorLogger({
      isDevelopment: true,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write: developmentWrite,
    }).error(error);

    createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write: productionWrite,
    }).error(error);

    expect(developmentWrite).toHaveBeenCalledWith(
      '[unknown]',
      expect.objectContaining({ stack: error.stack }),
    );
    expect(productionWrite.mock.calls[0]?.[1]).not.toHaveProperty('stack');
  });

  it('redacts sensitive request URL values from a development FetchError stack', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: true,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const rawUrl =
      'https://example.test/profile?access_token=access-secret&api_key=api-secret&password=password-secret&view=compact';
    const error = new FetchError(`Request failed for ${rawUrl}`);

    Object.defineProperties(error, {
      request: { value: rawUrl },
      stack: {
        value: `FetchError: Request failed for ${rawUrl}\n    at request.ts:1:1`,
      },
    });

    logger.error(error);

    const record = write.mock.calls[0]?.[1] as { stack?: string } | undefined;

    expect(record?.stack).toContain('FetchError:');
    expect(record?.stack).toContain('access_token=%5BREDACTED%5D');
    expect(record?.stack).toContain('api_key=%5BREDACTED%5D');
    expect(record?.stack).toContain('password=%5BREDACTED%5D');

    for (const secret of ['access-secret', 'api-secret', 'password-secret']) {
      expect(record?.stack).not.toContain(secret);
    }
  });

  it('normalizes strings and non-error values', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });

    logger.error('plain failure');
    logger.error(42);

    expect(write.mock.calls[0]).toEqual([
      '[unknown]',
      expect.objectContaining({ name: 'Error', message: 'plain failure' }),
    ]);
    expect(write.mock.calls[1]).toEqual([
      '[unknown]',
      expect.objectContaining({ name: 'UnknownError', message: '42' }),
    ]);
  });

  it('emits a minimal fallback when an unknown value cannot be inspected', () => {
    const write = vi.fn();
    const logger = createErrorLogger({
      isDevelopment: false,
      now: () => new Date('2026-06-21T12:00:00.000Z'),
      write,
    });
    const hostileValue = new Proxy(
      {},
      {
        getPrototypeOf() {
          throw new Error('Cannot inspect value');
        },
      },
    );

    expect(() => logger.error(hostileValue)).not.toThrow();
    expect(write).toHaveBeenCalledWith('[unknown]', {
      category: 'unknown',
      name: 'LoggerError',
      message: 'Failed to normalize error',
      timestamp: '2026-06-21T12:00:00.000Z',
    });
  });
});
