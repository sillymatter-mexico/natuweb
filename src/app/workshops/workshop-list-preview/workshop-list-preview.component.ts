import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workshop-list-preview',
  templateUrl: './workshop-list-preview.component.html',
  styleUrls: ['./workshop-list-preview.component.scss']
})
export class WorkshopListPreviewComponent implements OnInit {

  @Input() public workshopList: any[];
  @Input() public title: string;
  @Input() public size: string;
  @Input() public url: string;
  @Input() public mine: boolean;

  constructor(private router: Router) {
    this.workshopList = [];
    this.title = '';
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
