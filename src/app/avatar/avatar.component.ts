import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})

export class AvatarComponent {
  private _consultant;

  @Input() set consultant(consultant) {
    this._consultant = consultant;
    if (this.consultant.accessories == null || this.consultant.accessories.length === 0) {
      this.consultant.accessories = this.consultant.avatar.accessories;
    }
  }

  get consultant() {
    return this._consultant;
  }

  @Input() public size: string;

}
