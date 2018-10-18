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
  private readonly _specialists: any[];
  private readonly _hours: any[] = [];
  private _watchPermission: any;

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
      {name: 'mios', title: 'Mis talleres', list: this.getMyWorkshops(), mine: true},
      {name: 'recientes', title: 'Talleres recientes', list: this.getTodayWorkshops(), mine: false}
    ];

    for (let x = 1; x <= 12; x++) {
      this._hours.push({value: x * 60, display: x});
    }

    this._watchPermission = {
      permission: false,
      workshop: null
    };

  }

  get watchPermission() {
    return this._watchPermission;
  }

  set watchPermission(watchPermission: any) {
    this._watchPermission.permission = watchPermission.permission;
    this._watchPermission.workshop = watchPermission.workshop;
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
    return this.http.post('/api/v2/workshop/', workshop)
            .pipe(map ((response: any) => response.detail));
  }

  public getWorkshop(id: number) {
    return this.http.get('/api/v2/workshop/?workshop=' + id)
            .pipe(map ((response: any) => response.data));
  }

  public getLeaderWorkshop(id: number) {
    return this.http.get('/api/v2/workshop/mylist/' + id + '/')
            .pipe(map ((response: any) => response.data));
  }

  public saveCheckins(checkins: any) {
    return this.http.post('/api/v2/checkin/', checkins)
            .pipe(map ((response: any) => response.data));
  }

  public searchStaff(id: number, cn: number) {
    return this.http.get('/api/v2/workshop/staff/?workshop_ID=' + id + '&cn_code=' + cn)
            .pipe(map ((response: any) => response.data));
  }

  public addStaff(data: any) {
    return this.http.post('/api/v2/workshop/staff/', data)
            .pipe(map ((response: any) => response.data));
  }

  public sendReport(email: string, id: number) {
    return this.http.get( '/api/v2/report/?email=' + email + '&workshopID=' + id)
            .pipe(map ((response: any) => response.data));
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

  public getDRVList() {
    return this.http.get('/api/v2/drv-list/')
            .pipe(map ((response: any) => response.data));
  }

  public getWorkshopsByDRV(id: number, page = 1) {
    return this.http.get('/api/v2/workshop/search-drv/?page=' + page + '&drv_id=' + id)
            .pipe(map ((response: any) => response.data));
  }

  public searchWorkshop(keyword: string, page = 1) {
    return this.http.get('/api/v2/workshop/search/?page=' + page + '&search=' + keyword)
            .pipe(map ((response: any) => response.data));
  }

}
