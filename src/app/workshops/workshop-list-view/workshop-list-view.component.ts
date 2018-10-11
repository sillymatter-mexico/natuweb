import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RouterExtendService} from '../../services/router-extend.service';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-workshop-list-view',
  templateUrl: './workshop-list-view.component.html',
  styleUrls: ['./workshop-list-view.component.scss']
})
export class WorkshopListViewComponent implements OnInit {

  public today: Date;
  public title: string;
  public previous: string;
  public workshopList: any[];
  public loading: boolean;
  public previousPage: string;
  public nextPage: string;
  public consultant: any;
  public height: number;

  constructor(private router: Router,
              private routerExtend: RouterExtendService,
              private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private toastr: ToastrService,
              private userService: UserService) {
    this.today = new Date();
    this.loading = false;
    this.consultant = this.userService.consultant;
  }

  ngOnInit() {
    this.previous = this.routerExtend.getPreviousUrl();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const type = params.get('type');
      this.fetchWorkshops(type);
    });
    this.height = window.innerHeight;
  }

  public goToPrevious(): void {
      this.router.navigateByUrl(this.previous);
  }

  private fetchWorkshops(type: string) {
    this.workshopService.getWorkshopList(type)
      .subscribe((data: any) => {
        this.title = data.title;
        this.fetchList(data.list);
      }, (error: any) => {
        console.log(error);
        this.toastr.error(error);
      });
  }

  private fetchList(list: Observable<any>) {
    this.loading = true;
    list.subscribe((data: any) => {
      this.loading = false;
      this.workshopList = data.workshop;
      this.previousPage = data.previousPage;
      this.nextPage = data.nextPage;
    }, (error: any) => {
      console.log(error);
      this.loading = false;
      this.toastr.error('Lo sentimos, ocurrió un error al cargar la lista de talleres');
    });
  }

  public getPage(url: string) {
    this.loading = true;
    this.workshopService.getWorkshopPage(url)
      .subscribe((data: any) => {
        console.log('data', data);
        this.loading = false;
        this.workshopList = data.workshop;
        this.previousPage = data.previousPage;
        this.nextPage = data.nextPage;
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error al cargar la lista de talleres');
      });
  }

}
