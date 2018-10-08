import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../services/workshop.service';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';

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

  constructor(private workshopService: WorkshopService, private toastr: ToastrService) {
    this.loading = false;
    this.workshopTypeList = this.workshopService.workshopTypeList;
    this.myWorkshops = [];
    this.todayWorkshops = [];
    this.date = new Date();
    this.dayNames  = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'HOY'];
    this.dayList = [];
    this.buildCalendar();
  }

  ngOnInit() {
    this.fetchWorkshops();
  }

  private fetchWorkshops() {
    this.loading = true;
    const mine = this.workshopService.getMyWorkshops();
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
    this.myWorkshops = response[0].data.workshop;
    this.todayWorkshops = response[1].data.workshop;
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

  getActiveDay(day) {
    return (this.date.getDate() === parseInt(day.number, 10) && (this.date.getMonth() + 1) === parseInt(day.month, 10));
  }

}
