import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {WorkshopService} from '../../services/workshop.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-workshop-add-staff',
  templateUrl: './workshop-add-staff.component.html',
  styleUrls: ['./workshop-add-staff.component.scss']
})
export class WorkshopAddStaffComponent implements OnInit {

  public workshop: any;
  public addInput: number;
  public loading: boolean;
  public loadingSearch: boolean;
  public currentStaff: any;

  constructor(private _bsModalRef: BsModalRef, private workshopService: WorkshopService, private toastr: ToastrService) {
    this.loading = false;
    this.loadingSearch = false;
  }

  ngOnInit() {
  }

  closeModal() {
    this._bsModalRef.hide();
  }

  onAddStaff() {
    this.loadingSearch = true;
    this.workshopService.searchStaff(this.workshop.id, this.addInput)
      .subscribe((response: any) => {
        this.loadingSearch = false;
        this.currentStaff = response;
        this.currentStaff.cn = this.addInput;
        this.addInput = undefined;
      } , (error: any) => {
        this.loadingSearch = false;
        this.addInput = undefined;
        console.log(error);
        this.toastr.error('No se encontró el CN solicitado');
      });
  }

  saveStaff() {
    this.loading = true;
    const data = {
      workshop_ID: this.workshop.id,
      cn_code: this.currentStaff.cn
    };
    this.workshopService.addStaff(data)
      .subscribe((response: any) => {
        this.loading = false;
        this.toastr.success('Se ha añadido correctamente a ' + this.currentStaff.user + ' como staff');
        this.currentStaff = null;
      } , (error: any) => {
        this.loading = false;
        console.log(error);
        this.toastr.error('Ocurrió un error al agregar al staff');
      });
  }

  cancelAddStaff() {
    this.currentStaff = null;
    this.toastr.error('Se canceló la solicitud');
  }

}