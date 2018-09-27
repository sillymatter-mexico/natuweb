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
  public avatarSize: string;

  constructor(private userService: UserService) {
    this.sidebarToggle = new EventEmitter<boolean>();
    this.isEnabled = false;
    this.consultant = this.userService.consultant;
  }

  ngOnInit() {
  }

  onToggleSidebar() {
    this.isEnabled = !this.isEnabled;
    this.sidebarToggle.emit(this.isEnabled);
  }

}
