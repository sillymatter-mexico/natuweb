import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  private _workshopTypes: any;
  private _workshopTypeList: any[];
  private _listTypes: any[];

  constructor(private http: HttpClient) {
    this._workshopTypeList  = [
      {name: `Taller<br>mandatorio`, picture: 'mandatory.png'},
      {name: `Taller<br>opcional`, picture: 'optional.jpg'},
      {name: `Fortaleciendo<br>mi negocio`, picture: 'fmn.jpg'}
    ];

    this._listTypes = [
      {name: 'mios', title: 'Mis talleres', list: this.getMyWorkshops()},
      {name: 'recientes', title: 'Talleres recientes', list: this.getTodayWorkshops()}
    ];
  }

  set workshopTypes(types: any) {
    this._workshopTypes = types;
  }

  get workshopTypes() {
    return this._workshopTypes;
  }

  public getWorkshopList(name: string) {
    const data = this._listTypes.find(x => x.name === name);
    if (data) {
      return of(data);
    } else {
      return throwError('No se encontró la lista de talleres solicitada');
    }
  }

  public getMyWorkshops(page: number = 1) {
    return this.http.get('/api/v2/workshop/mylist/?page=' + page)
            .pipe(map ((response: any) => response.data));
  }

  get workshopTypeList() {
    return this._workshopTypeList;
  }

  set workshopTypeList(typeList: any[]) {
    this._workshopTypeList = typeList;
  }

  public getWorkshopsByDate(day, month, year, page = 1) {
    let url = '/api/v2/workshop/search-day/?page=' + page;

    if (day !== null) {
      url = url + '&day=' + day;
    }

    url += '&month=' + month + '&year=' + year;

    return this.http.get(url)
            .pipe(map ((response: any) => response.data));
  }

  public getTodayWorkshops() {
    const date = new Date();
    return this.getWorkshopsByDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  public getWorkshopPage(url: string) {
    return this.http.get(url)
      .pipe(map ((response: any) => response.data));
  }
}
