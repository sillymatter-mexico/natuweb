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
    if (this._rememberUser || localStorage.getItem('consultant') !== null) {
      localStorage.setItem('consultant', JSON.stringify(consultant));
    } else {
      sessionStorage.setItem('consultant', JSON.stringify(consultant));
    }
    this._consultant = consultant;
  }

  get isLeader(): boolean {
    return (!this.consultant.career_level.code.startsWith('CN') || this.consultant.isDRV);
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

  public deleteUser() {
    this._consultant = null;
  }

  public setAvatar(data: any) {
    return this.http.post('/api/v1/consultant/avatar_create/', data);
  }
}
