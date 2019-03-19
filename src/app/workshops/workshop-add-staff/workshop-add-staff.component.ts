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
  public staffResults: any;

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
    this.workshopService.searchStaff(this.workshop.uuid, this.addInput)
      .subscribe((response: any) => {
        this.loadingSearch = false;
        this.currentStaff = response.length > 0 ? response[0] : response ;
        this.staffResults = response
        this.currentStaff.cn = this.addInput;
        this.addInput = undefined;
      } , (error: any) => {
        this.loadingSearch = false;
        this.addInput = undefined;
        console.log(error);
        this.toastr.error('No se encontró el CN solicitado');
      });
  }

  saveStaff(staff, i) {
    this.loading = true;
    let formdata = []
    formdata.push(staff.cn)
    const data = {
      cn_list: `${staff.cn_code},${staff.full_name}`
    };
    this.workshopService.addStaff(this.workshop.uuid, data)
      .subscribe((response: any) => {
        this.loading = false;
        this.toastr.success('Se ha añadido correctamente a ' + staff.full_name + ' como staff');
        this.staffResults.splice(i, 1)
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
