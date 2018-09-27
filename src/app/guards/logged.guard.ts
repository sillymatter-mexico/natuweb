import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';

@Injectable()
export class LoggedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.logged && this.userService.user) {
      if (url === '/login') {
        this.router.navigate(['/inicio']);
      } else {
        this.router.navigate([url]);
      }
      return false;
    }
    return true;
  }
}
