import { Component, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {GeneralModalAlertComponent} from '../general-modal-alert/general-modal-alert.component';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss']
})


export class InputModalComponent implements OnInit {

  public messages: string;
  public loading: boolean;
  public workshop: any;
  public consultant: any;
  public email: string;
  public workshop_uuid: string;
  public addInput: string;
  private checkinModal: BsModalRef;


  constructor(private _bsModalRef: BsModalRef,
              private workshopService: WorkshopService,
              private modalService: BsModalService,
              private router: Router) {
  this.loading = false;
  }

  ngOnInit() {
  }

  onClose() {
    this._bsModalRef.hide();
  }

  onDownloadAssistanceList() {
    console.log('mamees', this.addInput)
    this.loading = true;
    this.workshopService.downloadWorkShopAssistance(this.workshop_uuid, this.addInput)
      .subscribe((response: any) => {
        this.loading = false
        this._bsModalRef.hide();
        let initialState = {
          'messages': response.messages
        }
        this.checkinModal = this.modalService.show(GeneralModalAlertComponent, {initialState});
      });
  }

}
