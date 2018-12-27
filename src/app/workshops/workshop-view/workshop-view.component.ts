import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../services/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WorkshopCheckinComponent} from '../workshop-checkin/workshop-checkin.component';
import {WorkshopAddStaffComponent} from '../workshop-add-staff/workshop-add-staff.component';
import {WorkshopDeleteComponent} from '../workshop-delete/workshop-delete.component';
import {GeneralModalAlertComponent} from '../../shared/general-modal-alert/general-modal-alert.component';
import {ServerService} from '../../services/server.service';

@Component({
  selector: 'app-workshop-view',
  templateUrl: './workshop-view.component.html',
  styleUrls: ['./workshop-view.component.scss']
})
export class WorkshopViewComponent implements OnInit {

  public workshop: any;
  public loading: boolean;
  private consultant: any;
  private checkinModal: BsModalRef;
  private addStaffModal: BsModalRef;
  private deleteModal: BsModalRef;
  public watchPermission: any;
  public showShare: boolean;
  public shareURL: string;
  public _url: string;

  constructor(private route: ActivatedRoute,
              public serverService: ServerService,
              private workshopService: WorkshopService,
              private toastr: ToastrService,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router) {
    this.loading = false;
    this.showShare = false;
    this._url = this.serverService.url;
  }

  ngOnInit() {
    this.watchPermission = this.workshopService.watchPermission;
    this.consultant = this.userService.consultant;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.fetchWorkshop(id);
    });
  }

  isWorkshopLeader() {
    return this.consultant.uuid === this.workshop.author.uuid;
  }

  fetchWorkshop(id: string) {
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        this.workshop = response;
        this.workshop.image = response.name_workshop ? this._url + response.name_workshop.image : ''
        this.workshop.assistance  = response.assistance;
        if (this.isWorkshopLeader() ||
            (this.watchPermission.permission && +this.watchPermission.workshop === +id)) {
          this.fetchLeaderData(this.consultant.uuid);
        } else {
          this.loading = false;
          this.router.navigate(['/talleres', 'invitacion', id]);
        }
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Ocurrió un error al cargar el taller');
      });
  }

  fetchLeaderData(id: string) {
    this.workshopService.getLeaderWorkshop(id)
      .subscribe((response: any) => {
        this.shareURL = window.location.origin + '/talleres/invitacion/' + this.workshop.id;
        this.workshop.assists = response.assists;
        this.loading = false;
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Ocurrió un error al cargar el taller');
      });
  }

  getMapsURI() {
    return 'https://maps.google.com/?q=' + encodeURI(this.workshop.position_string);
  }

  onCheckinLoad() {
    const initialState = {
      workshop: this.workshop,
      checkin: true
    };
    this.checkinModal = this.modalService.show(WorkshopCheckinComponent, {initialState});
  }

  onAttendanceListLoad() {

    this.loading = true;
    this.workshopService.getWorkShopAssistance(this.workshop.uuid)
      .subscribe((response: any) => {
        this.loading = false;
        const initialState = {
          workshop: this.workshop,
          checkin: false,
          assists: response
        };
        this.checkinModal = this.modalService.show(WorkshopCheckinComponent, {initialState});
      }, (error: any) => {
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
        console.log('error', error);
      });

  }

  onDownloadAssistanceList() {
    this.loading = true;
    this.workshopService.downloadWorkShopAssistance(this.workshop.uuid)
      .subscribe((response: any) => {
        this.loading = false
        console.log(response)
        let initialState = {
          'messages': response.messages
        }
        this.checkinModal = this.modalService.show(GeneralModalAlertComponent, {initialState});
      });
  }

  onAddStaff() {
    const initialState = {
      workshop: this.workshop
    };
    this.addStaffModal = this.modalService.show(WorkshopAddStaffComponent, {initialState});
  }

  onSendReport() {
    this.workshopService.sendReport(this.consultant.email, this.workshop.id)
      .subscribe((data: any) => {
        this.toastr.success('Reporte enviado a ' + this.consultant.email);
      }, (error: any) => {
        this.toastr.error('Ocurrió un error al enviar el reporte');
      });
  }

  onDeleteWorkshop() {
    const initialState = {
      workshop: this.workshop
    };
    this.deleteModal = this.modalService.show(WorkshopDeleteComponent, {initialState});
  }

  onEditWorkshop() {
    this.router.navigate(['/talleres', 'editar', this.workshop.uuid]);
  }

  enabledCheckin() {
    const now = new Date();
    const finish_date = this.toNormalDate(new Date(this.workshop.finish_date));
    const start_date =  this.toNormalDate(new Date(this.workshop.start_date));
    start_date.setHours(start_date.getHours() - 1);
    if (this.consultant.isDRV) {
      finish_date.setDate(finish_date.getDate() + 30);
    } else {
      finish_date.setDate(finish_date.getDate() + 14);
    }
    return this.isWorkshopLeader() && this.isAfter(now, start_date) && this.isBefore(now, finish_date);
  }

  enabledAddStaff() {
    const now = new Date();
    const finish_date = this.toNormalDate(new Date(this.workshop.finish_date));
    return this.isWorkshopLeader() && this.isBefore(now, finish_date);
  }

  toggleShare() {
    this.showShare = !this.showShare;
  }

  isBefore(date1, date2) {
    return date1 < date2;
  }

  isAfter(date1, date2) {
    return date1 > date2;
  }

  toNormalDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    return new Date(year, month, day, hour, minute);
  }

}
