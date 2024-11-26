
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadGatewayException,
    HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * set global intersepter to modify the response data
 */
@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                const { response } = error;
                if (response && response.statusCode && response.message) {
                    const { statusCode, message } = response;
                    throw new HttpException({ status: 'error', message }, statusCode);
                } else {
                    // if message is object, then destruct it and send it as response
                    if (typeof error.response === 'object') {
                        throw new HttpException({ status: 'error', ...error.response }, error?.status || 500);
                    }
                    throw new HttpException({ status: 'error', message: error.response }, error?.status || 500);
                }
            }),
            map((data) => {
                return { status: 'ok', data };
            }),
        );
    }
}