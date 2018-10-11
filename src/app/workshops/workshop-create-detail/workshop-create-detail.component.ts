import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-workshop-create-detail',
  templateUrl: './workshop-create-detail.component.html',
  styleUrls: ['./workshop-create-detail.component.scss']
})
export class WorkshopCreateDetailComponent implements OnInit {

  public loading: boolean;
  public workshopName: any;
  public workshopType: any;

  constructor(private workshopService: WorkshopService, private route: ActivatedRoute, private router: Router) {
    this.loading = false;
  }

  ngOnInit() {
    this.workshopName = this.workshopService.selectedWorkshop;

    this.route.paramMap.subscribe((params: ParamMap) => {

      const type = params.get('type');
      this.workshopType = this.workshopService.getWorkshopType(type);
      console.log(this.workshopType);

      const id = parseInt(params.get('workshop'), 10);

      if (this.workshopName === null || this.workshopType === null || id !== this.workshopName.id) {
        this.router.navigate(['/talleres', 'crear', this.workshopType.alias]);
      } else {
        // this.fetchNameList();
      }
    });
  }

}
