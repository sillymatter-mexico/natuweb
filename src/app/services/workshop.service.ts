import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  private _workshopTypes: any;

  constructor(private http: HttpClient) { }

  set workshopTypes(types: any) {
    this._workshopTypes = types;
  }

  get workshopTypes() {
    return this._workshopTypes;
  }

  getMyWorkshops(page: number = 1) {
    return this.http.get('/api/v2/workshop/mylist/?page=' + page);
  }

  getWorkshopsByDate(day, month, year, page = 1) {
    let url = '/api/v2/workshop/search-day/?page=' + page;

    if (day !== null) {
      url = url + '&day=' + day;
    }

    url += '&month=' + month + '&year=' + year;

    return this.http.get(url);
  }
}
