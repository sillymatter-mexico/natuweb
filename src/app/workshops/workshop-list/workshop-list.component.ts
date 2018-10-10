import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit {

  @Input() public workshopList: any[];

  constructor() {
    this.workshopList = [];
  }

  ngOnInit() {
  }

}
