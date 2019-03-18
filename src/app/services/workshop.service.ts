import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {Workshop} from '../interfaces/workshop.interface';
import {UserService} from './user.service';

import * as moment from 'moment';

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

  constructor(private http: HttpClient, private userService: UserService) {

    this._workshopTypeList  = [
      {
        id: '7e654b32056b4a5e96cdc18bc0206dd9',
        name: 'Taller<br>mandatorio',
        name_alias: 'Taller mandatorio',
        picture: 'mandatory.png',
        alias: 'mandatorios',
        description: 'Selecciona el Taller Mandatorio de Crecimiento y Mantenimiento ' +
                  'en el que te encuentres especializado para entrenar a tu red.',
        order: 1
      },
      {
        id: '365cd7c9af5e4e9eb713327ae6224bbc',
        name: 'Taller<br>opcional',
        name_alias: 'Taller opcional',
        picture: 'optional.png',
        alias: 'opcionales',
        description: 'Selecciona, crea y entrena a tus consultores con talleres de tu autoría.',
        order: 3
      },
      {
        id: 'f5f63ad3d5284275a3d642cead421612',
        name: 'Fortaleciendo<br>mi negocio',
        name_alias: 'Fortaleciendo mi negocio',
        picture: 'fmn.png',
        alias: 'fmn',
        description: 'Selecciona uno de los talleres y entrena a tu Red ' +
          'para que aprendan todo sobre nuestros productos, negocio y desarrollo.',
        order: 2
      }
    ];

    this._specialists = [
      { id: '0', uuid: '', name: 'Ninguno' },
      { id: '1', uuid: '5afa64de29734e72aed029a1cbdd5d5f', name: 'Emmanuel Romero - Maquillaje' },
      { id: '2', uuid: '00aa0e6ec99845539a322ffebe402ae5', name: 'Julio Castillo - Maquillaje' },
      { id: '3', uuid: '125b97102241448d8c5fad765b590615', name: 'Andrea Quiroga - Perfumería' },
      { id: '4', uuid: '035ba103ed374cf8b8e17df737db8ac5', name: 'Julia García - Rostro' }
    ];

    this._listTypes = [
      {
        name: 'mios',
        title: 'Mis talleres',
        subtitle: 'Consulta y edita los talleres creados',
        list: this.getMyWorkshops(this.userService.consultant.uuid),
        mine: true
      },
      {
        name: 'recientes',
        title: 'Talleres recientes',
        list: this.getTodayWorkshops(),
        mine: false
      }
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

  public getWorkshopTypeByNameAlias(name_alias: string) {
    return this._workshopTypeList.find(x => x.name_alias === name_alias);
  }

  public getWorkshopList(name: string) {
    const data = this._listTypes.find(x => x.name === name);
    if (data) {
      return of(data);
    } else {
      return throwError('No se encontró la lista de talleres solicitada');
    }
  }

  public getMyWorkshops(uuid : string = '', page: number = 1) {
    return this.http.get(`/api/v1/workshop/${uuid}/my_list/?page=` + page)
            .pipe(map ((response: any) => response.data));
  }

  get workshopTypeList() {
    return this._workshopTypeList;
  }

  set workshopTypeList(typeList: any[]) {
    this._workshopTypeList = typeList;
  }

  public getTodayWorkshops() {
    // const date = new Date();
    const date = moment().format('YYYY-MM-DD HH:mm:ss')

    // return this.getWorkshopsByDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
    return this.getWorkshopsByDate(date);
  }

  public getWorkshopPage(url: string) {
    return this.http.get(url)
            .pipe(map ((response: any) => response.data));
  }

  public getWorkshopNameList(id: number) {
    return this.http.get(`/api/v1/workshop/${id}/workshop_by_type/`)
            .pipe(map ((response: any) => response.data));
  }

  public createWorkshop(workshop: Workshop) {
    return this.http.post('/api/v1/workshop/created/', workshop)
            .pipe(map ((response: any) => response.data));
  }

  public editWorkshop(workshop: Workshop, uuid: string) {
    return this.http.put(`/api/v1/workshop/${uuid}/update/`, workshop)
      .pipe(map ((response: any) => response.data));
  }

  public getWorkshop(id: string) {
    return this.http.get(`/api/v1/workshop/${id}/read/`)
            .pipe(map ((response: any) => response.data));
  }

  public getLeaderWorkshop(id: string) {
    return this.http.get(`/api/v1/workshop/${id}/my_list/?page=1`)
            .pipe(map ((response: any) => response.data));
  }

  public saveCheckins(checkins: any, id: any) {
    return this.http.post(`/api/v1/workshop/${id}/check_in/created/`, checkins)
            .pipe(map ((response: any) => response.data));
  }

  public searchStaff(id: number, cn: number) {
    // return this.http.get(`/api/v1/workshop/${cn}/staff/my_list/`)
    //         .pipe(map ((response: any) => response.data));
    return this.http.get(`/api/v1/consultant/search/?search=${cn}`)
            .pipe(map ((response: any) => response.data));
  }

  public addStaff(id: string, data: any) {
    return this.http.post(`/api/v1/workshop/${id}/staff_create/`, data)
            .pipe(map ((response: any) => response.data));
  }

  public sendReport(email: string, id: number) {
    return this.http.get( '/api/v2/report/?email=' + email + '&workshopID=' + id)
            .pipe(map ((response: any) => response.data));
  }

  public getWorkshopsByDate(date, page = 1) {
    let url = '/api/v1/workshop/search_by_date/?page=' + page;

    // if (day !== null) {
    //   url = url + '&day=' + day;
    // }

    // url += '&month=' + month + '&year=' + year;
    url += `&search=${date}`
    // url += `&search=2018-10-11 00:00:00`
    return this.http.get(url)
      .pipe(map ((response: any) => response.data));
  }

  public getDRVList() {
    return this.http.get('/api/v1/consultant/DRV_list/')
            .pipe(map ((response: any) => response.data));
  }

  public getWorkshopsByDRV(id: number, page = 1) {
    return this.http.get(`/api/v1/workshop/${id}/workshop_by_DRV/`)
            .pipe(map ((response: any) => response.data));
  }

  public searchWorkshop(keyword: string, page = 1) {
    return this.http.get(`/api/v1/workshop/search/?search=${keyword}`)
            .pipe(map ((response: any) => response.data));
  }

  public getWorkShopAssistance(id: string) {
    return this.http.get(`/api/v1/workshop/${id}/assistance/list/`)
            .pipe(map ((response: any) => response.data));
  }

  public downloadWorkShopAssistance(id: string, email: string) {
    return this.http.get(`/api/v1/workshop/${id}/report_assistance/?mail=${email}`)
            .pipe(map ((response: any) => response));
  }

  public deleteWorkshop(id: any) {

    return this.http.request('delete',  `/api/v1/workshop/${id}/delete/`);
  }

  public uploadWorkshopList(url: string, fd: FormData) {
    return this.http.post(url, fd);
  }
}
