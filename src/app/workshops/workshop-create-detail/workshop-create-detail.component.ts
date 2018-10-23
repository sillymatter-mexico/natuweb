import {Component, OnInit, TemplateRef} from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Workshop} from '../../interfaces/workshop.interface';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {LocationSelectorComponent} from '../../shared/location-selector/location-selector.component';
import {UserService} from '../../services/user.service';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {WorkshopCreatedComponent} from '../workshop-created/workshop-created.component';

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
  private createdWorkshopModal: BsModalRef;
  public privateEventModal: BsModalRef;
  public consultant: any;
  public loadingWorkshop: boolean;

  constructor(private workshopService: WorkshopService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private userService: UserService,
              private toast: ToastrService) {
    this.loadingWorkshop = false;
    this.loading = false;
    this.hours = this.workshopService.hours;
    this.specialists = this.workshopService.specialists;
    this.today = new Date();
    this.consultant = this.userService.consultant;
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
    this.workshopName = this.workshopService.selectedWorkshopType;

    this.route.paramMap.subscribe((params: ParamMap) => {

      const type = params.get('type');
      this.workshopType = this.workshopService.getWorkshopType(type);

      const id = parseInt(params.get('workshop'), 10);

      if (this.workshopName === null || this.workshopType === null || id !== this.workshopName.id) {
        this.router.navigate(['/talleres', 'crear', this.workshopType.alias]);
      } else {
        this.workshop.private = false;
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
    if (form.valid) {
      this.loadingWorkshop = true;
      const date = moment(this.selectedDate).format('YYYY-MM-DD');
      const hour = moment(this.selectedHour).format('HH:mm:ss');
      this.workshop.start_date = `${date}T${hour}Z`;
      if (this.workshop.sede === null || this.workshop.sede.trim() === '') {
        delete this.workshop.sede;
      }
      this.workshop.duration = +this.workshop.duration; // to make sure it is an integer, otherwise server crashes

      // not implemented yet.
      delete this.workshop.private;

      console.log(this.workshop);
      this.workshopService.createWorkshop(this.workshop)
        .subscribe((response: any) => {
          this.loadingWorkshop = false;
          const config = {
            keyboard: false,
            ignoreBackdropClick: true
          };
          const initialState = {
            workshop: response
          };
          (<any>window).ga('send', 'event', 'talleres', 'crear', response.name);
          this.createdWorkshopModal = this.modalService.show(WorkshopCreatedComponent, {initialState});
        }, (error: any) => {
          this.loadingWorkshop = false;
          console.log('error', error);
          this.toast.error('Lo sentimos, ocurrió un error al crear el taller.');
        });
    }
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

  onOpenPrivateModal(privateModal: TemplateRef<any>) {
    this.privateEventModal = this.modalService.show(privateModal);
  }

}
