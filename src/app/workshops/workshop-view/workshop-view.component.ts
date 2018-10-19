import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../services/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WorkshopCheckinComponent} from '../workshop-checkin/workshop-checkin.component';
import {WorkshopAddStaffComponent} from '../workshop-add-staff/workshop-add-staff.component';

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
  public watchPermission: any;

  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private toastr: ToastrService,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router) {
    this.loading = false;
  }

  ngOnInit() {
    this.watchPermission = this.workshopService.watchPermission;
    this.consultant = this.userService.consultant;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.fetchWorkshop(+id);
    });
  }

  isWorkshopLeader() {
    return this.consultant.id === this.workshop.author.id;
  }

  fetchWorkshop(id: number) {
    this.loading = true;
    this.workshopService.getWorkshop(id)
      .subscribe((response: any) => {
        this.workshop = response.workshop;
        this.workshop.assistance  = response.assistance;
        if (this.isWorkshopLeader() ||
            (this.watchPermission.permission && +this.watchPermission.workshop === +id)) {
          this.fetchLeaderData(id);
        } else {
          this.loading = false;
          this.router.navigate(['/talleres']);
        }
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Ocurrió un error al cargar el taller');
      });
  }

  fetchLeaderData(id: number) {
    this.workshopService.getLeaderWorkshop(id)
      .subscribe((response: any) => {
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
    const initialState = {
      workshop: this.workshop,
      checkin: false
    };
    this.checkinModal = this.modalService.show(WorkshopCheckinComponent, {initialState});
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

  enabledCheckin() {
    const now = new Date();
    const finish_date = this.toNormalDate(new Date(this.workshop.finish_date));
    const start_date =  this.toNormalDate(new Date(this.workshop.start_date));
    const open_date = start_date.setHours(start_date.getHours() - 1);
    let expire_date = finish_date.setDate(finish_date.getDate() + 14);
    if (this.consultant && this.consultant.isDRV) {
      expire_date = finish_date.setDate(finish_date.getDate() + 30);
    }
    return this.consultant.isDRV && this.isAfter(now, open_date) && this.isBefore(now, expire_date);
  }

  enabledAddStaff() {
    const now = new Date();
    const finish_date = this.toNormalDate(new Date(this.workshop.finish_date));
    return this.isBefore(now, finish_date) && this.consultant.isDRV;
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
