import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public consultant: any;
  @Input() public mine: boolean;

  constructor(private router: Router, private workshopService: WorkshopService, private userService: UserService) {
    this.workshopList = [];
    this.mine = false;
  }

  ngOnInit() {
  }

  onOpenWorkshop(workshop: any) {
    let watchPermission: any;
    if (this.mine || +workshop.author.id === +this.userService.consultant.id) {
      watchPermission = {
        permission: true,
        workshop: workshop.id
      };
      this.workshopService.watchPermission = watchPermission;
      this.router.navigate(['/talleres', 'taller', workshop.id]);
    } else {
      /* TO DO */
    }
  }

}
