import type { $Fetch } from 'ofetch';
import { apiClient } from './apiClient';
import { normalizeEndpoint } from '../lib';

type THttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

type TQueryParams = Record<string, unknown>;

export abstract class BaseService {
  protected readonly apiClient: $Fetch;
  protected readonly baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.apiClient = apiClient;
    this.baseEndpoint = baseEndpoint;
  }

  #request(
    options: {
      method: THttpMethod;
      body?: Record<string, unknown>;
      queryParams?: TQueryParams;
    },
    endpoint?: string,
  ): Promise<unknown> {
    const path =
      normalizeEndpoint(this.baseEndpoint) +
      (endpoint ? normalizeEndpoint(endpoint) : '');
    const { method, body, queryParams } = options;

    return this.apiClient<unknown>(path, {
      method,
      body,
      query: queryParams,
    });
  }

  get(endpoint?: string, queryParams?: TQueryParams): Promise<unknown> {
    return this.#request({ method: 'GET', queryParams }, endpoint);
  }

  post(
    endpoint?: string,
    body?: Record<string, unknown>,
    queryParams?: TQueryParams,
  ): Promise<unknown> {
    return this.#request({ method: 'POST', body, queryParams }, endpoint);
  }

  put(
    endpoint?: string,
    body?: Record<string, unknown>,
    queryParams?: TQueryParams,
  ): Promise<unknown> {
    return this.#request({ method: 'PUT', body, queryParams }, endpoint);
  }

  patch(
    endpoint?: string,
    body?: Record<string, unknown>,
    queryParams?: TQueryParams,
  ): Promise<unknown> {
    return this.#request({ method: 'PATCH', body, queryParams }, endpoint);
  }

  delete(endpoint?: string, queryParams?: TQueryParams): Promise<unknown> {
    return this.#request({ method: 'DELETE', queryParams }, endpoint);
  }
}
