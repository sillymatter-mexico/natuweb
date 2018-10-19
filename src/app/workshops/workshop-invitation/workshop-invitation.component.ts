import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {BsModalRef} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-invitation',
  templateUrl: './workshop-invitation.component.html',
  styleUrls: ['./workshop-invitation.component.scss']
})
export class WorkshopInvitationComponent implements OnInit {

  public workshop: any;
  public loading: boolean;

  constructor(private workshopService: WorkshopService,
              private _bsModalRef: BsModalRef,
              private toastr: ToastrService) {
    this.loading = false;
  }

  ngOnInit() {
    this.fetchWorkshop();
  }

  getMapsURI() {
    return 'https://maps.google.com/?q=' + encodeURI(this.workshop.position_string);
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  fetchWorkshop() {
    this.loading = true;
    this.workshopService.getWorkshop(this.workshop.id)
      .subscribe((response: any) => {
        this.workshop = response.workshop;
        this.loading = false;
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al cargar detalles del taller');
        this.loading = false;
      });
  }

}
