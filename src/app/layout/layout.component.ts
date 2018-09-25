import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {

  public sidebarEnabled: boolean;

  constructor() {
    this.sidebarEnabled = false;
  }

  ngOnInit() {
  }

  onSidebarToggled(isEnabled: boolean) {
    this.sidebarEnabled = isEnabled;
  }

}
