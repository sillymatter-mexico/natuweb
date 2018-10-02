import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-workshop-list-preview',
  templateUrl: './workshop-list-preview.component.html',
  styleUrls: ['./workshop-list-preview.component.scss']
})
export class WorkshopListPreviewComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public title: string;
  @Input() public size: string;

  constructor() {
    this.workshopList = [];
    this.title = '';
  }

  ngOnInit() {
  }

}
