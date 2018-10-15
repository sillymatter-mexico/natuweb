import { Component, OnInit } from '@angular/core';
import {Workshop} from '../../interfaces/workshop.interface';
import {BsModalRef} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';

@Component({
  selector: 'app-workshop-created',
  templateUrl: './workshop-created.component.html',
  styleUrls: ['./workshop-created.component.scss']
})
export class WorkshopCreatedComponent implements OnInit {

  public workshop: Workshop;

  constructor(private _bsModalRef: BsModalRef, private router: Router, private workshopService: WorkshopService) { }

  ngOnInit() {
  }

  onWorkshopLoad() {
    this.workshopService.clearSelectedWorkshopType();
    this._bsModalRef.hide();
  }

  onWorkshopsLoad() {
    this.router.navigate(['/talleres']);
    this.workshopService.clearSelectedWorkshopType();
    this._bsModalRef.hide();
  }

}
