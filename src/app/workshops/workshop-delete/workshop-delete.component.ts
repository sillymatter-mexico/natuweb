import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-delete',
  templateUrl: './workshop-delete.component.html',
  styleUrls: ['./workshop-delete.component.scss']
})
export class WorkshopDeleteComponent implements OnInit {

  public workshop: any;

  constructor(private _bsModalRef: BsModalRef,
              private router: Router,
              private workshopService: WorkshopService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  deleteWorkshop() {
    this.workshopService.deleteWorkshop(this.workshop.uuid)
      .subscribe((response: any) => {
        this.router.navigate(['/talleres', 'mios']);
        this.toastr.success('Taller borrado');
        this._bsModalRef.hide();
      }, (error: any) => {
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al eliminar el taller');
        this._bsModalRef.hide();
      });
  }

}
