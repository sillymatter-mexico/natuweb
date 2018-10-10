import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public workshopTypeList: any[];

  constructor(private workshopService: WorkshopService) {
    this.workshopTypeList = this.workshopService.workshopTypeList;
  }

  ngOnInit() {
  }

}
