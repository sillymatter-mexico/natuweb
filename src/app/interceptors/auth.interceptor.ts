import { HttpInterceptor, HttpRequest } from '@angular/common/http/';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {UserService} from '../services/user.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  private urlExceptions: string [] = [
    '/api/v2/login/',
  ];

  private token: string;

  constructor(private userService: UserService) {  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    let requiresToken = true;

    for (const ex of this.urlExceptions) {
      if (req.url.match(ex)) {
        requiresToken = false;
        break;
      }
    }

    if (requiresToken) {

      let newReq;

      this.token = this.userService.consultant.token;

      newReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          this.token
        )
      });

      return next.handle(newReq);

    }

    return next.handle(req);
  }
}
