import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {AppService} from '../../services/app.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public isEnabled: boolean;
  public consultant: any;
  public menuItems: any[];

  constructor(private userService: UserService,
              private appService: AppService,
              private authService: AuthService) {
    this.isEnabled = appService.sidebarToggled;
    this.consultant = this.userService.consultant;
    this.menuItems = [
      {name: 'Inicio', icon: 'home', route: '/inicio'},
      {name: 'Talleres', icon: this.userService.isLeader ? 'workshop' : 'workshop-cn', route: '/talleres'},
      {name: 'Boletín Mi Natura', icon: 'news', route: '/boletin'},
      {name: 'Editar mi perfil', icon: 'profile', route: '/perfil'},
      /* {name: 'Ayuda', icon: 'help', route: '/ayuda'}, */
      {name: 'Cerrar sesión', icon: 'logout', action: () => this.authService.logout()},
    ];
  }

  ngOnInit() {
    this.appService.sidebarToggle
      .subscribe((status: boolean) => this.isEnabled = status);
  }

  onToggleSidebar() {
    this.appService.toggleSidebar();
  }

}
