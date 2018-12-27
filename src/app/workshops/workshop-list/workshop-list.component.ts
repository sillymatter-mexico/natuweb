import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import {UserService} from '../../services/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {WorkshopInvitationComponent} from '../workshop-invitation/workshop-invitation.component';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public consultant: any;
  @Input() public mine: boolean;
  private workshopModal: BsModalRef;

  constructor(private router: Router,
              private workshopService: WorkshopService,
              private userService: UserService,
              private modalService: BsModalService) {
    this.workshopList = [];
    this.mine = false;
  }

  ngOnInit() {
  }

  onOpenWorkshop(workshop: any) {
    let watchPermission: any;
    if (this.mine || +workshop.author.uuid === +this.userService.consultant.uuid) {
      watchPermission = {
        permission: true,
        workshop: workshop.uuid
      };
      this.workshopService.watchPermission = watchPermission;
      this.router.navigate(['/talleres', 'taller', workshop.uuid]);
    } else {
      const initialState = {
        workshop: workshop,
        modal: true
      };
      this.workshopModal = this.modalService.show(WorkshopInvitationComponent, {initialState, class: 'modal-lg'});
    }
  }

}
