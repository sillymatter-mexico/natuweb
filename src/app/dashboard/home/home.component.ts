import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {UserService} from '../../services/user.service';
import {combineLatest, forkJoin} from 'rxjs';
import { take } from 'rxjs/operators';
import {AppService} from '../../services/app.service';
import {ToastrService} from 'ngx-toastr';

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

  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private userService: UserService,
              private appService: AppService,
              private toastr: ToastrService) {
    this.myWorkshops = [];
    this.recentWorkshops = [];
    this.news = [];
    this.loading = false;
  }

  ngOnInit() {
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;
    const mine = this.workshopService.getMyWorkshops();
    const recent = this.workshopService.getTodayWorkshops();
    const news = this.appService.getNews();
    const initData = this.appService.getInitData();

    const request = combineLatest([mine, recent, news, initData]);
    request
      .pipe(take(1))
      .subscribe((response: any[]) => {
        this.loading = false;
        this.setData(response);
      }, error => {
        this.loading = false;
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
      });
  }

  private setData(response: any[]) {
    const consultant =  this.userService.consultant;
    this.myWorkshops = response[0].workshop;
    this.recentWorkshops = response[1].workshop;
    this.news = response[2];
    this.appService.news = this.news;
    consultant.carrer_level = response[3].carrer_level;
    consultant.is_staff = response[3].is_staff;
    this.userService.consultant = consultant;
    this.workshopService.workshopTypes = response[3].workshop_group;
  }

  isLeader() {
    return this.userService.consultant.carrer_level.startsWith('CN') || this.userService.consultant.isDRV;
  }

}