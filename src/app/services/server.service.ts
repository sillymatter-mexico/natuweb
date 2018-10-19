import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly _url: string;
  private readonly _pageUrl: string;
  private readonly _devPageUrl: string;

  constructor() {
    this._url = 'https://mi-natura.herokuapp.com';
    this._devPageUrl = 'https://mn-web-dev.herokuapp.com';
    this._pageUrl = 'https://mi-natura-web.herokuapp.com';
  }

  get url() {
    return this._url;
  }

  get pageUrl() {
    return this._pageUrl;
  }

  get devPageUrl() {
    return this._devPageUrl;
  }

}
