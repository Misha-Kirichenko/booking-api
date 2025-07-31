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

  private getServiceBaseUrl(serviceName: ServiceName): string {
    const servicePort = this.configService.get(`${serviceName.toUpperCase()}_PORT`);
    const serviceBaseName = `http://${serviceName}:${servicePort}`;
    return serviceBaseName;
  }

  public async handle<T>(proxyData: IProxyData): Promise<T> {
    const { serviceName, url, method, headers = {}, payload = {} } = proxyData;
    const finalUrl = `${this.getServiceBaseUrl(serviceName)}/${url}`;
    
    let response: AxiosResponse<T>;
    const config = {
      headers
    }

    const normalizedMethod = method.toLowerCase();

    switch (normalizedMethod) {
      case 'get':
      case 'delete':
        response = await firstValueFrom(
          this.httpService[normalizedMethod](finalUrl, { ...config, params: payload })
        );
        break;
      case 'post':
      case 'put':
      case 'patch':
        response = await firstValueFrom(
          this.httpService[normalizedMethod](finalUrl, payload, config)
        );
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  }
}
