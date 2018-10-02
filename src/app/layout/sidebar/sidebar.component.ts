import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() private sidebarToggle: EventEmitter<boolean>;
  public isEnabled: boolean;
  public consultant: any;
  public menuItems: any[];

  constructor(private userService: UserService) {
    this.sidebarToggle = new EventEmitter<boolean>();
    this.isEnabled = false;
    this.consultant = this.userService.consultant;
    this.menuItems = [
      {name: 'Inicio', icon: 'home', route: '/inicio'},
      {name: 'Talleres', icon: 'workshop', route: '/talleres'},
      {name: 'Boletín natura', icon: 'news', route: '/boletin'},
      {name: 'Editar mi perfil', icon: 'profile', route: '/perfil'},
      {name: 'Ayuda', icon: 'help', route: '/ayuda'},
    ];
  }

  ngOnInit() {
  }

  onToggleSidebar() {
    this.isEnabled = !this.isEnabled;
    this.sidebarToggle.emit(this.isEnabled);
  }

}
