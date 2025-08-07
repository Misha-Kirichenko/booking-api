import { ServiceName } from "../enums/serviceName.enum";

export interface IProxyData {
  readonly url: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly payload?: {
    query?: Record<string, any>;
    body?: Record<string, any>;
  };
  readonly headers?: Record<string, any>;
  readonly serviceName: ServiceName;
}
