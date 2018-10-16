import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-view',
  templateUrl: './workshop-view.component.html',
  styleUrls: ['./workshop-view.component.scss']
})
export class WorkshopViewComponent implements OnInit {

  public workshop: any;
  public loading: boolean;

  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private toastr: ToastrService) {
    this.loading = false;
  }

  ngOnInit() {

    this.route.paramMap.subscribe((params: ParamMap) => {

      const id = params.get('id');
      this.fetchWorkshop(+id);
    });
  }

  fetchWorkshop(id: number) {
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        this.loading = false;
        this.workshop = response.workshop;
        this.workshop.assistance  = response.assistance;
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Ocurrió un error al cargar el taller');
      });
  }

}
