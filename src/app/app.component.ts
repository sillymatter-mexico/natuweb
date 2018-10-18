import { Component } from '@angular/core';
import {BsLocaleService} from 'ngx-bootstrap';
import {RouterExtendService} from './services/router-extend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private ngxbLocale: BsLocaleService, private routerExtend: RouterExtendService) {
    this.ngxbLocale.use('es');
  }
}
