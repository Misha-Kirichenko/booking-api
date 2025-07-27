import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dto = this.reflector.get('serialize', context.getHandler());
    if (!dto) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => plainToInstance(dto, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      })),
    );
  }
}
