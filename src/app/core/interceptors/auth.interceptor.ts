import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (request, next) => {
  let headers = request.headers.set('Authorization', 'F1HYhJN5F9FBPd8VDn5jakDihhyki6U501w2GYCIaXyxRengnxOqfVv8')
    .set('Accept', '*/*');
  const requestWithAuth = request.clone({
    headers: headers,
  });
  return next(requestWithAuth);
};
