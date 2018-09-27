import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _consultant: any;
  private _rememberUser: boolean;

  constructor() { }

  set consultant(consultant: any) {
    if (this._rememberUser) {
      localStorage.setItem('consultant', JSON.stringify(consultant));
    } else {
      sessionStorage.setItem('consultant', JSON.stringify(consultant));
    }
    this._consultant = consultant;
  }

  get consultant() {
    return this._consultant;
  }

  get rememberUser() {
    return this._rememberUser;
  }

  set rememberUser(remember: boolean) {
    this._rememberUser = remember;
  }

  deleteUser() {
    this._consultant = null;
  }
}
