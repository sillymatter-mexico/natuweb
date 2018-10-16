import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public consultant: any;
  @Input() public mine: boolean;

  constructor(private router: Router, private workshopService: WorkshopService) {
    this.workshopList = [];
    this.mine = false;
  }

  ngOnInit() {
  }

  onOpenWorkshop(workshop: any) {
    if (this.mine) {
      this.router.navigate(['/talleres', 'taller', workshop.id]);
    } else {
      /* TO DO */
    }
  }

}
