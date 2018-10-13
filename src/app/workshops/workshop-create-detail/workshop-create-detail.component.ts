import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Workshop} from '../../interfaces/workshop.interface';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {LocationSelectorComponent} from '../../shared/location-selector/location-selector.component';

@Component({
  selector: 'app-workshop-create-detail',
  templateUrl: './workshop-create-detail.component.html',
  styleUrls: ['./workshop-create-detail.component.scss']
})
export class WorkshopCreateDetailComponent implements OnInit {

  public loading: boolean;
  public workshopName: any;
  public workshopType: any;
  public workshop: Workshop;
  public specialists: any[];
  public selectedDate: string;
  public selectedHour: string;
  public today: Date;
  public hours: any[];
  private locationModal: BsModalRef;

  constructor(private workshopService: WorkshopService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService) {
    this.loading = false;
    this.hours = this.workshopService.hours;
    this.specialists = this.workshopService.specialists;
    this.today = new Date();
    this.workshop = {
      private: null,
      address_point: {
        latitude: null,
        longitude: null
      },
      address_string: null,
      description: null,
      duration: null,
      id_name: null,
      name: null,
      sede: null,
      specialist: null,
      start_date: null
    };
  }

  ngOnInit() {
    this.workshopName = this.workshopService.selectedWorkshop;

    this.route.paramMap.subscribe((params: ParamMap) => {

      const type = params.get('type');
      this.workshopType = this.workshopService.getWorkshopType(type);

      const id = parseInt(params.get('workshop'), 10);

      if (this.workshopName === null || this.workshopType === null || id !== this.workshopName.id) {
        this.router.navigate(['/talleres', 'crear', this.workshopType.alias]);
      } else {
        this.workshop.id_name = this.workshopName.id;
        this.workshop.name = this.workshopName.name;
        this.workshop.description = this.workshopName.description;
        this.workshop.duration = this.hours[0].value;
        this.workshop.specialist = 0;
      }
    });
  }

  onSetPrivacy(status: boolean) {
    this.workshop.private = status;
  }

  onSubmit(form: any) {
    console.log(form);
  }

  onSelectLocation() {
    this.locationModal = this.modalService.show(LocationSelectorComponent);
    this.locationModal.content.onClose.subscribe((response: any) => {
      if (response.accepted) {
        this.workshop.address_string = response.formattedAddress;
        this.workshop.address_point = response.addressPoint;
      }
    });
  }

}
