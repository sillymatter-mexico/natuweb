import {Component, Input} from '@angular/core';
import {ServerService} from '../../services/server.service';

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})

export class AvatarComponent {
  private _consultant;
  public avatarURL: string;
  public _url: string;

  constructor(public serverService: ServerService){
    this._url = this.serverService.url;
  }

  @Input() set consultant(consultant) {
    this._consultant = consultant;
    this.avatarURL = this._url + consultant.avatar.image
  }

  get consultant() {
    return this._consultant;
  }

  get avatarUrl() {
    return this.avatarUrl;
  }

  @Input() public size: string;

}
