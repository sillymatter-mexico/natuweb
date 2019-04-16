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
      sede:"",
      address: null,
      description_workshop: null,
      duration: null,
      description: null,
      id_name: null,
      name: null,
      specialist: null,
      specialist_uuid: '',
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

      if (this.workshopName === null || this.workshopType === null || id !== this.workshopName.uuid) {
        this.router.navigate(['/talleres', 'crear', this.workshopType.alias]);
      } else {
        this.workshop.private = false;
        this.workshop.name_workshop_uuid = this.workshopName.uuid;
        this.workshop.name = this.workshopName.name;
        this.workshop.description_workshop = this.workshopName.description_workshop ? this.workshopName.description_workshop : this.workshopName.description;
        this.workshop.duration = this.hours[0].value;
        // this.workshop.specialist_uuid = this.workshop.specialist.lenght > 0 ? this.workshop.specialist[0] : ''
        this.workshop.private = true;
        this.workshop.sede = "";
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
    this.workshop.lat = 0.0
    this.workshop.lng = 0.0
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        const workshop = response;
        this.workshopName = workshop.name_workshop;
        this.workshop.name_workshop_uuid = workshop.name_workshop ? workshop.name_workshop.uuid : '';
        this.workshopPicture = workshop.images;
        this.workshop.workshop_id = workshop.id;
        this.workshop.private = true;
        this.workshop.name_workshop = workshop.name_workshop ? workshop.name_workshop.name_workshop : '';
        this.workshop.description_workshop = workshop.description_workshop;
        this.workshop.author = workshop.author;
        this.workshop.address_string = workshop.sede;
        if (workshop.sede) {
          this.workshop.sede = workshop.sede;
        }
        this.selectedDate = moment(workshop.start_date).utc().format('YYYY-MM-DD');
        this.selectedHour = moment(workshop.start_date).utc().format('YYYY-MM-DD HH:mm');
        this.workshop.address = workshop.position_string;
        // this.workshop.specialist_uuid = this.consultant.uuid;
        this.workshop.specialist_uuid = workshop.specialist.length > 0 ? workshop.specialist[0].uuid : ''
        this.workshop.specialist = workshop.specialist.length > 0 ? workshop.specialist[0].uuid : ''
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
      this.workshop.start_date = `${date} ${hour}`;
      if (this.workshop.sede === null || this.workshop.sede.trim() === '') {
        delete this.workshop.sede;
      }
      this.workshop.duration = +this.workshop.duration; // to make sure it is an integer, otherwise server crashes
      this.workshop.specialist_uuid = this.workshop.specialist ? this.workshop.specialist : ''
      // not implemented yet.
      // delete this.workshop.private;

      if (this.editMode) {
        this.editWorkshop();
      } else {
        this.createWorkshop();
      }
    }
  }

  private editWorkshop() {
    this.workshop.description = this.workshop.description_workshop
    this.workshop.sede = this.workshop.address_string
    this.workshop.address = ""
    const data = {...this.workshop};
    let id = null
    this.route.paramMap.subscribe((params: ParamMap) => {
      id = params.get('workshop');
      this.fetchWorkshop(id);
    });
    delete data.author;
    delete data.id_name;
    this.workshopService.editWorkshop(this.workshop, id)
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
    this.workshop.start_date = `${date} ${hour}`;
    // if (this.workshop.sede === null || (this.workshop.sede && this.workshop.sede.trim() === '')) {
    //   delete this.workshop.sede;
    // }
    this.workshop.duration = +this.workshop.duration; // to make sure it is an integer, otherwise server crashes

    // not implemented yet.
    delete this.workshop.private;
    this.workshop.description = this.workshop.description_workshop
    // this.workshop.sede = ""
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
        console.log(response)
        this.workshop.sede = response.formattedAddress;
        this.workshop.address_string = response.formattedAddress;
        this.workshop.lat = response.lat;
        this.workshop.lng = response.lng;
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
