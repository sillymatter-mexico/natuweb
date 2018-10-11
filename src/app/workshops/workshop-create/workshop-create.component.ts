import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-create',
  templateUrl: './workshop-create.component.html',
  styleUrls: ['./workshop-create.component.scss']
})
export class WorkshopCreateComponent implements OnInit {

  public workshopType: any;
  public loading: boolean;
  public nameList: any[];

  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private router: Router,
              private toastr: ToastrService) {
    this.loading = false;
    this.nameList = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const type = params.get('type');
      this.workshopType = this.workshopService.getWorkshopType(type);
      if (this.workshopType === null) {
        this.router.navigate(['/talleres']);
      } else {
        this.fetchNameList();
      }
    });
  }

  public fetchNameList() {
    this.loading = true;
    this.workshopService.getWorkshopNameList(this.workshopType.id)
      .subscribe((response: any) => {
        this.loading = false;
        this.nameList = response.name_list;
      }, (error: any) => {
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error en el servidor.');
      });
  }

  setSelectedWorkshop(workshop: any) {
    this.workshopService.selectedWorkshop = workshop;
    this.router.navigate([workshop.id], {relativeTo: this.route});
  }

}
