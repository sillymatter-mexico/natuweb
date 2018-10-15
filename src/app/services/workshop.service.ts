import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {Workshop} from '../interfaces/workshop.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  private _workshopTypes: any;
  private _workshopTypeList: any[];
  private _listTypes: any[];
  private _selectedWorkshopType: any;
  private _selectedWorkshop: any;
  private readonly _specialists: any[];
  private readonly _hours: any[] = [];

  constructor(private http: HttpClient) {

    this._workshopTypeList  = [
      {id: 1, name: 'Taller<br>mandatorio', picture: 'mandatory.png', alias: 'mandatorios'},
      {id: 2, name: 'Taller<br>opcional', picture: 'optional.jpg', alias: 'opcionales'},
      {id: 3, name: 'Fortaleciendo<br>mi negocio', picture: 'fmn.jpg', alias: 'fmn'}
    ];

    this._specialists = [
      { id: '0', name: 'Ninguno' },
      { id: '1', name: 'Emmanuel Romero - Maquillaje' },
      { id: '2', name: 'Julio Castillo - Maquillaje' },
      { id: '3', name: 'Andrea Quiroga - Perfumería' },
      { id: '4', name: 'Julia García - Rostro' }
    ];

    this._listTypes = [
      {name: 'mios', title: 'Mis talleres', list: this.getMyWorkshops()},
      {name: 'recientes', title: 'Talleres recientes', list: this.getTodayWorkshops()}
    ];

    for (let x = 1; x <= 12; x++) {
      this._hours.push({value: x * 60, display: x});
    }

  }

  set workshopTypes(types: any) {
    this._workshopTypes = types;
  }

  get workshopTypes() {
    return this._workshopTypes;
  }

  get specialists() {
    return this._specialists;
  }

  get hours() {
    return this._hours;
  }

  set selectedWorkshopType(workshop: any) {
    this._selectedWorkshopType = workshop;
    sessionStorage.setItem('selectedWorkshopName', JSON.stringify(workshop));
  }

  get selectedWorkshopType() {
    if (this._selectedWorkshopType) {
      return this._selectedWorkshopType;
    }
    return JSON.parse(sessionStorage.getItem('selectedWorkshopName'));
  }

  public clearSelectedWorkshopType() {
    this._selectedWorkshopType = null;
    sessionStorage.removeItem('selectedWorkshopName');
  }

  set selectedWorkshop(workshop: any) {
    this._selectedWorkshop = workshop;
    sessionStorage.setItem('selectedWorkshop', JSON.stringify(workshop));
  }

  get selectedWorkshop() {
    if (this._selectedWorkshop) {
      return this._selectedWorkshop;
    }
    return JSON.parse(sessionStorage.getItem('selectedWorkshop'));
  }

  public clearSelectedWorkshop() {
    this._selectedWorkshopType = null;
    sessionStorage.removeItem('selectedWorkshop');
  }

  public getWorkshopType(alias: string) {
    return this._workshopTypeList.find(x => x.alias === alias);
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

  public getWorkshopNameList(id: number) {
    return this.http.get('/api/v2/workshop-list/?id=' + id)
            .pipe(map ((response: any) => response.data));
  }

  public createWorkshop(workshop: Workshop) {
    return this.http.post('/api/v2/workshop/', workshop);
  }
}
