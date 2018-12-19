import { Component, OnInit } from '@angular/core';
import {Workshop} from '../../interfaces/workshop.interface';
import {BsModalRef} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';

@Component({
  selector: 'app-workshop-created',
  templateUrl: './workshop-massive-created.component.html',
  styleUrls: ['./workshop-massive-created.component.scss']
})
export class WorkshopMassiveCreatedComponent implements OnInit {

  public workshop: Workshop;
  public assitance: boolean;
  public confirmName: boolean;

  constructor(private _bsModalRef: BsModalRef,
              private router: Router,
              private workshopService: WorkshopService) {
    this.assitance = false;
  }

  ngOnInit() {
  }

  onWorkshopLoad() {
    this.workshopService.clearSelectedWorkshopType();
    this._bsModalRef.hide();
  }

  onWorkshopsLoad() {
    this.router.navigate(['/talleres', 'mios']);
    this.workshopService.clearSelectedWorkshopType();
    this._bsModalRef.hide();
  }

}
