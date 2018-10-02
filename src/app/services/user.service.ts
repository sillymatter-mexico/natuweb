import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _consultant: any;
  private _rememberUser: boolean;

  constructor(private http: HttpClient) { }

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

  setAvatar(data: any) {
    return this.http.put('/api/gamification/consultants-avatars/', data);
  }
}
