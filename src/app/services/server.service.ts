import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly _url: string;

  constructor() {
    this._url = 'https://mi-natura.herokuapp.com';
  }

  get url() {
    return this._url;
  }

}
