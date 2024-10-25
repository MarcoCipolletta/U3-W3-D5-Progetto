import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const data = this.authSvc.authSubject$.getValue();
    if (!data) return next.handle(request);

    //   return this.authSvc.authSubject$.pipe(switchMap(data => {

    //     if(!data){
    //       return next.handle(request)
    //     }

    const newRequest = request.clone({
      headers: request.headers.append(
        'Authorization',
        `Bearer ${data.accessToken}`
      ),
    });

    return next.handle(newRequest);
  }
}
