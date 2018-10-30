import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AppService} from '../services/app.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {

  public sidebarEnabled: boolean;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.sidebarEnabled = this.appService.sidebarToggled;

    this.appService.sidebarToggle
      .subscribe((status: boolean) => this.sidebarEnabled = status);
  }

}
