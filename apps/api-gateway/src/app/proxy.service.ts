import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from 'axios';
import { ServiceName } from "./enums/serviceName.enum";
import { IProxyData } from "./interfaces";

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

  private getFinalUrl(serviceName: ServiceName, url: string, query?: Record<string, string>): URL {
    const servicePort = this.configService.get(`${serviceName.toUpperCase()}_PORT`);
    const serviceBaseName = new URL(`http://${serviceName}:${servicePort}/${url}`);
    if (query) {
      for (const key in query) {
        serviceBaseName.searchParams.append(key, query[key]);
      }
    }
    return serviceBaseName;
  }

  public async handle<T>(proxyData: IProxyData): Promise<T> {
    const { serviceName, url, method, headers = {}, payload = {} } = proxyData;
    const { query, body } = payload;
    const finalUrl = this.getFinalUrl(serviceName, url, query);

    let response: AxiosResponse<T>;
    const config = {
      headers
    }

    const normalizedMethod = method.toLowerCase();

    switch (normalizedMethod) {
      case 'get':
      case 'delete':
        response = await firstValueFrom(
          this.httpService[normalizedMethod](finalUrl.href, config)
        );
        break;
      case 'post':
      case 'put':
      case 'patch':
        response = await firstValueFrom(
          this.httpService[normalizedMethod](finalUrl.href, body, config)
        );
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  }
}
