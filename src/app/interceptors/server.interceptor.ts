import { HttpInterceptor, HttpRequest } from '@angular/common/http/';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ServerService} from '../services/server.service';

@Injectable()
export class ServerHttpInterceptor implements HttpInterceptor {

  private urlExceptions: string[] = [];

  private readonly server: string;

  constructor(public serverService: ServerService) {
    this.server = this.serverService.url;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    let usesStagingServer = true;

    for (const ex of this.urlExceptions) {
      if (req.url.match(ex)) {
        usesStagingServer = false;
        break;
      }
    }

    if (usesStagingServer) {
      const newReq = req.clone({
        url: this.server + req.url
      });

      return next.handle(newReq);
    }

    return next.handle(req);
  }
}
