import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../services/workshop.service';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {

  public workshopTypeList: any[];
  public myWorkshops: any[];
  public todayWorkshops: any[];
  public loading: boolean;
  public date: Date;
  public dayNames: string[];
  public dayList: any[];
  public isLeader: boolean;
  public myWorkshopsTitle: string;
  public myWorkshopsSubtitle: string;

  constructor(private workshopService: WorkshopService, private toastr: ToastrService, private userService: UserService) {
    this.loading = false;
    this.workshopTypeList = this.workshopService.workshopTypeList;
    this.myWorkshops = [];
    this.todayWorkshops = [];
    this.date = new Date();
    this.dayNames  = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'HOY'];
    this.dayList = [];
    this.isLeader = this.userService.isLeader;
    this.buildCalendar();
  }

  ngOnInit() {
    this.myWorkshopsTitle = this.userService.isLeader ? 'Mis talleres' : 'Soy Staff';
    this.myWorkshopsSubtitle = this.userService.isLeader ? 'Consulta tus talleres creados' : 'Consulta los talleres en los que te asignaron como staff';
    this.fetchWorkshops();
  }

  private fetchWorkshops() {
    this.loading = true;
    const mine = this.userService.isLeader ? this.workshopService.getMyWorkshops(this.userService.consultant.uuid) : this.workshopService.getStaffWorkshops(this.userService.consultant.uuid)

    const recent = this.workshopService.getTodayWorkshops();

    const request = forkJoin([mine, recent]);
    request
      .pipe(take(1))
      .subscribe((response: any[]) => {
        this.loading = false;
        this.setData(response);
      }, error => {
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
        console.log(error);
      });
  }

  private setData(response: any[]) {
    this.myWorkshops = response[0];
    this.todayWorkshops = response[1];
  }

  private buildCalendar() {
    const currentDate = moment();
    const day = currentDate.day();

    for (let x = 0; x <= 7; x++) {
      const m = moment();
      if (x < day) {
        m.subtract(day - x, 'days');
      } else if (x > day) {
        m.add(x - day, 'days');
      }
      const dayName = (x === day) ? this.dayNames[7] : this.dayNames[x % 7];

      const dayObject = {
        name: dayName,
        number: m.format('D'),
        month: m.format('M'),
        year: m.format('YYYY')
      };

      this.dayList.push(dayObject);
    }
  }

  public getActiveDay(day) {
    return (this.date.getDate() === parseInt(day.number, 10) && (this.date.getMonth() + 1) === parseInt(day.month, 10));
  }

}
