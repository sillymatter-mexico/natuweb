import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppService} from '../../services/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private appService: AppService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  onSidebarToggle() {
    this.appService.toggleSidebar();
  }

}
