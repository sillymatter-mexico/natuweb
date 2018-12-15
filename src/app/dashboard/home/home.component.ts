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
  public myWorkshopsTitle;
  public myWorkshopsSubtitle;

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
    this.myWorkshopsTitle = this.userService.isLeader ? 'Mis talleres' : 'Soy Staff';
    this.myWorkshopsSubtitle = this.userService.isLeader ? 'Consulta tus talleres creados' : 'Consulta los talleres en los que te asignaron como staff';
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;
    const mine = this.workshopService.getMyWorkshops(this.userService.consultant.uuid);
    const recent = this.workshopService.getTodayWorkshops();
    const news = this.appService.getNews();
    // const initData = this.appService.getInitData();

    // const request = combineLatest([mine, recent, news, iniStData]);
    const request = combineLatest([mine, recent, news]);
    request
      .pipe(take(1))
      .subscribe((response: any[]) => {
        this.loading = false;
        this.setData(response);
      }, error => {
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
      });
  }

  private setData(response: any[]) {
    const consultant =  this.userService.consultant;
    this.myWorkshops = response[0];
    this.recentWorkshops = response[1];
    this.news = response[2];
    this.appService.news = this.news;
    consultant.career_level = response[3].career_level;
    consultant.is_staff = response[3].is_staff;
    this.userService.consultant = consultant;
    this.workshopService.workshopTypes = response[3].workshop_group;
  }

}
