import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../services/workshop.service';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators';

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

  constructor(private workshopService: WorkshopService) {
    this.loading = false;
    this.workshopTypeList = [
      {name: `Taller<br>mandatorio`, picture: 'mandatory.png'},
      {name: `Taller<br>opcional`, picture: 'optional.jpg'},
      {name: `Fortaleciendo<br>mi negocio`, picture: 'fmn.jpg'}
    ];
    this.myWorkshops = [];
    this.todayWorkshops = [];
    this.date = new Date();
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
        this.loading = true;
        console.log(error);
      });
  }

  private setData(response: any[]) {
    this.myWorkshops = response[0].data.workshop;
    this.todayWorkshops = response[1].data.workshop;
  }

}
