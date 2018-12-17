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
import {AddressPoint} from '../../interfaces/address-point.interface';

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
  public editMode: boolean;
  public workshopPicture: string;

  constructor(private workshopService: WorkshopService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private userService: UserService,
              private toastr: ToastrService) {
    this.editMode = false;
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
    this.editMode = this.router.url.includes('editar');
    if (this.editMode) {
      this.setEditModule();
    } else {
      this.setCreateModule();
    }
  }

  private isWorkshopLeader() {
    return this.consultant.id === this.workshop.author.id;
  }

  private setCreateModule() {
    this.workshopName = this.workshopService.selectedWorkshopType;

    this.route.paramMap.subscribe((params: ParamMap) => {

      const type = params.get('type');
      this.workshopType = this.workshopService.getWorkshopType(type);

      const id = params.get('workshop');

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

  private setEditModule() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id: string = params.get('workshop');
      this.fetchWorkshop(id);
    });
  }

  fetchWorkshop(id: string) {
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        const workshop = response.workshop;
        this.workshopPicture = workshop.images;
        this.workshop.workshop_id = workshop.id;
        this.workshop.name = response.workshop.name;
        this.workshop.description = workshop.description;
        this.workshop.author = workshop.author;
        if (workshop.sede) {
          this.workshop.sede = workshop.sede;
        }
        this.selectedDate = moment(workshop.start_date).utc().format('YYYY-MM-DD');
        this.selectedHour = moment(workshop.start_date).utc().format('YYYY-MM-DD[T]HH:mm');
        this.workshop.address_string = workshop.position_string;
        this.workshop.specialist = 0;
        this.workshop.duration = this.getDuration(workshop);
        if (workshop.point) {
          this.workshop.address_point = this.getCoordinates(workshop.point);
        }
        this.loading = false;
        if (!this.isWorkshopLeader()) {
          this.router.navigate(['/talleres', 'invitacion', id]);
        }
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Ocurrió un error al cargar el taller');
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

      if (this.editMode) {
        this.editWorkshop();
      } else {
        this.createWorkshop();
      }
    }
  }

  private editWorkshop() {
    const data = {...this.workshop};
    delete data.author;
    delete data.id_name;
    this.workshopService.editWorkshop(this.workshop)
      .subscribe((response: any) => {
        this.loadingWorkshop = false;
        const initialState = {
          workshop: response,
          edit: true
        };
        this.createdWorkshopModal = this.modalService.show(WorkshopCreatedComponent,
          {initialState, keyboard: false, ignoreBackdropClick: true});
      }, (error: any) => {
        this.loadingWorkshop = false;
        console.log('error', error);
        this.toastr.error('Lo sentimos, ocurrió un error al editar el taller.');
      });
  }


  private createWorkshop() {
    this.loadingWorkshop = true;
    const date = moment(this.selectedDate).format('YYYY-MM-DD');
    const hour = moment(this.selectedHour).format('HH:mm:ss');
    this.workshop.start_date = `${date}T${hour}Z`;
    if (this.workshop.sede === null || (this.workshop.sede && this.workshop.sede.trim() === '')) {
      delete this.workshop.sede;
    }
    this.workshop.duration = +this.workshop.duration; // to make sure it is an integer, otherwise server crashes

    // not implemented yet.
    delete this.workshop.private;

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
        this.toastr.error('Lo sentimos, ocurrió un error al crear el taller.');
      });
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

  getDuration(workshop: any) {
    const start = moment(workshop.start_date);
    const end = moment(workshop.finish_date);
    const duration = end.diff(start, 'minutes');
    return +duration;
  }

  getCoordinates(address: string): AddressPoint {
    const point = address.match(/\(([^)]+)\)/)[1].split(' ');
    const address_point: AddressPoint = {
      latitude: parseFloat(point[0]),
      longitude: parseFloat(point[1])
    };
    return address_point;
  }

}
