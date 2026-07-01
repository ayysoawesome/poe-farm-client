import { FetchError } from 'ofetch';
import { ZodError } from 'zod';

export type TErrorCategory =
  | 'api'
  | 'validation'
  | 'auth'
  | 'ui'
  | 'unknown';

export interface IErrorLogOptions {
  readonly category?: TErrorCategory;
  readonly context?: Readonly<Record<string, unknown>>;
}

interface ILogger {
  error(error: unknown, options?: IErrorLogOptions): void;
}

interface ICreateErrorLoggerOptions {
  readonly isDevelopment: boolean;
  readonly now: () => Date;
  readonly write: (prefix: string, record: object) => void;
}

interface ICompactZodIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

interface INormalizedError {
  readonly name: string;
  readonly message: string;
  readonly cause?: unknown;
  readonly stack?: string;
  readonly issues?: readonly ICompactZodIssue[];
  readonly status?: number;
  readonly statusText?: string;
  readonly method?: string;
  readonly url?: string;
  readonly responseData?: unknown;
}

const REDACTED = '[REDACTED]';
const CIRCULAR = '[Circular]';
const MAX_DEPTH = '[MaxDepth]';
const MAX_SANITIZE_DEPTH = 8;

const SENSITIVE_KEY_PARTS = [
  'password',
  'passwd',
  'token',
  'authorization',
  'cookie',
  'secret',
  'apikey',
  'accesskey',
  'privatekey',
] as const;

const isSensitiveKey = (key: string): boolean => {
  const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return SENSITIVE_KEY_PARTS.some((part) => normalizedKey.includes(part));
};

const sanitize = (
  value: unknown,
  seen = new WeakSet<object>(),
  depth = 0,
): unknown => {
  if (depth > MAX_SANITIZE_DEPTH) {
    return MAX_DEPTH;
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'number'
  ) {
    return value;
  }

  if (typeof value === 'undefined') {
    return '[undefined]';
  }

  if (typeof value === 'bigint' || typeof value === 'symbol') {
    return String(value);
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (seen.has(value)) {
    return CIRCULAR;
  }

  seen.add(value);

  try {
    if (Array.isArray(value)) {
      return value.map((item) => sanitize(item, seen, depth + 1));
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(value)) {
      if (isSensitiveKey(key)) {
        result[key] = REDACTED;
        continue;
      }

      try {
        result[key] = sanitize(
          (value as Record<string, unknown>)[key],
          seen,
          depth + 1,
        );
      } catch {
        result[key] = '[Unreadable]';
      }
    }

    return result;
  } finally {
    seen.delete(value);
  }
};

const inferCategory = (error: unknown): TErrorCategory => {
  if (error instanceof ZodError) {
    return 'validation';
  }

  if (error instanceof FetchError) {
    return 'api';
  }

  return 'unknown';
};

const getRawRequestUrl = (request: unknown): string | undefined => {
  if (typeof request === 'string') {
    return request;
  }

  if (request instanceof Request) {
    return request.url;
  }

  return undefined;
};

const sanitizeUrl = (rawUrl: string): string => {
  try {
    const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(rawUrl);
    const url = new URL(rawUrl, 'https://logger.invalid');
    const params = Array.from(url.searchParams.entries());

    url.search = '';

    for (const [key, value] of params) {
      url.searchParams.append(key, isSensitiveKey(key) ? REDACTED : value);
    }

    return isAbsolute
      ? url.toString()
      : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '[Invalid URL]';
  }
};

const sanitizeFetchMessage = (
  message: string,
  rawUrl: string | undefined,
  sanitizedUrl: string | undefined,
): string => {
  if (!rawUrl || !sanitizedUrl || rawUrl === sanitizedUrl) {
    return message;
  }

  if (message.includes(rawUrl)) {
    return message.replaceAll(rawUrl, sanitizedUrl);
  }

  return 'Request failed';
};

const safeString = (value: unknown): string => {
  try {
    return String(value);
  } catch {
    return '[Unserializable value]';
  }
};

const normalizeError = (error: unknown): INormalizedError => {
  if (error instanceof ZodError) {
    return {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      issues: error.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        code: issue.code,
        message: issue.message,
      })),
    };
  }

  if (error instanceof FetchError) {
    const rawUrl = getRawRequestUrl(error.request);
    const url = rawUrl ? sanitizeUrl(rawUrl) : undefined;

    return {
      name: error.name,
      message: sanitizeFetchMessage(error.message, rawUrl, url),
      cause: error.cause,
      stack: error.stack
        ? sanitizeFetchMessage(error.stack, rawUrl, url)
        : undefined,
      status: error.status,
      statusText: error.statusText,
      method:
        error.request instanceof Request
          ? error.request.method.toUpperCase()
          : typeof error.options?.method === 'string'
          ? error.options.method.toUpperCase()
          : undefined,
      url,
      responseData: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return { name: 'Error', message: error };
  }

  return { name: 'UnknownError', message: safeString(error) };
};

const createFallbackRecord = (
  category: TErrorCategory,
  timestamp: string,
) => ({
  category,
  name: 'LoggerError',
  message: 'Failed to normalize error',
  timestamp,
});

const omitUndefined = (
  value: Readonly<Record<string, unknown>>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );

export const createErrorLogger = ({
  isDevelopment,
  now,
  write,
}: ICreateErrorLoggerOptions): ILogger => ({
  error(error, options) {
    let timestamp: string;

    try {
      timestamp = now().toISOString();
    } catch {
      timestamp = new Date(0).toISOString();
    }

    let prefix: string;
    let output: object;

    try {
      const category = options?.category ?? inferCategory(error);
      const normalized = normalizeError(error);
      const { cause, responseData, stack, ...record } = normalized;
      const baseRecord = omitUndefined(record);

      prefix = `[${category}]`;
      output = {
        category,
        ...baseRecord,
        ...(cause !== undefined ? { cause: sanitize(cause) } : {}),
        ...(responseData !== undefined
          ? { responseData: sanitize(responseData) }
          : {}),
        ...(options?.context ? { context: sanitize(options.context) } : {}),
        ...(isDevelopment && stack ? { stack } : {}),
        timestamp,
      };
    } catch {
      let category: TErrorCategory = 'unknown';

      try {
        category = options?.category ?? 'unknown';
      } catch {
        // Keep the safe default category.
      }

      prefix = `[${category}]`;
      output = createFallbackRecord(category, timestamp);
    }

    try {
      write(prefix, output);
    } catch {
      // Logging must never interrupt application control flow.
    }
  },
});

export const logger = createErrorLogger({
  isDevelopment: import.meta.env.DEV,
  now: () => new Date(),
  write: (prefix, record) => console.error(prefix, record),
});
