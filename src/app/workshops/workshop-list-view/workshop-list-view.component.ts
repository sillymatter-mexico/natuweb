import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {RouterExtendService} from '../../services/router-extend.service';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';

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

  constructor(private router: Router,
              private routerExtend: RouterExtendService,
              private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private toastr: ToastrService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.previous = this.routerExtend.getPreviousUrl();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const type = params.get('type');
      this.fetchWorkshops(type);
    });
  }

  public goToPrevious(): void {
      this.router.navigateByUrl(this.previous);
  }

  private fetchWorkshops(type: string) {
    this.workshopService.getWorkshopList(type)
      .subscribe((data: any) => {
        console.log('data', data);
        this.title = data.title;
        this.fetchList(data.list);
      }, (error: any) => {
        console.log(error);
        this.toastr.error(error);
      });
  }

  private fetchList(list: Observable<any>) {
    list.subscribe((data: any) => {
      console.log('data', data);
    }, (error: any) => {
      console.log(error);
      this.toastr.error('Lo sentimos, ocurrió un error al cargar la lista de talleres');
    });
  }

}
