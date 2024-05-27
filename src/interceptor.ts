import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.locals = { startTime: Date.now() };
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const endTime = Date.now();
        response.locals.responseTime = endTime - request.locals.startTime;
        response.setHeader('X-Response-Time', `${response.locals.responseTime}`);
      }),
    );
  }
}