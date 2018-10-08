import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  private _workshopTypes: any;
  private _workshopTypeList: any[];

  constructor(private http: HttpClient) {
    this._workshopTypeList  = [
      {name: `Taller<br>mandatorio`, picture: 'mandatory.png'},
      {name: `Taller<br>opcional`, picture: 'optional.jpg'},
      {name: `Fortaleciendo<br>mi negocio`, picture: 'fmn.jpg'}
    ];
  }

  set workshopTypes(types: any) {
    this._workshopTypes = types;
  }

  get workshopTypes() {
    return this._workshopTypes;
  }

  getMyWorkshops(page: number = 1) {
    return this.http.get('/api/v2/workshop/mylist/?page=' + page);
  }

  get workshopTypeList() {
    return this._workshopTypeList;
  }

  set workshopTypeList(typeList: any[]) {
    this._workshopTypeList = typeList;
  }

  getWorkshopsByDate(day, month, year, page = 1) {
    let url = '/api/v2/workshop/search-day/?page=' + page;

    if (day !== null) {
      url = url + '&day=' + day;
    }

    url += '&month=' + month + '&year=' + year;

    return this.http.get(url);
  }

  getTodayWorkshops() {
    const date = new Date();
    return this.getWorkshopsByDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }
}
