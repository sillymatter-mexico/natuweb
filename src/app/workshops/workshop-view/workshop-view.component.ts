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

  constructor(private route: ActivatedRoute,
              private workshopService: WorkshopService,
              private toastr: ToastrService,
              private userService: UserService,
              private modalService: BsModalService,
              private router: Router) {
    this.loading = false;
  }

  ngOnInit() {
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
        if (this.isWorkshopLeader()) {
          this.fetchLeaderData(id);
        } else {
          this.router.navigate(['/inicio']);
          this.loading = false;
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
        console.log(this.workshop);
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
    this.checkinModal = this.modalService.show(WorkshopAddStaffComponent, {initialState});
  }

  onSendReport() {
    this.workshopService.sendReport(this.consultant.email, this.workshop.id)
      .subscribe((data: any) => {
        this.toastr.success('Reporte enviado a ' + this.consultant.email);
      }, (error: any) => {
        this.toastr.error('Ocurrió un error al enviar el reporte');
      });
  }

}
