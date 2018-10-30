import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WorkshopInvitationComponent} from '../workshop-invitation/workshop-invitation.component';
import {WorkshopService} from '../../services/workshop.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-workshop-list-preview',
  templateUrl: './workshop-list-preview.component.html',
  styleUrls: ['./workshop-list-preview.component.scss']
})
export class WorkshopListPreviewComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public size: string;
  @Input() public url: string;
  @Input() public mine: boolean;
  @Input() public canScroll: boolean;
  private workshopModal: BsModalRef;

  constructor(private router: Router,
              private workshopService: WorkshopService,
              private modalService: BsModalService,
              private userService: UserService) {
    this.workshopList = [];
    this.title = '';
    this.mine = false;
    this.canScroll = false;
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
      const initialState = {
        workshop: workshop,
        modal: true
      };
      this.workshopModal = this.modalService.show(WorkshopInvitationComponent, {initialState, class: 'modal-lg'});
    }
  }

}
