import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';

export interface ApiEnvelope<T> {
  success: true;
  statusCode: number;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiEnvelope<T>> {
  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<ApiEnvelope<T>> {
    const statusCode = ctx.switchToHttp().getResponse<Response>().statusCode;
    return next
      .handle()
      .pipe(map((data) => ({ success: true as const, statusCode, data, timestamp: new Date().toISOString() })));
  }
}
