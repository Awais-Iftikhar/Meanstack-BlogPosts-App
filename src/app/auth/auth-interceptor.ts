import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authservice: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authservice.gettoken();
    const authreq = req.clone({headers : req.headers.set('Authorization' , `${token}`)});
    return next.handle(authreq);
  }
}
