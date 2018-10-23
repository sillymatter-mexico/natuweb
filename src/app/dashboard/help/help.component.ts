import { Component, OnInit } from '@angular/core';
import {WorkshopService} from '../../services/workshop.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public workshopTypeList: any[];

  constructor(private workshopService: WorkshopService,
              private router: Router,
              private userService: UserService) {
    this.workshopTypeList = this.workshopService.workshopTypeList;
  }

  ngOnInit() {
  }

  isLeader() {
    return this.userService.isLeader;
  }

  goToCreate(workshopType: any) {
    if (this.isLeader()) {
      this.router.navigate(['/talleres', 'crear', workshopType.alias]);
    }
  }

}
