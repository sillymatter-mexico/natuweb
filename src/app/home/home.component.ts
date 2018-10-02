import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WorkshopService} from '../services/workshop.service';
import {UserService} from '../services/user.service';
import {forkJoin, of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';
import {AppService} from '../services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public myWorkshops: any[];
  public recentWorkshops: any[];
  public news: any[];
  public loading: boolean;
  private date: Date;


  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private userService: UserService,
              private appService: AppService) {
    this.myWorkshops = [];
    this.recentWorkshops = [];
    this.news = [];
    this.date = new Date();
    this.loading = false;
  }

  ngOnInit() {
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;
    const mine = this.workshopService.getMyWorkshops();
    const recent = this.workshopService.getWorkshopsByDate(this.date.getDate(), this.date.getMonth() + 1, this.date.getFullYear());
    const news = this.appService.getNews();

    const request = forkJoin([mine, recent, news]);
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
    this.recentWorkshops = response[1].data.workshop;
    this.news = response[2].data.news;
    this.userService.consultant.carrer_level = response[2].data.carrer_level;
    this.userService.consultant.is_staff = response[2].data.is_staff;
    this.workshopService.workshopTypes = response[2].data.workshop_group;
  }

}
