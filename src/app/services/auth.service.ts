import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _logged: boolean;
  private _redirectUrl: string;
  private _rememberSession: boolean;

  constructor(private http: HttpClient, private userService: UserService) { }

  login(user: any) {

    user.device_uuid = 'PC';
    user.device_name = 'PC';
    user.device_platform = 'PC';
    user.device_model = 'PC';

    return this.http.post('/api/v2/login/', user);
  }

  saveSession(consultant: any) {
    this._logged = true;
    this.userService.rememberUser = this._rememberSession;
    this.userService.consultant = consultant;
  }

  set logged(state) {
    this._logged = state;
  }

  get logged() {
    return this._logged;
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url;
  }

  get redirectUrl() {
    return this._redirectUrl;
  }

  set rememberSession(remember: boolean) {
    this._rememberSession = remember;
  }

  get rememberSession() {
    return this._rememberSession;
  }

  getSavedSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      let c: string = localStorage.getItem('consultant');
      if (c !== undefined) {
        this._logged = true;
        this.userService.consultant = JSON.parse(c);
      } else {
        c = sessionStorage.getItem('consultant');
        if (c !== undefined) {
          this._logged = true;
          this.userService.consultant = JSON.parse(c);
        }
      }
      resolve();
    });
  }

  logout() {
    this._logged = false;
    localStorage.clear();
    sessionStorage.clear();
    this.userService.deleteUser();
    window.location.replace('/login');
  }

}
